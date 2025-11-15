"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import { DestinationWithCoordinatesResponse, ProfileResponse } from "va-hybrid-types/";

// Temporary types until they are added to va-hybrid-types
interface ApplicationsResponse {
  esihaku?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
  nomination?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
  grants?: {
    erasmus?: {
      status: "not_started" | "in_progress" | "completed" | "pending_review";
      completedAt?: string;
    };
    kela?: {
      status: "not_started" | "in_progress" | "completed" | "pending_review";
      completedAt?: string;
    };
  };
  postExchange?: {
    status: "not_started" | "in_progress" | "completed" | "pending_review";
    completedAt?: string;
  };
}

interface ApplicationDocument {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}

// simple cache that survives re-renders but not page reloads
const destinationCache: Record<string, DestinationWithCoordinatesResponse> = {};

const useDestinationData = (
  field: "tech" | "health" | "culture" | "business" = "tech",
  useMock: boolean
) => {
  const [destinationArray, setDestinationArray] =
    useState<DestinationWithCoordinatesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_CONTENT_API is not defined in environment variables"
      );
      setError("API URL not configured");
      return;
    }

    // check if data is cached
    if (destinationCache[field]) {
      setDestinationArray(destinationCache[field]);
      return; // don’t fetch again
    }

    const controller = new AbortController();

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = useMock
          ? "/testDestinations.json"
          : `${apiUrl}/destinations/metropolia/destinations?field=${field}&lang=fi`;

        const data = await fetchData<DestinationWithCoordinatesResponse>(url, {
          signal: controller.signal,
        });
        // console.log("Fetched destinations:", data); # TODO: remove

        // store in cache
        destinationCache[field] = data;
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
  }, [field, useMock]);

  return { destinationArray, loading, error };
};

/**
 * Hook to fetch profile data from the user API
 * @param userId - Optional user ID. If not provided, fetches current authenticated user
 */
const useProfileData = (userId?: string) => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
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

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the actual backend API
        const endpoint = userId 
          ? `${apiUrl}/profile/${userId}` 
          : `${apiUrl}/profile`;

        //console.log("Fetching profile from:", endpoint);

        const data = await fetchData<ProfileResponse>(
          endpoint,
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
  }, [userId]);

  return { profileData, loading, error };
};

/**
 * Hook to fetch applications data for the current user
 */
const useApplicationsData = () => {
  const [applications, setApplications] = useState<ApplicationsResponse | null>(null);
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

        const data = await fetchData<ApplicationsResponse>(
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

/**
 * Hook to manage application documents
 */
const useApplicationDocuments = () => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File, applicationId: string, documentType: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', documentType);

      const response = await fetch(`${apiUrl}/profile/applications/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const uploadedDocument = await response.json();
      setDocuments(prev => [...prev, uploadedDocument]);
      
      return uploadedDocument;
    } catch (err: unknown) {
      console.error("Error uploading document:", err);
      setError("Failed to upload document");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/profile/applications/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err: unknown) {
      console.error("Error deleting document:", err);
      setError("Failed to delete document");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (applicationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const data = await fetchData<ApplicationDocument[]>(
        `${apiUrl}/profile/applications/${applicationId}/documents`
      );

      setDocuments(data);
    } catch (err: unknown) {
      console.error("Error fetching documents:", err);
      setError("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  return { 
    documents, 
    loading, 
    error, 
    uploadDocument, 
    deleteDocument, 
    fetchDocuments 
  };
};

export { useDestinationData, useProfileData, useApplicationsData, useApplicationDocuments };