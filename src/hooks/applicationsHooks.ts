"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { ApplicationsProgresses } from "va-hybrid-types/contentTypes";


const useApplicationsData = () => {
  const [applications, setApplications] = useState<ApplicationsProgresses | null>(null);
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

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = `${apiUrl}/profile/applications`;

        const data = await fetchData<ApplicationsProgresses>(
          endpoint,
          { signal: controller.signal }
        );

        setApplications(data);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching applications:", err);
          setError("Failed to fetch applications");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    return () => {
      controller.abort();
    };
  }, []);

  return { applications, loading, error };
}; 

export {useApplicationsData, };