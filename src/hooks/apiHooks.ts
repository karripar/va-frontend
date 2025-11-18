"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";


/**
 * Hook to fetch profile data from the user API
 * @param userId - Optional user ID. If not provided, fetches current authenticated user
 */
const useProfileData = (userId?: string) => {
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

        // Use the actual backend API
        const endpoint = userId 
          ? `${apiUrl}/profile/${userId}` 
          : `${apiUrl}/profile`;

        const data = await fetchData<ProfileResponse>(
          endpoint,
          { signal: controller.signal }
        );

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
  }, [userId]);

  return { profileData, loading, error };
};


export { 
  useProfileData,  
};