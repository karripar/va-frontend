"use client";
import fetchData from "@/lib/fetchData";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_CONTENT_API || "";

if (!API_URL) {
  console.error("NEXT_PUBLIC_CONTENT_API is not defined in environment variables");
}

export interface DestinationUrlInput {
  field: string;
  lang: string;
  url: string;
}

export interface DestinationUrlResponse extends DestinationUrlInput {
  _id: string;
  lastModified: string;
  updatedBy?: string;
}

// Hook to manage destination URLs (admin-only management)
const useDestinationUrls = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET all destination URLs
  const getDestinationUrls = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{ urls: DestinationUrlResponse[] }>(
        `${API_URL}/destinations/metropolia/destination-urls`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        }
      );

      return response;
    } catch (err: unknown) {
      console.error("Error fetching destination URLs:", err);
      setError("Failed to fetch destination URLs");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // UPDATE or CREATE a destination URL (admin only)
  const updateDestinationUrl = async (urlData: DestinationUrlInput) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{
        message: string;
        entry: DestinationUrlResponse;
      }>(`${API_URL}/destinations/metropolia/destination-url`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(urlData),
      });

      return response;
    } catch (err: unknown) {
      console.error("Error updating destination URL:", err);
      setError("Failed to update destination URL");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE a destination URL (admin only)
  const deleteDestinationUrl = async (id: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{ message: string }>(
        `${API_URL}/destinations/metropolia/destination-url/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      return response;
    } catch (err: unknown) {
      console.error("Error deleting destination URL:", err);
      setError("Failed to delete destination URL");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getDestinationUrls,
    updateDestinationUrl,
    deleteDestinationUrl,
    loading,
    error,
  };
};

export { useDestinationUrls };
