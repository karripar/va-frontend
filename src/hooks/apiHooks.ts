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
          : `${apiUrl}/destinations/metropolia/destinations?field=${field}&lang=fi`;

        const data = await fetchData<DestinationWithCoordinatesResponse>(url, {
          signal: controller.signal,
        });
        console.log("Fetched destinations:", data);

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
  useDestinationData, 
  useProfileData,  
};