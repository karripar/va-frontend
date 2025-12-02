"use client";
import { useState, useEffect } from "react";

export interface CalculatorHistoryEntry {
  id?: string;
  calculation: string;
  result: number;
  timestamp?: string;
}

// Helper function to get userId from token or profile
const getUserId = async (apiUrl: string, token: string): Promise<string | null> => {
  try {
    const response = await fetch(`${apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const userData = await response.json();
      return userData.user_id || userData.id || null;
    }
  } catch (err) {
    console.error("Error fetching user ID:", err);
  }
  return null;
};

export const useCalculatorHistory = () => {
  const [history, setHistory] = useState<CalculatorHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;

  // Fetch userId on mount
  useEffect(() => {
    const fetchUserId = async () => {
      if (!apiUrl) return;
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      if (token) {
        const id = await getUserId(apiUrl, token);
        setUserId(id);
      }
    };
    fetchUserId();
  }, [apiUrl]);

  // Fetch history from backend
  const fetchHistory = async () => {
    if (!apiUrl || !userId) {
      console.error("API URL or userId not configured");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const response = await fetch(`${apiUrl}/budgets/calculator/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Error fetching calculator history:", err);
      setError("Failed to fetch calculator history");
    } finally {
      setLoading(false);
    }
  };

  // Save history entry to backend
  const saveHistoryEntry = async (entry: CalculatorHistoryEntry) => {
    if (!apiUrl) {
      console.error("API URL not configured");
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const response = await fetch(`${apiUrl}/budgets/calculator/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setHistory((prev) => [savedEntry, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      console.error("Error saving calculator history:", err);
    }
  };

  // Clear all history
  const clearHistory = async () => {
    if (!apiUrl) {
      console.error("API URL not configured");
      return;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      const response = await fetch(`${apiUrl}/budgets/calculator/history`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error clearing calculator history:", err);
    }
  };

  // Fetch history on mount (only when userId is available)
  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    history,
    loading,
    error,
    saveHistoryEntry,
    clearHistory,
    fetchHistory,
  };
};
