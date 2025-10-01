"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
//import {ProfileResponse} from "va-hybrid-types/contentTypes";
import {DestinationResponse} from 'va-hybrid-types/contentTypes';

// I decided to define ProfileResponse type locally here for now ----> to be fixed!
type ProfileResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    registeredAt: string;
    favorites: string[];
    documents: string[];
  };
  favorites: string[];
  documents: string[];

};

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

        const data = await fetchData<DestinationResponse>(
          `${apiUrl}/data/metropolia/destinations?`,
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
const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_USER_API;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_USER_API is not defined in environment variables");
      setError("API URL not configured");
      return;
    }
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchData<ProfileResponse>(
          `${apiUrl}/data/metropolia/profile`,
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
  }, []);

  return { profileData, loading, error };
};

export { useDestinationData, useProfileData };
