"use client";
import fetchData from "@/lib/fetchData";
import { useEffect, useState } from "react";
import {
  ContactMessageInput,
  ContactMessageResponse,
} from "va-hybrid-types/contentTypes";
import { useAuth } from "./useAuth";

const API_URL = process.env.NEXT_PUBLIC_CONTENT_API || "";

if (!API_URL) {
  console.error(
    "NEXT_PUBLIC_CONTENT_API is not defined in environment variables"
  );
}

// Hook to manage contact messages
const useContactMessages = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // post a new contact message to the admins
  const postMessage = async (
    messageData: Omit<ContactMessageInput, "email" | "name">
  ) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const body = {
        ...messageData,
        email: user?.email ?? "",
        name: user?.userName ?? "",
      };

      const response = await fetchData<ContactMessageResponse>(
        `${API_URL}/contact/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify(body),
        }
      );

      return response;
    } catch (err: unknown) {
      console.error("Error posting contact message:", err);
      setError("Failed to send message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // getMessages for admins
  const getMessages = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{messages: ContactMessageResponse[]}>(
        `${API_URL}/contact/messages`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (err: unknown) {
      console.error("Error fetching contact messages:", err);
      setError("Failed to fetch messages");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // delete a contact message by id, only for admins (hence the token)
  const deleteMessage = async (messageId: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData<{ success: boolean }>(
        `${API_URL}/contact/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (err: unknown) {
      console.error("Error deleting contact message:", err);
      setError("Failed to delete message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

// reply to a contact message by id, only for admins
  const replyToMessage = async (messageId: string, reply: string) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No auth token found");
      setLoading(false);
      return;
    }

    try {
      const body = {
        responderName: user?.userName ?? "",
        responderEmail: user?.email ?? "",
        message: reply,
      };

      const response = await fetchData<{ success: boolean }>(
        `${API_URL}/contact/message/reply/${messageId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      return response;
    } catch (err: unknown) {
      console.error("Error replying to contact message:", err);
      setError("Failed to send reply");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    postMessage,
    getMessages,
    deleteMessage,
    replyToMessage,
    loading,
    error,
  };
};

export { useContactMessages };
