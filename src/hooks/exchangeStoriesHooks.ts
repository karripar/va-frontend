"use client";
import fetchData from "@/lib/fetchData";
import { useCallback, useEffect, useState } from "react";
//import {ExchangeStory, StoriesResponse, StoryFilters } from "va-hybrid-types/contentTypes";
import { ExchangeStoriesResponse, StoryFilters, ExchangeStory } from 'va-hybrid-types/contentTypes';


export type { StoryFilters, ExchangeStory };

export const useExchangeStories = (filters?: StoryFilters) => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Use the correct API URL for content
  const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // API request helper
  const apiRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const res = await fetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...options.headers },
      });
      return res.ok ? res.json().catch(() => null) : null;
    },
    [token]
  );

  // Provided fetchStories logic
  const fetchStories = useCallback(async () => {
    setLoading(true);
    const data = await apiRequest(`${apiUrl}/exchange-stories/stories/all`);
    if (data?.stories) setStories(data.stories);
    setLoading(false);
  }, [apiUrl, apiRequest]);

  useEffect(() => {
    if (!apiUrl) {
      setError("API URL not configured");
      setLoading(false);
      return;
    }
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStories]);

  return { stories, loading, error, hasMore };
};

export const useFeaturedStories = () => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
    if (!apiUrl) {
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await fetchData<{ stories: ExchangeStory[] }>(
          `${apiUrl}/tips/featured`,
          { signal: controller.signal }
        );
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
