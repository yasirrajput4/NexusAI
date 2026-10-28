import { useState, useCallback, useEffect } from "react";
import { API_BASE_URL } from "../constants";

export function useThreads(isAuthenticated) {
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeThread = threads.find((t) => t._id === activeThreadId) || null;

  const getToken = () => localStorage.getItem("nexusai_token");

  useEffect(() => {
    if (!isAuthenticated) {
      setThreads([]);
      setActiveThreadId(null);
      return;
    }

    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/threads`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();
        if (response.ok) {
          setThreads(data.threads);
          if (data.threads.length > 0) {
            setActiveThreadId(data.threads[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to load threads:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [isAuthenticated]);

  const createNewThread = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: "New Chat" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setThreads((prev) => [data.thread, ...prev]);
      setActiveThreadId(data.thread._id);
      return data.thread;
    } catch (err) {
      console.error("Failed to create thread:", err);
    }
  }, []);

  const selectThread = useCallback(
    async (threadId) => {
      setActiveThreadId(threadId);

      const thread = threads.find((t) => t._id === threadId);
      if (thread && thread.messages) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/threads/${threadId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setThreads((prev) =>
            prev.map((t) => (t._id === threadId ? data.thread : t)),
          );
        }
      } catch (err) {
        console.error("Failed to load thread:", err);
      }
    },
    [threads],
  );

  const deleteThread = useCallback(
    async (threadId) => {
      try {
        await fetch(`${API_BASE_URL}/api/threads/${threadId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        setThreads((prev) => {
          const updated = prev.filter((t) => t._id !== threadId);
          if (threadId === activeThreadId) {
            setActiveThreadId(updated.length > 0 ? updated[0]._id : null);
          }
          return updated;
        });
      } catch (err) {
        console.error("Failed to delete thread:", err);
      }
    },
    [activeThreadId],
  );

  const clearAllThreads = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/threads`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setThreads([]);
      setActiveThreadId(null);
    } catch (err) {
      console.error("Failed to clear threads:", err);
    }
  }, []);

  const renameThread = useCallback(async (threadId, newTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/threads/${threadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await response.json();
      if (response.ok) {
        setThreads((prev) =>
          prev.map((t) =>
            t._id === threadId ? { ...t, title: data.thread.title } : t,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to rename thread:", err);
    }
  }, []);

  const updateThreadAfterChat = useCallback(
    (threadId, userMessage, aiMessage, newTitle) => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t._id !== threadId) return t;
          const newMessages = [userMessage, aiMessage].filter(Boolean);
          return {
            ...t,
            title: newTitle || t.title,
            messages: [...(t.messages || []), ...newMessages],
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  return {
    threads,
    activeThread,
    activeThreadId,
    isLoading,
    createNewThread,
    selectThread,
    deleteThread,
    clearAllThreads,
    renameThread,
    updateThreadAfterChat,
  };
}
