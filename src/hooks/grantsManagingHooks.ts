"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import {GrantsSummary, GrantApplicationData } from "va-hybrid-types/contentTypes";

const useGrantsData = () => {
  const [grants, setGrants] = useState<GrantsSummary | null>(null);
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

    const fetchGrants = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchData<GrantsSummary>(
          `${apiUrl}/grants/summary`,
          { signal: controller.signal }
        );

        setGrants(data);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching grants:", err);
          setError("Failed to fetch grants");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();

    return () => {
      controller.abort();
    };
  }, []);

  const applyForGrant = async (grantType: string, data: GrantApplicationData) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/grants/erasmus/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grantType, ...data }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply for grant');
      }

      const result = await response.json();
      
      // Refreshing the grants data
      const updatedGrants = await fetchData<GrantsSummary>(
        `${apiUrl}/grants/summary`
      );
      setGrants(updatedGrants);
      
      return result;
    } catch (err: unknown) {
      console.error("Error applying for grant:", err);
      setError("Failed to apply for grant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    grants, 
    loading, 
    error, 
    applyForGrant 
  };
};
export{useGrantsData,};