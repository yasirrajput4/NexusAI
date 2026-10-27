import {
  STORAGE_KEY,
  ACTIVE_THREAD_KEY,
  MAX_HISTORY_THREADS,
} from "../constants";

export function generateId() {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function autoNameThread(text) {
  const words = text.trim().split(/\s+/).slice(0, 5);
  let name = words.join(" ");
  if (text.trim().split(/\s+/).length > 5) name += "…";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function createThread(title = "New Chat") {
  return {
    id: generateId(),
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadThreads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveThreads(threads) {
  try {
    const trimmed = threads.slice(0, MAX_HISTORY_THREADS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save threads:", e);
  }
}

export function loadActiveThreadId() {
  return localStorage.getItem(ACTIVE_THREAD_KEY) || null;
}

export function saveActiveThreadId(id) {
  if (id) {
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  }
}
