import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { stripMarkdown } from "../utils/threadUtils";

function SpeakerButton({ text }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const plainText = stripMarkdown(text);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, text]);

  return (
    <button
      type="button"
      onClick={handleSpeak}
      aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
      className={`p-1.5 rounded-lg transition-all duration-150 ${
        isSpeaking
          ? "bg-violet-600/30 text-violet-300"
          : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/60"
      }`}
    >
      {isSpeaking ? (
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
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
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
            d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12c-3.866 0-7 3.134-7 7s3.134 7 7 7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728"
          />
        </svg>
      )}
    </button>
  );
}

function CopyMessageButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy message to clipboard"
      title="Copy message"
      className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700/60 transition-all duration-150"
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
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
            strokeWidth={1.5}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      )}
    </button>
  );
}

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : null;

    if (!inline && language) {
      return <CodeBlock language={language}>{children}</CodeBlock>;
    }

    if (!inline && !language && String(children).includes("\n")) {
      return <CodeBlock language="text">{children}</CodeBlock>;
    }

    return (
      <code
        className="bg-zinc-800 text-violet-300 px-1.5 py-0.5 rounded text-[0.8em] font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function MessageBubble({ message, isLast }) {
  const isUser = message.role === "user";
  const isError = message.role === "error";

  if (isError) {
    return (
      <div className="message-enter flex justify-center my-4">
        <div className="flex items-start gap-2 max-w-lg bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
          <svg
            className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-red-300">{message.text}</p>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="message-enter flex justify-end px-4 py-2">
        <div className="max-w-[75%] lg:max-w-[60%]">
          <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-zinc-100 leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="message-enter group flex gap-3 px-4 py-3">
      {/* AI Avatar */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="prose-chat text-zinc-200 text-sm leading-relaxed">
          <ReactMarkdown components={markdownComponents}>
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Action buttons - visible on hover */}
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CopyMessageButton text={message.text} />
          <SpeakerButton text={message.text} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="flex gap-3 px-4 py-3">
      {/* AI Avatar */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600/50 to-purple-700/50 flex items-center justify-center shrink-0 mt-0.5">
        <svg
          className="w-4 h-4 text-white/50"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>

      {/* Typing indicator */}
      <div className="flex-1 min-w-0 pt-1.5">
        <div className="flex items-center gap-1.5 py-2">
          <div className="w-2 h-2 rounded-full bg-violet-500/70 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-violet-500/70 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-violet-500/70 typing-dot"></div>
        </div>

        {/* Skeleton lines */}
        <div className="space-y-2 mt-2">
          <div className="skeleton h-3.5 w-4/5 rounded"></div>
          <div className="skeleton h-3.5 w-3/5 rounded"></div>
          <div className="skeleton h-3.5 w-5/6 rounded"></div>
        </div>
      </div>
    </div>
  );
}
