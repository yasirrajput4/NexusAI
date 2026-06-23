import { useState, useCallback, useEffect } from "react";
import {
  loadThreads,
  saveThreads,
  loadActiveThreadId,
  saveActiveThreadId,
  createThread,
  autoNameThread,
} from "../utils/threadUtils";

export function useThreads() {
  const [threads, setThreads] = useState(() => loadThreads());
  const [activeThreadId, setActiveThreadId] = useState(() => {
    const savedId = loadActiveThreadId();
    const allThreads = loadThreads();
    if (savedId && allThreads.find((t) => t.id === savedId)) return savedId;
    return allThreads.length > 0 ? allThreads[0].id : null;
  });

  // Persist threads to localStorage whenever they change
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  // Persist active thread ID
  useEffect(() => {
    saveActiveThreadId(activeThreadId);
  }, [activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const createNewThread = useCallback(() => {
    const thread = createThread("New Chat");
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(thread.id);
    return thread;
  }, []);

  const selectThread = useCallback((threadId) => {
    setActiveThreadId(threadId);
  }, []);

  const deleteThread = useCallback(
    (threadId) => {
      setThreads((prev) => {
        const updated = prev.filter((t) => t.id !== threadId);
        // If we deleted the active thread, switch to the first remaining
        if (threadId === activeThreadId) {
          if (updated.length > 0) {
            setActiveThreadId(updated[0].id);
          } else {
            setActiveThreadId(null);
          }
        }
        return updated;
      });
    },
    [activeThreadId],
  );

  const clearAllThreads = useCallback(() => {
    setThreads([]);
    setActiveThreadId(null);
    localStorage.clear();
  }, []);

  const addMessage = useCallback(
    (message) => {
      if (!activeThreadId) return;

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== activeThreadId) return thread;

          const isFirstUserMessage =
            message.role === "user" && thread.messages.length === 0;

          return {
            ...thread,
            title: isFirstUserMessage
              ? autoNameThread(message.text)
              : thread.title,
            messages: [...thread.messages, message],
            updatedAt: Date.now(),
          };
        }),
      );
    },
    [activeThreadId],
  );

  const updateLastMessage = useCallback(
    (updater) => {
      if (!activeThreadId) return;

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== activeThreadId) return thread;
          if (thread.messages.length === 0) return thread;

          const messages = [...thread.messages];
          const last = messages[messages.length - 1];
          messages[messages.length - 1] = updater(last);

          return { ...thread, messages, updatedAt: Date.now() };
        }),
      );
    },
    [activeThreadId],
  );

  const renameThread = useCallback((threadId, newTitle) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, title: newTitle } : t)),
    );
  }, []);

  return {
    threads,
    activeThread,
    activeThreadId,
    createNewThread,
    selectThread,
    deleteThread,
    clearAllThreads,
    addMessage,
    updateLastMessage,
    renameThread,
  };
}
