// Backend URL — Render pe deploy hone ke baad change karo
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const STORAGE_KEY = "nexusai_threads";
export const ACTIVE_THREAD_KEY = "nexusai_active_thread";
export const MAX_HISTORY_THREADS = 50;
