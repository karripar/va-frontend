"use client";
import fetchData from "@/lib/fetchData";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_CONTENT_API || "";

if (!API_URL) {
  console.error("NEXT_PUBLIC_CONTENT_API is not defined in environment variables");
}

export interface AdminContactInput {
  name: string;
  title: string;
  email: string;
}

export interface AdminContactResponse extends AdminContactInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Hook to manage admin contact information
const useAdminContacts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET all admin contact entries
  const getContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData<{ contacts: AdminContactResponse[] }>(
        `${API_URL}/contact/contacts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (err: unknown) {
      console.error("Error fetching contacts:", err);
      setError("Failed to fetch contacts");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ADD new contact (admin only)
  const addContact = async (contactData: AdminContactInput) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{ success: boolean; contact: AdminContactResponse }>(
        `${API_URL}/contact/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(contactData),
        }
      );

      return response;
    } catch (err: unknown) {
      console.error("Error adding contact:", err);
      setError("Failed to add contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE contact (admin only)
  const deleteContact = async (contactId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{ success: boolean; message: string }>(
        `${API_URL}/contact/contacts/${contactId}`,
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
      console.error("Error deleting contact:", err);
      setError("Failed to delete contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getContacts,
    addContact,
    deleteContact,
    loading,
    error,
  };
};

export { useAdminContacts };
