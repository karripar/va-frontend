"use client";

import fetchData from "@/lib/fetchData";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API || "";

if (!API_URL) {
  console.error("NEXT_PUBLIC_AUTH_API is not defined in environment variables");
}

interface MakeAdminResponse {
  message?: string;
  error?: string;
}

interface AdminListResponse {
  admins: { id: string; email: string; userName: string }[];
}

const useAdminActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Promote an existing user to admin by email */
  const promoteToAdmin = async (email: string) => {
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
      const response = await fetchData<MakeAdminResponse>(
        `${API_URL}/admin/make-admin/${encodeURIComponent(email.trim())}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.error) setError(response.error);
      return response;
    } catch (err: unknown) {
      console.error("Error promoting user to admin:", err);
      setError("Failed to promote user to admin");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Get a list of all current admins */
  const getAdmins = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<AdminListResponse>(
        `${API_URL}/admin/admins`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response) setError("No data received from server");
      return response;
    } catch (err: unknown) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    promoteToAdmin,
    getAdmins,
    loading,
    error,
  };
};

export default useAdminActions;
