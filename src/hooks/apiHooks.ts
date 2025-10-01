"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { DestinationWithCoordinatesResponse} from 'va-hybrid-types/contentTypes'

const useDestinationData = (field: "tech" | "health" | "culture" | "business" = "tech", useMock: boolean) => {
  const [destinationArray, setDestinationArray] = useState<DestinationWithCoordinatesResponse | null>(null);
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

        const url = useMock ? "/testDestinations.json" : `${apiUrl}data/metropolia/destinations?field=${field}`;
        const data = await fetchData<DestinationWithCoordinatesResponse>(url, { signal: controller.signal });
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
  }, [field]); // refetch will happen if field changes

  return { destinationArray, loading, error };
};

export { useDestinationData };
