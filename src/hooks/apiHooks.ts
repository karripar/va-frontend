"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import {
  DestinationWithCoordinatesResponse,
  ProfileResponse,
} from "va-hybrid-types/contentTypes";

// simple cache that survives re-renders but not page reloads
const destinationCache: Record<string, DestinationWithCoordinatesResponse> = {};

const useDestinationData = (
  field: "tech" | "health" | "culture" | "business" = "tech",
  useMock: boolean
) => {
  const [destinationArray, setDestinationArray] =
    useState<DestinationWithCoordinatesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_CONTENT_API is not defined in environment variables"
      );
      setError("API URL not configured");
      return;
    }

    // check if data is cached
    if (destinationCache[field]) {
      setDestinationArray(destinationCache[field]);
      return; // don’t fetch again
    }

    const controller = new AbortController();

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = useMock
          ? "/testDestinations.json"
          : `${apiUrl}/data/metropolia/destinations?field=${field}&lang=fi`;

        const data = await fetchData<DestinationWithCoordinatesResponse>(url, {
          signal: controller.signal,
        });

        // 2️⃣ store in cache
        destinationCache[field] = data;
        setDestinationArray(data);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching destinations:", err);
          setError("Failed to fetch destinations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();

    return () => {
      controller.abort();
    };
  }, [field, useMock]);

  return { destinationArray, loading, error };
};

/**
 * Hook to fetch profile data from the user API
 * Uses httpOnly cookies for authentication
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

        const endpoint = `${apiUrl}/users/profile`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: controller.signal,
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
 * update user profile using httpOnly cookie authentication
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
          "Content-Type": "application/json",
        },
        credentials: "include",
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
          credentials: "include",
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

/**
 * Hook to handle user logout
 */
const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await fetch("http://localhost:3001/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      return true;
    } catch (err) {
      console.error("Logout request failed:", err);
      setError("Logout failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
    error,
  };
};

export {
  useDestinationData,
  useProfileData,
  useUpdateProfile,
  useAuthAPI,
  useLogout,
};
