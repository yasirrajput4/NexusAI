import { useState, useEffect, useRef, useCallback } from "react";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEBOUNCE_MS = 800; // safe for Groq free tier
const MIN_CHARS = 8; // don't trigger on very short input

export function useAutocomplete(apiKey) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  const fetchSuggestions = useCallback(
    async (text) => {
      // Cancel previous in-flight request
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      setIsLoading(true);
      try {
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          signal: abortController.current.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 80,
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content: `You are an autocomplete assistant. The user is typing a prompt for an AI chat app.
Given their partial input, suggest exactly 3 short, natural completions.
Rules:
- Each suggestion must complete or extend what they typed naturally
- Keep each suggestion under 12 words
- Return ONLY a JSON array of 3 strings, nothing else
- No explanations, no markdown, no preamble
Example output: ["explain how React hooks work", "explain how React context differs from Redux", "explain how React re-renders are triggered"]`,
              },
              {
                role: "user",
                content: text,
              },
            ],
          }),
        });

        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content?.trim();

        // Safely parse JSON array from response
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed.slice(0, 3));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey],
  );

  const getSuggestions = useCallback(
    (text) => {
      // Clear previous timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // Clear suggestions if input too short
      if (!text || text.trim().length < MIN_CHARS) {
        setSuggestions([]);
        return;
      }

      // Debounce the API call
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(text);
      }, DEBOUNCE_MS);
    },
    [fetchSuggestions],
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (abortController.current) abortController.current.abort();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  return { suggestions, isLoading, getSuggestions, clearSuggestions };
}
