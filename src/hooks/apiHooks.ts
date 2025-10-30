"use client";
import fetchData from "@/lib/fetchData"; // remember to use this utility for fetches, not raw fetch. It handles json and errors. Shortens code in the hooks.6
import { useEffect, useState } from "react";
import {
  ProfileResponse,
} from "va-hybrid-types/contentTypes";



/**
 * Hook to fetch profile data from the user API
 */
const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;

    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_AUTH_API is not defined in environment variables"
      );
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No auth token found");
          setLoading(false);
          return;
        }

        const endpoint = `${apiUrl}/users/profile`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = (await response.json()) as ProfileResponse;
        setProfileData(data);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching profile:", err);
          setError("Failed to fetch profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, []);

  return { profileData, loading, error };
};

/**
 * update user profile
 */
const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    updates: Partial<ProfileResponse>
  ): Promise<ProfileResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!authApiUrl) {
        throw new Error("Auth API URL not configured");
      }

      const response = await fetch(`${authApiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const updatedProfile = (await response.json()) as ProfileResponse;

      return updatedProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      console.error("Profile update error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
};

/**
 * Hook to check authentication status by fetching user profile
 */
const useAuthAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async (): Promise<ProfileResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3001/api/v1/users/profile",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken") || "",
            "Content-Type": "application/json",
          },
        }
      );

      // check the authentication status
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setError("Failed to check authentication");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAuth,
    loading,
    error,
  };
};

export { useProfileData, useUpdateProfile, useAuthAPI };
