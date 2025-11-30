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
      const res = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });

      return res.ok ? res.json().catch(() => null) : null;
    },
    [token]
  );

  // Fetch ALL stories (admin)
  const fetchStories = useCallback(async () => {
    setLoading(true);

    const url = `${apiUrl}/exchange-stories/all`;
    console.log('🔍 Admin fetching from:', url);
    console.log('🔍 apiUrl value:', apiUrl);

    const data = await apiRequest(url);

    if (data?.stories) setStories(data.stories);
    setLoading(false);
  }, [apiUrl, apiRequest]);

  // Approve Story
  const approveStory = (id: string) =>
    apiRequest(`${apiUrl}/exchange-stories/${id}/approve`, {
      method: "PUT",
    }).then(fetchStories);

  // Delete Story
  const deleteStory = (id: string) =>
    confirm("Delete this story?") &&
    apiRequest(`${apiUrl}/exchange-stories/${id}`, {
      method: "DELETE",
    }).then(fetchStories);

  useEffect(() => {
    if (isAdmin) fetchStories();
  }, [isAdmin, fetchStories]);

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
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
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
                        onClick={() => approveStory(story.id)}
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
                      onClick={() => deleteStory(story.id)}
                      color="red"
                      icon={<FaTrash />}
                    />
                  </td>
                </tr>
              ))}
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
  color: string;
};

const IconBtn = ({ onClick, icon, color }: IconBtnProps) => (
  <button
    onClick={onClick}
    className={`p-1 text-${color}-600 hover:bg-${color}-50 rounded`}
  >
    {icon}
  </button>
);

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
