/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID } from "@/config/roles";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { ExchangeStory } from "va-hybrid-types/contentTypes";
import StoryUploadForm from "@/app/tips/StoryUploadForm";

export default function StoryAdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState<ExchangeStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isAdmin =
    isAuthenticated && user?.user_level_id === Number(ADMIN_LEVEL_ID);

  const apiUrl = process.env.NEXT_PUBLIC_CONTENT_API;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Unified Fetch Wrapper
  const apiRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!token) {
        console.error("No auth token available");
        return null;
      }

      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
          },
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({ error: "Request failed" }));
          console.error("API request failed:", res.status, error);
          return null;
        }

        return res.json().catch(() => null);
      } catch (error) {
        console.error("API request error:", error);
        return null;
      }
    },
    [token]
  );

  // Fetch ALL stories 
  const fetchStories = useCallback(async () => {
    setLoading(true);

    const url = `${apiUrl}/exchange-stories/all`;

    const data = await apiRequest(url);

    if (data?.stories) {
      setStories(data.stories);
      // Debug: Check what ID field is available
      if (data.stories.length > 0) {
        console.log("Story object keys:", Object.keys(data.stories[0]));
        console.log("First story:", data.stories[0]);
      }
    } else {
      setStories([]);
      console.warn("No stories data received from backend");
    }
    
    setLoading(false);
  }, [apiUrl, apiRequest]);

  // Approve Story
  const approveStory = async (id: string) => {
    if (!id) {
      console.error("Story ID is undefined");
      alert("Cannot approve story: ID is missing");
      return;
    }

    console.log("Approving story with ID:", id);
    
    const result = await apiRequest(`${apiUrl}/exchange-stories/${id}/approve`, {
      method: "PUT",
    });
    
    if (result) {
      console.log("Story approved successfully");
      await fetchStories();
    } else {
      alert("Failed to approve story");
    }
  };

  // Delete Story
  const deleteStory = async (id: string) => {
    if (!id) {
      console.error("Story ID is undefined");
      alert("Cannot delete story: ID is missing");
      return;
    }

    if (!confirm("Delete this story? This action cannot be undone.")) {
      return;
    }

    console.log("Deleting story with ID:", id);

    const result = await apiRequest(`${apiUrl}/exchange-stories/${id}`, {
      method: "DELETE",
    });

    if (result) {
      console.log("Story deleted successfully");
      await fetchStories();
    } else {
      alert("Failed to delete story");
    }
  };

  useEffect(() => {
    if (isAdmin) fetchStories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Helper function to get story ID (handles different ID field names)
  const getStoryId = (story: ExchangeStory): string => {
    // Try different possible ID field names
    const id = (story as any).id || (story as any)._id || (story as any).story_id || (story as any).storyId;
    if (!id) {
      console.error("Story missing ID field:", story);
    }
    return id;
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-gray-50 border rounded-xl p-6 mb-8">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Exchange Stories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#E64A19]"
        >
          <FaPlus /> Add Story
        </button>
      </header>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : stories.length === 0 ? (
        <p className="text-gray-600">No stories yet. Click &quot;Add Story&quot; to create one.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                {["Country", "City", "Title", "Student", "Status", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {stories.map((story, index) => {
                const storyId = getStoryId(story);
                return (
                  <tr key={storyId || `story-${index}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{story.country}</td>
                    <td className="px-4 py-3">{story.city}</td>
                    <td className="px-4 py-3">{story.title}</td>
                    <td className="px-4 py-3">{story.userName}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          story.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {story.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3 flex gap-2">
                      {!story.isApproved && (
                        <IconBtn
                          onClick={() => approveStory(storyId)}
                          color="green"
                          icon={<FaCheck />}
                        />
                      )}

                      <IconBtn
                        onClick={() => {}}
                        color="blue"
                        icon={<FaEdit />}
                      />

                      <IconBtn
                        onClick={() => deleteStory(storyId)}
                        color="red"
                        icon={<FaTrash />}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h3 className="text-xl font-bold mb-4">Add New Story</h3>
          <StoryUploadForm
            onSuccess={() => {
              setShowForm(false);
              fetchStories();
            }}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}

type IconBtnProps = {
  onClick: () => void;
  icon: React.ReactNode;
  color: "green" | "blue" | "red";
};

const IconBtn = ({ onClick, icon, color }: IconBtnProps) => {
  const colorClasses = {
    green: "text-green-600 hover:bg-green-50",
    blue: "text-blue-600 hover:bg-blue-50",
    red: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-1 rounded ${colorClasses[color]}`}
    >
      {icon}
    </button>
  );
};

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl w-full max-w-2xl max-height-[90vh] overflow-y-auto p-6 relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <FaTimes />
      </button>
      {children}
    </div>
  </div>
);
