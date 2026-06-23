export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const EXAMPLE_PROMPTS = [
  {
    icon: "💻",
    title: "Write some code",
    subtitle: "Help me build a React custom hook for debouncing",
  },
  {
    icon: "✍️",
    title: "Draft content",
    subtitle: "Write a blog outline about the future of AI agents",
  },
  {
    icon: "🧠",
    title: "Explain a concept",
    subtitle: "Explain how neural networks learn with backpropagation",
  },
  {
    icon: "🔍",
    title: "Analyze & compare",
    subtitle: "Compare REST vs GraphQL with a feature table",
  },
  {
    icon: "🎯",
    title: "Solve a problem",
    subtitle: "Debug this: why does useEffect run infinitely?",
  },
  {
    icon: "📊",
    title: "Create a plan",
    subtitle: "Give me a 30-day roadmap for learning TypeScript",
  },
];

export const STORAGE_KEY = "nexusai_threads";
export const ACTIVE_THREAD_KEY = "nexusai_active_thread";
export const MAX_HISTORY_THREADS = 50;
