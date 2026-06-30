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
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.messages?.length, isLoading]);

  const isEmpty = !activeThread || activeThread.messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Sticky header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 shrink-0 sticky top-0 z-10">
        {/* Mobile sidebar toggle */}
        {/* 🔧 FIX: Added missing aria-label for the icon button */}
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label="Open sidebar panel"
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

        {/* Thread title */}
        <div className="flex-1 min-w-0">
          {activeThread ? (
            <h2 className="text-sm font-medium text-zinc-100 truncate">
              {activeThread.title}
            </h2>
          ) : (
            <h2 className="text-sm font-medium text-zinc-500">
              Select or start a conversation
            </h2>
          )}
        </div>

        {/* Right side: message count */}
        {activeThread && activeThread.messages.length > 0 && (
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/40">
            <svg
              className="w-3 h-3 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-[11px] text-zinc-500 tabular-nums">
              {activeThread.messages.length} msg
              {activeThread.messages.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Model badge */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] text-zinc-600">Llama 3.3</span>
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll">
        {isEmpty ? (
          <EmptyState onSelectPrompt={onSendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto w-full py-4">
            {activeThread.messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}`}
                message={message}
                isLast={index === activeThread.messages.length - 1}
              />
            ))}

            {/* Loading skeleton */}
            {isLoading && <SkeletonLoader />}

            {/* Scroll anchor */}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="max-w-3xl mx-auto w-full shrink-0">
        <ChatInput
          onSubmit={onSendMessage}
          isLoading={isLoading}
          disabled={!activeThread}
        />
      </div>
    </div>
  );
}
