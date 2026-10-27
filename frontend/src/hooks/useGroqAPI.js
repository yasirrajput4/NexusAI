import { useState, useCallback } from "react";
import { API_BASE_URL } from "../constants";

export function useGroqAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (threadId, messages) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("nexusai_token");

      if (!token) {
        throw new Error("Not authenticated. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ threadId, messages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.error ||
            `API error ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Backend returns { message: aiMessage, title?: newTitle }
      return data;
    } catch (err) {
      const errMsg =
        err.message || "Failed to connect to server. Please try again.";
      setError(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isLoading, error, sendMessage, clearError };
}
