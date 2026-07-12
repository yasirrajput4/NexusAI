export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Search icon — pehle jaisa */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-8 shadow-xl shadow-violet-900/40">
        <svg
          className="w-11 h-11 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-zinc-100 mb-4 tracking-tight">
        What can I help you with?
      </h1>
      <p className="text-base text-zinc-400 max-w-md leading-relaxed">
        Powered by{" "}
        <span className="text-violet-400 font-semibold">Llama 3.3</span> (70B
        Versatile). Ask anything — from code to creative writing.
      </p>
    </div>
  );
}
