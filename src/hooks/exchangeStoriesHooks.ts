"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";

// TODO: Move to va-hybrid-types/contentTypes
interface ExchangeStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  destination: string;
  country: string;
  university: string;
  duration: number;
  exchangeDate: string;
  title: string;
  summary: string;
  highlights: string[];
  challenges?: string[];
  tips: string[];
  coverPhoto: string;
  photos?: string[];
  ratings: {
    overall: number;
    culture: number;
    academics: number;
    social: number;
    costOfLiving: number;
  };
  likes: number;
  saves: number;
  status: "draft" | "published" | "archived";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface StoriesResponse {
  stories: ExchangeStory[];
  total: number;
  hasMore: boolean;
}

interface StoryFilters {
  country?: string;
  university?: string;
  tags?: string[];
  minRating?: number;
  search?: string;
  sort?: "recent" | "popular" | "rating";
}

export type { ExchangeStory, StoryFilters };

export const useExchangeStories = (filters?: StoryFilters) => {
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
    if (!apiUrl) {
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.country) params.append("country", filters.country);
        if (filters?.university) params.append("university", filters.university);
        if (filters?.tags?.length) params.append("tags", filters.tags.join(","));
        if (filters?.minRating) params.append("minRating", filters.minRating.toString());
        if (filters?.search) params.append("search", filters.search);
        if (filters?.sort) params.append("sort", filters.sort);

        const data = await fetchData<StoriesResponse>(
          `${apiUrl}/tips/stories?${params.toString()}`,
          { signal: controller.signal }
        );

        setStories(data.stories);
        setHasMore(data.hasMore);
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching stories:", err);
          setError("Failed to fetch stories");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
    return () => controller.abort();
  }, [filters?.country, filters?.university, filters?.tags, filters?.minRating, filters?.search, filters?.sort]);

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
