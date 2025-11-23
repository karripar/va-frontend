"use client";

import fetchData from "@/lib/fetchData";
import { useState } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import { MessageResponse } from "va-hybrid-types/MessageTypes";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API || "";

if (!API_URL) {
  console.error("NEXT_PUBLIC_AUTH_API is not defined in environment variables");
}

interface MakeAdminResponse {
  message?: string;
  error?: string;
}

interface AdminListResponse {
  admins: { _id: string; email: string; userName: string; user_level_id: number}[];
}

interface BlockedUsersResponse {
  blockedUsers: ProfileResponse[];
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

      if (!response) setError("Failed to fetch admins");
      return response;
    } catch (err: unknown) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** Demote to regular user */
  const demoteFromAdmin = async (adminId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }
    try {
      const response = await fetchData<MakeAdminResponse>(
        `${API_URL}/admin/remove-admin/${encodeURIComponent(adminId)}`, 
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
      console.error("Error demoting admin to user:", err);
      setError("Failed to demote admin to user");
      throw err;
    } finally {
      setLoading(false);
    } 
  };

  const elevateAdmin = async (adminId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<MakeAdminResponse>(
        `${API_URL}/admin/elevate-admin/${encodeURIComponent(adminId)}`,  
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
      console.error("Error elevating admin:", err);
      setError("Failed to elevate admin");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBlockedUsers = async (): Promise<BlockedUsersResponse> => {
  
    setLoading(true);
    setError(null);
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return { blockedUsers: [] };
    }

    try {
  
      const response = await fetchData<BlockedUsersResponse>(`${API_URL}/users/blocked/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response as BlockedUsersResponse;
    } catch (err) {
      console.log("STEP 5: Error thrown:", err);
      throw err;
    } finally {
      console.log("STEP 6: finally executed");
      setLoading(false);
    }
  };
  
  
  

  const toggleBlockUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<MessageResponse>(
        `${API_URL}/users/block/${encodeURIComponent(userId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.message) setError(response.message);
      return response;
    } catch (err: unknown) {
      console.error("Error toggling block status for user:", err);
      setError("Failed to toggle block status for user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }
    try {
      const response = await fetchData<MessageResponse>(
        `${API_URL}/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.message) setError(response.message);
      return response;
    } catch (err: unknown) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    promoteToAdmin,
    getAdmins,
    demoteFromAdmin,
    elevateAdmin,
    getBlockedUsers,
    toggleBlockUser,
    deleteUser,
    loading,
    error,
  };
};

export default useAdminActions;
