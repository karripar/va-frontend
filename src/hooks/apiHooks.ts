"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import {DestinationResponse} from 'va-hybrid-types/contentTypes'

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
          `${apiUrl}/data/metropolia/destinations`,
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

export { useDestinationData };
