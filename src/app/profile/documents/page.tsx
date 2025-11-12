"use client";
import { useProfileData } from "@/hooks/profileHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaUpload,
  FaArrowLeft,
} from "react-icons/fa";

interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const { profileData: profile, loading } = useProfileData();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  useState(() => {
    if (profile?.documents) {
      // Assuming documents is array of document objects
      setDocuments(profile.documents as unknown as Document[]);
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload file to upload server
      const formData = new FormData();
      formData.append("document", file);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_UPLOAD_API}/profile/document`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload error:", errorText);
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();

      // 2. Save document reference to profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API}/profile/documents`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            url: uploadData.url,
          }),
        }
      );

      if (response.ok) {
        const newDoc = await response.json();
        setDocuments([...documents, newDoc]);
      } else {
        alert("Virhe dokumentin tallennuksessa");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Virhe dokumentin latauksessa");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    setRemoving(docId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API}/profile/documents/${docId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== docId));
      } else {
        alert("Virhe poistossa");
      }
    } catch (error) {
      console.error("Error removing document:", error);
      alert("Virhe poistossa");
    } finally {
      setRemoving(null);
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
    <div className="min-h-screen">
      {/* Orange Header with Title and Back Button */}
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Dokumentit</h1>
      </div>

      {/* Content - White background */}
      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-[var(--typography)] text-base mb-6">
                Ei dokumentteja vielä
              </p>

              {/* Upload Section */}
              <div className="mt-8">
                <p className="text-[var(--typography)] text-base font-medium mb-4">
                  Lisää dokumentti tästä:
                </p>
                <label className="cursor-pointer bg-[#FFB299] hover:bg-[#FFA07A] text-[var(--typography)] px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium">
                  <FaUpload />
                  {uploading ? "Ladataan..." : "Lisää"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              {/* Upload Button when documents exist */}
              <div className="mb-6 flex justify-end">
                <label className="cursor-pointer bg-[#FFB299] hover:bg-[#FFA07A] text-[var(--typography)] px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                  <FaUpload />
                  {uploading ? "Ladataan..." : "Lisää"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FaFileAlt className="text-[#FF5722]" />
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString("fi-FI")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 p-2"
                      >
                        <FaDownload />
                      </a>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        disabled={removing === doc.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
