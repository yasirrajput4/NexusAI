import { EXAMPLE_PROMPTS } from "../constants";

export function EmptyState({ onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Logo mark */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-6 shadow-xl shadow-violet-900/40">
        <svg
          className="w-9 h-9 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight">
        What can I help you with?
      </h1>
      <p className="text-sm text-zinc-500 mb-10 max-w-sm">
        Powered by <span className="font-medium text-zinc-300">Llama 3.3</span>{" "}
        (70B Versatile). Ask anything — from code to creative writing.
      </p>

      {/* Prompt suggestion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            type="button"
            // 🔧 FIX: Index 'i' ki jagah stable property 'prompt.subtitle' ko key banaya
            key={prompt.subtitle}
            onClick={() => onSelectPrompt(prompt.subtitle)}
            className="group relative text-left p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-800/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5">{prompt.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200 mb-1 group-hover:text-white transition-colors">
                  {prompt.title}
                </p>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400 line-clamp-2 transition-colors leading-relaxed">
                  {prompt.subtitle}
                </p>
              </div>
            </div>
            {/* Hover accent */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-violet-500/0 group-hover:ring-violet-500/20 transition-all duration-200 pointer-events-none" />
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-700 mt-10">
        NexusAI can make mistakes. Consider verifying important information.
      </p>
    </div>
  );
}
