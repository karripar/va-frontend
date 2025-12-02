"use client";
import fetchData from "@/lib/fetchData";
import { useCallback, useEffect, useState } from "react";
import {ExchangeStoriesResponse, StoryFilters, ExchangeStory as BaseExchangeStory} from "va-hybrid-types/contentTypes";

// Extended ExchangeStory type to match current backend schema
export interface ExchangeStory extends Partial<BaseExchangeStory> {
  id: string;
  title: string;
  city: string;
  university: string;
  country: string;
  content: string;
  highlights: string[];
  challenges?: string[];
  tips?: string[];
  isApproved: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type { StoryFilters };

const CONTENT_API = process.env.NEXT_PUBLIC_CONTENT_API;

// --> TOKEN 

// --> FETCH APPROVED STORIES (PUBLIC)

export const useExchangeStories = () => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    if (!CONTENT_API) {
      setError("Content API URL not configured");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use public endpoint that returns only approved stories
    const url = `${CONTENT_API}/exchange-stories`;

    try {
      const data = await fetchData<ExchangeStoriesResponse>(url);

      if (data?.stories) {
        setStories(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.stories.map((story: any) => ({
            ...story,
            id: story.id || story._id || '',
            content: story.content || undefined,
          }))
        );
        setError(null);
      } else {
        setStories([]);
        setError("Failed to load stories");
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      setStories([]);
      setError("Failed to fetch stories");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setError(null);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching featured stories:", err);
          setStories([]);
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
