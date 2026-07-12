import { useEffect, useRef } from "react";
import { MessageBubble, SkeletonLoader } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";

export function ChatWindow({
  activeThread,
  isLoading,
  onSendMessage,
  onSidebarToggle,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.messages?.length, isLoading]);

  const isEmpty = !activeThread || activeThread.messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header — sirf active chat mein dikhega */}
      {!isEmpty && (
        <header className="flex items-center gap-3 px-4 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 shrink-0 sticky top-0 z-10">
          <button
            type="button" // Fixed: Added explicit type
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-zinc-100 truncate">
              {activeThread.title}
            </h2>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/40">
            <span className="text-[11px] text-zinc-500 tabular-nums">
              {activeThread.messages.length} msg
              {activeThread.messages.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[11px] text-zinc-600">Llama 3.3</span>
          </div>
        </header>
      )}

      {/* EMPTY STATE — hero + input centered */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Mobile menu */}
          <div className="absolute top-3 left-4 lg:hidden">
            <button
              type="button" // Fixed: Added explicit type
              onClick={onSidebarToggle}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Hero */}
          <EmptyState />

          {/* Input — centered, max-width same as chat */}
          <div className="w-full max-w-2xl mt-12">
            <ChatInput
              onSubmit={onSendMessage}
              isLoading={isLoading}
              disabled={!activeThread}
            />
          </div>
        </div>
      ) : (
        /* ACTIVE CHAT */
        <>
          <div className="flex-1 overflow-y-auto chat-scroll">
            <div className="max-w-3xl mx-auto w-full py-4">
              {activeThread.messages.map((message, index) => (
                <MessageBubble
                  key={`${message.role}-${index}`}
                  message={message}
                  isLast={index === activeThread.messages.length - 1}
                />
              ))}
              {isLoading && <SkeletonLoader />}
              <div ref={bottomRef} className="h-4" />
            </div>
          </div>
          <div className="max-w-3xl mx-auto w-full shrink-0">
            <ChatInput
              onSubmit={onSendMessage}
              isLoading={isLoading}
              disabled={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
