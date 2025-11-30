"use client";
import fetchData from "@/lib/fetchData";
import { useCallback, useEffect, useState } from "react";
import {ExchangeStoriesResponse, StoryFilters, ExchangeStory} from "va-hybrid-types/contentTypes";

export type { StoryFilters, ExchangeStory };

const CONTENT_API = process.env.NEXT_PUBLIC_CONTENT_API;

// --> TOKEN 

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// --> FETCH ALL STORIEs, ADMIN

export const useExchangeStories = (filters?: StoryFilters) => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        },
      });

      if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        return null;
      }

      return res.json().catch(() => null);
    } catch (err) {
      console.error("Fetch error:", err);
      return null;
    }
  }, []);

  const fetchStories = useCallback(async () => {
    if (!CONTENT_API) {
      setError("Content API URL not configured");
      setLoading(false);
      return;
    }

    setLoading(true);

    // ADMIN endpoint
    const url = `${CONTENT_API}/exchange-stories/all`;
    console.log('🔍 Fetching stories from:', url);
    console.log('🔍 CONTENT_API value:', CONTENT_API);

    const data: ExchangeStoriesResponse | null = await apiRequest(url);

    if (data?.stories) {
      setStories(data.stories);
    } else {
      setError("Failed to load stories");
    }

    setLoading(false);
  }, [apiRequest]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return { stories, loading, error };
};

//--> FETCH APPROVED STORIES 

export const useFeaturedStories = () => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CONTENT_API) {
      setError("Content API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchFeatured = async () => {
      try {
        setLoading(true);


        const url = `${CONTENT_API}/exchange-stories`;

        const data = await fetchData<{ stories: ExchangeStory[] }>(url, {
          signal: controller.signal,
        });

        setStories(data.stories);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching featured stories:", err);
          setError("Failed to fetch featured stories");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
    return () => controller.abort();
  }, []);

  return { stories, loading, error };
};
