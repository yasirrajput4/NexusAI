import { useState, useCallback, useEffect } from "react";
import {
  loadThreads,
  saveThreads,
  loadActiveThreadId,
  saveActiveThreadId,
  createThread,
  autoNameThread,
} from "../utils/threadUtils";

function migrateMessages(threads) {
  return threads.map((thread) => ({
    ...thread,
    messages: thread.messages.map((msg) =>
      msg.id
        ? msg
        : {
            ...msg,
            id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          },
    ),
  }));
}

export function useThreads() {
  const [threads, setThreads] = useState(() => migrateMessages(loadThreads()));
  const [activeThreadId, setActiveThreadId] = useState(() => {
    const savedId = loadActiveThreadId();
    const allThreads = loadThreads();
    if (savedId && allThreads.find((t) => t.id === savedId)) return savedId;
    return allThreads.length > 0 ? allThreads[0].id : null;
  });

  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

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
      const updatedThreads = threads.filter((t) => t.id !== threadId);
      setThreads(updatedThreads);
      if (threadId === activeThreadId) {
        setActiveThreadId(
          updatedThreads.length > 0 ? updatedThreads[0].id : null,
        );
      }
    },
    [threads, activeThreadId],
  );

  const clearAllThreads = useCallback(() => {
    setThreads([]);
    setActiveThreadId(null);
    localStorage.clear();
  }, []);

  const addMessage = useCallback(
    (message) => {
      if (!activeThreadId) return;

      const messageWithId = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      };

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== activeThreadId) return thread;
          const isFirstUserMessage =
            messageWithId.role === "user" && thread.messages.length === 0;
          return {
            ...thread,
            title: isFirstUserMessage
              ? autoNameThread(messageWithId.text)
              : thread.title,
            messages: [...thread.messages, messageWithId],
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
