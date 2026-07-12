import { useState, useMemo, useEffect, useRef } from "react";
import { categorizeThreads } from "../utils/threadUtils";

function ThreadItem({ thread, isActive, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (editValue.trim()) {
      onRename(thread.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group relative flex items-center rounded-lg transition-all duration-150 ${
        isActive
          ? "bg-violet-600/20 text-violet-200 border border-violet-500/30"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isEditing ? (
        <form
          onSubmit={handleRenameSubmit}
          className="flex-1 flex items-center gap-2 px-3 py-2 min-w-0"
        >
          <svg
            className="w-4 h-4 shrink-0 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <input
            ref={inputRef}
            value={editValue}
            aria-label="Edit chat title"
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRenameSubmit}
            className="w-full bg-zinc-700 text-zinc-100 text-sm px-2 py-0.5 rounded outline-none border border-violet-500"
          />
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onSelect(thread.id)}
            aria-label={`Select chat: ${thread.title}`}
            className={`flex-1 flex items-center gap-2 pl-3 py-2 text-left min-w-0 rounded-l-lg outline-none focus-visible:ring-1 focus-visible:ring-violet-500 ${
              showActions || isActive ? "pr-1" : "pr-3"
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="flex-1 min-w-0 truncate text-sm leading-5">
              {thread.title}
            </span>
          </button>

          {(showActions || isActive) && (
            <div className="flex items-center gap-1 shrink-0 pr-3 py-2">
              <button
                type="button"
                title="Rename"
                aria-label={`Rename chat: ${thread.title}`}
                onClick={() => {
                  setEditValue(thread.title);
                  setIsEditing(true);
                }}
                className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <button
                type="button"
                title="Delete"
                aria-label={`Delete chat: ${thread.title}`}
                onClick={() => onDelete(thread.id)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function Sidebar({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
  onClearAll,
  onRenameThread,
  isOpen,
  onClose,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const threadGroups = useMemo(() => categorizeThreads(threads), [threads]);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar panel"
          className="fixed inset-0 bg-black/50 z-20 lg:hidden cursor-pointer border-none outline-none appearance-none block w-full h-full p-0"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30 lg:z-auto flex flex-col w-64 bg-zinc-950 border-r border-zinc-800/60 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              NexusAI
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar layout"
            className="lg:hidden p-1 rounded text-zinc-400 hover:text-zinc-300"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-3 pt-3 pb-2">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-sm font-medium transition-all duration-150 shadow-lg shadow-violet-900/30"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-4">
          {threadGroups.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-xs text-zinc-600">No conversations yet</p>
            </div>
          ) : (
            threadGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-2 mb-1.5">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.threads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      isActive={thread.id === activeThreadId}
                      onSelect={onSelectThread}
                      onDelete={onDeleteThread}
                      onRename={onRenameThread}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Section Updated */}
        <div className="border-t border-zinc-800/60 p-3 space-y-3">
          {threads.length > 0 && (
            <>
              {showClearConfirm ? (
                <div className="bg-red-950/40 border border-red-800/40 rounded-lg p-3">
                  <p className="text-sm text-red-300 mb-3">
                    Delete all {threads.length} conversation
                    {threads.length > 1 ? "s" : ""}?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClearAll();
                        setShowClearConfirm(false);
                      }}
                      className="flex-1 text-sm py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Delete all
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 text-sm py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 text-sm transition-all duration-150"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear all history
                </button>
              )}
            </>
          )}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] text-white font-semibold">
              U
            </div>
            <span className="text-sm text-zinc-300 font-medium">Llama 3.3</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
