"use client";
import fetchData from "@/lib/fetchData";
import { useState } from "react";
import { ApplicationDocument } from "va-hybrid-types/contentTypes";

/**
 * Validate document link based on source type
 */
const validateDocumentLink = (url: string, sourceType: string): boolean => {
  const patterns: Record<string, RegExp> = {
    google_drive: /drive\.google\.com\/(file\/d\/|open\?id=)/,
    onedrive: /1drv\.ms\/|onedrive\.live\.com/,
    dropbox: /dropbox\.com\//,
    icloud: /icloud\.com/,
    other_url: /^https?:\/\/.+/
  };

  const pattern = patterns[sourceType];
  return pattern ? pattern.test(url) : false;
};

/**
 * Hook for managing application documents
 */
const useApplicationDocuments = () => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Validate link before submission
      if (!validateDocumentLink(data.fileUrl, data.sourceType)) {
        throw new Error('Invalid document link format for the selected platform');
      }

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/applications/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/documents/${documentId}`, {
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

  /**
   * Fetch all documents for an application
   */
  const fetchDocuments = async (applicationId: string) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const data = await fetchData<ApplicationDocument[]>(
        `${apiUrl}/applications/${applicationId}/documents`
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

      // Validating the link before submission
      if (!validateDocumentLink(data.url, data.sourceType)) {
        throw new Error('Invalid document link format for the selected platform');
      }

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/profile/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/profile/documents/${documentId}`, {
        method: 'DELETE',
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

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const data = await fetchData<ApplicationDocument[]>(`${apiUrl}/profile/documents`);
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