"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import { DestinationResponse } from 'va-hybrid-types/contentTypes';

/**
 * Hook to fetch destination data from the content API
 */
const useDestinationData = () => {
  const [destinationArray, setDestinationArray] = useState<DestinationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
    console.log("API URL:", apiUrl);
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_CONTENT_API is not defined in environment variables");
      setError("API URL not configured");
      return;
    }

    const controller = new AbortController();

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        // apiUrl already includes /api/v1
        const data = await fetchData<DestinationResponse>(
          `${apiUrl}/destinations`,
          { signal: controller.signal }
        );

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
  }, []);

  return { destinationArray, loading, error };
};

/**
 * Hook to fetch profile data from the user API
 * @param userId - Optional user ID. If not provided, fetches current authenticated user
 */
const useProfileData = (userId?: string) => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_USER_API;
    
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_USER_API is not defined in environment variables");
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // For development, use local Next.js API route
        // In production, this would use the external API
        const endpoint = userId 
          ? `/api/profile/${userId}` 
          : `/api/profile`;

        console.log("Fetching profile from:", endpoint);

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

export { useDestinationData, useProfileData };