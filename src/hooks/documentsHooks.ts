"use client";
import fetchData from "@/lib/fetchData";
import { useState, useEffect } from "react";
import { ApplicationDocument } from "va-hybrid-types/contentTypes";

/**
 * Validate document link based on source type
 * More flexible validation - checks if URL is valid and optionally matches platform
 */
const validateDocumentLink = (url: string, sourceType: string, strict: boolean = false): boolean => {
  // Basic URL validation
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
  } catch {
    // If not a full URL, check if it starts with http/https
    if (!/^https?:\/\/.+/.test(url)) return false;
  }

  // If not strict mode, any valid URL is acceptable
  if (!strict) return true;

  // Strict mode: validate against platform patterns
  const patterns: Record<string, RegExp> = {
    google_drive: /drive\.google\.com/,
    onedrive: /(1drv\.ms|onedrive\.live\.com|sharepoint\.com)/,
    dropbox: /dropbox\.com/,
    icloud: /icloud\.com/,
    other_url: /^https?:\/\/.+/
  };

  const pattern = patterns[sourceType];
  return pattern ? pattern.test(url) : true;
};

/**
 * Hook for managing application documents
 */
const useApplicationDocuments = (phase?: string) => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents on mount and when phase changes
  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
        if (!apiUrl) {
          throw new Error("Upload API URL not configured");
        }

        const endpoint = phase 
          ? `${apiUrl}/linkUploads/documents?phase=${phase}`
          : `${apiUrl}/linkUploads/documents`;

        const data = await fetchData<ApplicationDocument[]>(endpoint);
        setDocuments(data || []);
      } catch (err: unknown) {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, [phase]);

  /**
   * Add a document link (replaces old file upload)
   */
  const addDocumentLink = async (data: {
    phase: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    sourceType: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Skipping validation for checkbox only tasks
      if (data.sourceType !== 'checkbox' && !validateDocumentLink(data.fileUrl, data.sourceType, false)) {
        throw new Error('Invalid document link format');
      }

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/linkUploads/documents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add document');
      }

      const addedDocument = await response.json();
      setDocuments(prev => [...prev, addedDocument]);
      
      return addedDocument;
    } catch (err: unknown) {
      console.error("Error adding document link:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add document link";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a document
   */
  const deleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/linkUploads/documents/${documentId}`, {
        method: 'DELETE',
        headers,
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

  /**
   * Fetch all documents for an application
   */
  const fetchDocuments = async (applicationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const data = await fetchData<ApplicationDocument[]>(
        `${apiUrl}/linkUploads/documents?applicationId=${applicationId}`
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
    addDocumentLink,
    deleteDocument, 
    fetchDocuments 
  };
};

/**
 * Hook for managing profile documents (separate from application documents)
 */
const useProfileDocuments = () => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add a document link to profile
   */
  const addDocumentLink = async (data: {
    name: string;
    url: string;
    sourceType: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Validating the link before submission (non-strict mode)
      if (!validateDocumentLink(data.url, data.sourceType, false)) {
        throw new Error('Invalid document link format');
      }

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/linkUploads/documents`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add document');
      }

      const addedDocument = await response.json();
      setDocuments(prev => [...prev, addedDocument]);
      
      return addedDocument;
    } catch (err: unknown) {
      console.error("Error adding document link:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to add document link";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a profile document
   */
  const deleteDocument = async (documentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/linkUploads/documents/${documentId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove document');
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

  /**
   * Fetch all profile documents
   */
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) {
        throw new Error("Upload API URL not configured");
      }

      const data = await fetchData<ApplicationDocument[]>(`${apiUrl}/linkUploads/documents`);
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
    addDocumentLink,
    deleteDocument,
    fetchDocuments
  };
};

export { useApplicationDocuments, useProfileDocuments };