import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { AuthPage } from "./components/AuthPage";
import { useAuth } from "./hooks/useAuth";
import { useThreads } from "./hooks/useThreads";
import { useGroqAPI } from "./hooks/useGroqAPI";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    user,
    isLoading: authLoading,
    error: authError,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
  } = useAuth();

  const {
    threads,
    activeThread,
    activeThreadId,
    createNewThread,
    selectThread,
    deleteThread,
    clearAllThreads,
    renameThread,
    updateThreadAfterChat,
  } = useThreads(isAuthenticated);

  const { isLoading, sendMessage } = useGroqAPI();

  // Auto-create first thread after login
  useEffect(() => {
    if (isAuthenticated && threads.length === 0 && !activeThreadId) {
      createNewThread();
    }
  }, [isAuthenticated, threads.length, activeThreadId, createNewThread]);

  const handleNewChat = useCallback(() => {
    createNewThread();
    setSidebarOpen(false);
  }, [createNewThread]);

  const handleSelectThread = useCallback(
    (threadId) => {
      selectThread(threadId);
      setSidebarOpen(false);
    },
    [selectThread],
  );

  const handleSendMessage = useCallback(
    async (text) => {
      let thread = activeThread;
      if (!thread) {
        thread = await createNewThread();
        if (!thread) return;
      }

      const userMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        text,
      };

      // Optimistically add user message to UI
      updateThreadAfterChat(thread._id, userMessage, null, null);

      try {
        const currentMessages = [...(thread.messages || []), userMessage];
        const data = await sendMessage(thread._id, currentMessages);

        // Update UI with AI response + optional new title
        updateThreadAfterChat(thread._id, null, data.message, data.title);
      } catch (err) {
        const errMessage = {
          id: `msg_${Date.now()}_err`,
          role: "error",
          text: err.message || "Something went wrong.",
        };
        updateThreadAfterChat(thread._id, null, errMessage, null);
      }
    },
    [activeThread, createNewThread, sendMessage, updateThreadAfterChat],
  );

  // Show loading screen while verifying token
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return (
      <AuthPage
        onLogin={login}
        onRegister={register}
        error={authError}
        isLoading={authLoading}
        onClearError={clearError}
      />
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar
        threads={threads}
        activeThreadId={activeThreadId}
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        onDeleteThread={deleteThread}
        onClearAll={clearAllThreads}
        onRenameThread={renameThread}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={logout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatWindow
          activeThread={activeThread}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onSidebarToggle={() => setSidebarOpen((p) => !p)}
        />
      </main>
    </div>
  );
}

export default App;
