import { useState, useRef, useCallback, useEffect } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useAutocomplete } from "../hooks/useAutocomplete";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export function ChatInput({ onSubmit, isLoading, disabled }) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const {
    suggestions,
    isLoading: suggestionsLoading,
    getSuggestions,
    clearSuggestions,
  } = useAutocomplete(GROQ_API_KEY);

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

  // Show suggestions dropdown when they arrive
  useEffect(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const text = e.target.value;
      setValue(text);
      getSuggestions(text);
    },
    [getSuggestions],
  );

  const handleSubmit = useCallback(
    (text) => {
      const finalText = (text || value).trim();
      if (!finalText || isLoading || disabled) return;
      clearSuggestions();
      setShowSuggestions(false);
      onSubmit(finalText);
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    },
    [value, isLoading, disabled, onSubmit, clearSuggestions],
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setValue(suggestion);
      clearSuggestions();
      setShowSuggestions(false);
      textareaRef.current?.focus();
    },
    [clearSuggestions],
  );

  const handleKeyDown = useCallback(
    (e) => {
      // Navigate suggestions with arrow keys
      if (showSuggestions && suggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveSuggestion((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev,
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
          return;
        }
        if (e.key === "Tab" && activeSuggestion >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestion]);
          return;
        }
        if (e.key === "Tab" && suggestions.length > 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[0]);
          return;
        }
        if (e.key === "Escape") {
          setShowSuggestions(false);
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [
      showSuggestions,
      suggestions,
      activeSuggestion,
      handleSubmit,
      handleSuggestionClick,
    ],
  );

  const canSubmit = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div ref={containerRef} className="px-4 pb-5 pt-3 relative">
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              AI Suggestions
            </span>
            <span className="text-[10px] text-zinc-700">
              Tab to select · Esc to close
            </span>
          </div>
          <ul className="pb-2">
            {suggestions.map((suggestion, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent textarea blur
                    handleSuggestionClick(suggestion);
                  }}
                  onMouseEnter={() => setActiveSuggestion(i)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 flex items-start gap-3 ${
                    activeSuggestion === i
                      ? "bg-violet-600/20 text-violet-200"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {/* Suggestion icon */}
                  <svg
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      activeSuggestion === i
                        ? "text-violet-400"
                        : "text-zinc-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading indicator for suggestions */}
      {suggestionsLoading && value.trim().length >= 8 && (
        <div className="absolute bottom-full left-4 mb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
            <svg
              className="w-3 h-3 animate-spin text-violet-500"
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
            <span className="text-[11px] text-zinc-600">
              Generating suggestions…
            </span>
          </div>
        </div>
      )}

      {/* Input bar */}
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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={
            isListening
              ? "Listening… speak your prompt"
              : "Ask anything — press Enter to send, Shift+Enter for new line"
          }
          disabled={isLoading || disabled}
          rows={1}
          className="flex-1 bg-transparent text-base text-zinc-100 placeholder:text-zinc-600 resize-none outline-none leading-relaxed max-h-48 min-h-[28px] py-0.5 disabled:opacity-50"
        />

        <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
          {/* Mic button */}
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              title={isListening ? "Stop recording" : "Voice input"}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 18.5V21m-4 0h8m-4-15a3 3 0 016 0v6a3 3 0 01-6 0V6z"
                />
              </svg>
            </button>
          )}

          {/* Send button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
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

      <p className="text-center text-[14px] text-zinc-700 mt-3">
        NexusAI may produce inaccurate information about people, places, or
        facts.
      </p>
    </div>
  );
}
