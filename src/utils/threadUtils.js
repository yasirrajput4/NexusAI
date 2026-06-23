import {
  STORAGE_KEY,
  ACTIVE_THREAD_KEY,
  MAX_HISTORY_THREADS,
} from "../constants.js";

/**

 * Generate a unique thread ID

 */

function generateId() {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**

 * Auto-name a thread from the first user message

 */

export function autoNameThread(text) {
  const words = text.trim().split(/\s+/).slice(0, 5);

  let name = words.join(" ");

  if (text.trim().split(/\s+/).length > 5) name += "…";

  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**

 * Create a new empty thread object

 */

export function createThread(title = "New Chat") {
  return {
    id: generateId(),

    title,

    messages: [],

    createdAt: Date.now(),

    updatedAt: Date.now(),
  };
}

/**

 * Load all threads from localStorage

 */

export function loadThreads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

/**

 * Save all threads to localStorage

 */

export function saveThreads(threads) {
  try {
    const trimmed = threads.slice(0, MAX_HISTORY_THREADS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save threads:", e);
  }
}

/**

 * Load the active thread ID

 */

export function loadActiveThreadId() {
  return localStorage.getItem(ACTIVE_THREAD_KEY) || null;
}

/**

 * Save the active thread ID

 */

export function saveActiveThreadId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  }
}

/**

 * Categorize threads by date for sidebar display

 */

export function categorizeThreads(threads) {
  const now = Date.now();

  const oneDayMs = 24 * 60 * 60 * 1000;

  const twoDaysMs = 2 * oneDayMs;

  const sevenDaysMs = 7 * oneDayMs;

  const thirtyDaysMs = 30 * oneDayMs;

  const today = [];

  const yesterday = [];

  const last7Days = [];

  const last30Days = [];

  const older = [];

  threads.forEach((thread) => {
    const age = now - thread.updatedAt;

    if (age < oneDayMs) today.push(thread);
    else if (age < twoDaysMs) yesterday.push(thread);
    else if (age < sevenDaysMs) last7Days.push(thread);
    else if (age < thirtyDaysMs) last30Days.push(thread);
    else older.push(thread);
  });

  const groups = [];

  if (today.length) groups.push({ label: "Today", threads: today });

  if (yesterday.length) groups.push({ label: "Yesterday", threads: yesterday });

  if (last7Days.length)
    groups.push({ label: "Previous 7 Days", threads: last7Days });

  if (last30Days.length)
    groups.push({ label: "Previous 30 Days", threads: last30Days });

  if (older.length) groups.push({ label: "Older", threads: older });

  return groups;
}

/**

 * Strip markdown from text for TTS

 */

export function stripMarkdown(text) {
  return text

    .replace(/```[\s\S]*?```/g, " code block ")

    .replace(/`([^`]+)`/g, "$1")

    .replace(/\*\*([^*]+)\*\*/g, "$1")

    .replace(/\*([^*]+)\*/g, "$1")

    .replace(/#{1,6}\s+/g, "")

    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    .replace(/^\s*[-*+]\s+/gm, "")

    .replace(/^\s*\d+\.\s+/gm, "")

    .replace(/>\s+/g, "")

    .replace(/\n+/g, " ")

    .trim();
}

/**

 * Build Gemini API payload from messages array

 */

export function buildGeminiPayload(messages) {
  return {
    contents: messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",

      parts: [{ text: msg.text }],
    })),

    generationConfig: {
      temperature: 0.9,

      topK: 1,

      topP: 1,

      maxOutputTokens: 8192,
    },

    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",

        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },

      {
        category: "HARM_CATEGORY_HATE_SPEECH",

        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },

      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",

        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },

      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",

        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };
}
