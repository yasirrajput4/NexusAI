import { useState, useCallback } from "react";
import { GROQ_API_URL, GROQ_API_KEY } from "../constants";

export function useGroqAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (messages, onChunk) => {
    setIsLoading(true);
    setError(null);

    try {
      const formattedMessages = messages.reduce((acc, m) => {
        if (m.role === "user" || m.role === "model") {
          acc.push({
            role: m.role === "model" ? "assistant" : "user",
            content: m.text,
          });
        }
        return acc;
      }, []);

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg =
          errorData?.error?.message ||
          `API error ${response.status}: ${response.statusText}`;
        throw new Error(msg);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "";

      if (!text) throw new Error("Empty response from Groq API");

      if (onChunk) onChunk(text);

      return text;
    } catch (err) {
      const errMsg =
        err.message || "Failed to connect to Groq. Please try again.";
      setError(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, sendMessage, clearError };
}
