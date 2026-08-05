import { useState, useRef, useCallback, useEffect } from "react";

export function ChatInput({ onSubmit, isLoading, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const handleSubmit = useCallback(() => {
    const text = value.trim();
    if (!text || isLoading || disabled) return;
    onSubmit(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, isLoading, disabled, onSubmit]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const canSubmit = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="px-4 pb-5 pt-3">
      <div className="relative flex items-end gap-2 bg-zinc-800/80 border border-zinc-700/60 focus-within:border-violet-500/60 focus-within:shadow-violet-950/20 rounded-2xl px-3 py-3 shadow-xl shadow-black/30 backdrop-blur-sm transition-colors duration-200">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything — press Enter to send, Shift+Enter for new line"
          aria-label="Chat message input"
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-600 resize-none outline-none leading-relaxed max-h-48 min-h-7 py-0.5 disabled:opacity-50"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            title="Send message"
            className={`p-2 rounded-xl transition-all duration-200 ${
              canSubmit
                ? "bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-lg shadow-violet-900/40"
                : "bg-zinc-700/40 text-zinc-600 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <svg
                className="w-4 h-4 animate-spin"
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
            ) : (
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
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-zinc-700 mt-2">
        NexusAI may produce inaccurate information about people, places, or
        facts.
      </p>
    </div>
  );
}
