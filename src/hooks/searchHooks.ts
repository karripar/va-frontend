"use client";

import fetchData from "@/lib/fetchData";
import { useState } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API || "";

if (!API_URL) {
  console.error("NEXT_PUBLIC_AUTH_API is not defined in environment variables");
}

const useSearchActions = () => {
  const [usersLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsersByEmail = async (email: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }
    if (!email?.trim()) {
      setError("Email cannot be empty");
      setLoading(false);
      return;
    }
    try {
      const response = await fetchData<{ users: ProfileResponse[] }>(
        `${API_URL}/users/search/by-email/${encodeURIComponent(email.trim())}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
        return response.users;
    } catch (err: unknown) {
      console.error("Error searching users by email:", err);
      setError("Failed to search users");
      throw err;
    }
    finally {
      setLoading(false);
    } 
    };
    return {
        searchUsersByEmail,
        usersLoading,
        error,
    };
};

export default useSearchActions;