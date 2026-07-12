import { useState, useRef, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export function ChatInput({ onSubmit, isLoading, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleTranscript = useCallback((transcript) => {
    setValue((prev) => (prev ? prev + " " + transcript : transcript));
    textareaRef.current?.focus();
  }, []);

  const { isListening, isSupported, toggleListening } =
    useSpeechRecognition(handleTranscript);

  // Auto-resize textarea
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
      <div
        className={`relative flex items-end gap-2 bg-zinc-800/80 border rounded-2xl px-3 py-3 shadow-xl shadow-black/30 backdrop-blur-sm transition-all duration-200 ${
          isListening
            ? "border-red-500/60 shadow-red-900/20"
            : "border-zinc-700/60 focus-within:border-violet-500/60 focus-within:shadow-violet-900/20"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Chat prompt message"
          placeholder={
            isListening ? "Listening… speak your prompt" : "Ask anything…"
          }
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 resize-none outline-none leading-relaxed max-h-48 min-h-[28px] py-0.5 disabled:opacity-50"
        />

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {/* Mic button */}
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              title={isListening ? "Stop recording" : "Voice input"}
              aria-label={
                isListening ? "Stop recording voice input" : "Use voice input"
              }
              className={`relative p-2 rounded-xl transition-all duration-200 ${
                isListening
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60"
              }`}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-xl bg-red-500/40 recording-pulse" />
              )}
              <svg
                className="w-4 h-4 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isListening ? (
                  <>
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      rx="1"
                      strokeWidth={2}
                      fill="currentColor"
                      stroke="none"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 18.5V21m-4 0h8m-4-15a3 3 0 016 0v6a3 3 0 01-6 0V6z"
                    />
                  </>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18.5V21m-4 0h8m-4-15a3 3 0 016 0v6a3 3 0 01-6 0V6z"
                  />
                )}
              </svg>
            </button>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            title="Send message"
            aria-label="Send prompt message"
            className={`p-2 rounded-xl transition-all duration-200 ${
              canSubmit
                ? "bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-800/60"
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

      {/* Footer hint */}
      <p className="text-center text-[15px] text-zinc-700 mt-3">
        NexusAI may produce inaccurate information about people, places, or
        facts.
      </p>
    </div>
  );
}
