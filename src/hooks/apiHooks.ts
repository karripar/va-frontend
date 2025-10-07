"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { DestinationWithCoordinatesResponse, ProfileResponse } from "va-hybrid-types/contentTypes";

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
        console.log("Fetched destinations:", data);

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
 * Since all users must be authenticated with @metropolia.fi accounts,
 * this hook fetches the current user's profile using their Google ID
 */
const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
    
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_AUTH_API is not defined in environment variables");
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // get current authenticated user's Google ID
        const userProfile = localStorage.getItem("userProfile");
        if (!userProfile) {
          throw new Error("No authenticated user found");
        }

        const currentUser = JSON.parse(userProfile) as GoogleAuthResponse;
        const endpoint = `${apiUrl}/users/profile`;
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            googleId: currentUser.googleId,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json() as ProfileResponse;
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

// types for authentication
type GoogleAuthResponse = {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
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

      // Get current user's Google ID
      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        throw new Error("No authenticated user found");
      }

      const currentUser = JSON.parse(userProfile) as GoogleAuthResponse;

      const response = await fetch(`${authApiUrl}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: currentUser.googleId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const updatedProfile = await response.json() as ProfileResponse;
      
      // update localStorage with new profile info
      const updatedUserData = {
        ...currentUser,
        name: updatedProfile.userName
      };
      localStorage.setItem("userProfile", JSON.stringify(updatedUserData));

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

export { useDestinationData, useProfileData, useUpdateProfile };