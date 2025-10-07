"use client";
import { useProfileData } from "@/hooks/apiHooks";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

export default function EditProfilePage() {
  const { profileData: profile, loading } = useProfileData();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize form when profile loads
  useState(() => {
    if (profile) {
      setUserName(profile.userName || "");
      setLinkedinUrl(profile.linkedinUrl || "");
      setAvatarPreview(profile.avatarUrl || "");
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Upload avatar if changed
      let avatarUrl = profile?.avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        
        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_UPLOAD_API}/upload/avatar`,
          {
            method: "POST",
            body: formData,
          }
        );
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          avatarUrl = uploadData.url;
        }
      }

      // 2. Update profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
            avatarUrl,
            linkedinUrl,
          }),
        }
      );

      if (response.ok) {
        router.push("/profile");
      } else {
        alert("Virhe profiilin päivityksessä");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Virhe profiilin päivityksessä");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Ladataan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header with Title and Back Button */}
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Muokkaa profiilia</h1>
      </div>

      {/* Content */}
      <div className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
          {avatarPreview && (
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full mb-4"
            />
          )}
          <label className="cursor-pointer bg-[#FFB299] hover:bg-[#FFA07A] text-gray-800 px-4 py-2 rounded-lg">
            Vaihda kuva
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Käyttäjänimi
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
            required
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL (valinnainen)
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB299] focus:border-transparent"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Peruuta
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-[#FFB299] hover:bg-[#FFA07A] text-gray-800 rounded-lg disabled:opacity-50"
          >
            {saving ? "Tallennetaan..." : "Tallenna"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
