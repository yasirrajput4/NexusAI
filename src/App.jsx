import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatWindow } from "./components/ChatWindow";
import { useThreads } from "./hooks/useThreads";
import { useGroqAPI } from "./hooks/useGroqAPI";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    threads,
    activeThread,
    activeThreadId,
    createNewThread,
    selectThread,
    deleteThread,
    clearAllThreads,
    addMessage,
    renameThread,
  } = useThreads();

  const { isLoading, sendMessage, clearError } = useGroqAPI();

  // Auto-create a thread on first load if none exist
  useEffect(() => {
    if (threads.length === 0) {
      createNewThread();
    }
  }, [threads.length, createNewThread]);

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
        thread = createNewThread();
        await new Promise((r) => setTimeout(r, 0));
      }

      const userMessage = { role: "user", text };
      addMessage(userMessage);

      const history = [...(thread?.messages || []), userMessage];

      try {
        const responseText = await sendMessage(history, null);

        if (responseText) {
          addMessage({ role: "model", text: responseText });
        }
      } catch (err) {
        const errMsg = err.message || "Something went wrong.";
        addMessage({ role: "error", text: errMsg });
        clearError(); 
      }
    },
    [activeThread, createNewThread, addMessage, sendMessage, clearError],
  );

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
