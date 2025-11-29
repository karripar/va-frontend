"use client";
import { useProfileData } from "@/hooks/profileHooks";
import { useProfileDocuments } from "@/hooks/documentsHooks";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import PlatformInstructions from "@/components/profile/PlatformInstructions";
import { FormField, SubmitButton } from "@/components/profile/FormComponents";
import { getPlatformIcon } from "@/lib/platformUtils";
import { useState, useEffect } from "react";
import { FaFileAlt, FaTrash, FaExternalLinkAlt, FaLink, FaSpinner } from "react-icons/fa";
import { Document } from "va-hybrid-types/contentTypes";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/documents";

const PLATFORM_OPTIONS = [
  { value: "google_drive", label: "Google Drive" },
  { value: "onedrive", label: "OneDrive" },
  { value: "dropbox", label: "Dropbox" },
  { value: "icloud", label: "iCloud" },
  { value: "other_url", label: "Muu URL" }
];

export default function DocumentsPage() {
  const { loading: profileLoading } = useProfileData();
  const { documents: fetchedDocuments, addDocumentLink, deleteDocument, fetchDocuments, loading: docsLoading } = useProfileDocuments();
  const { language } = useLanguage();
  const t = translations[language];
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    sourceType: "google_drive",
    notes: ""
  });

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update local state when documents are fetched
  useEffect(() => {
    if (fetchedDocuments && fetchedDocuments.length > 0) {
      setDocuments(fetchedDocuments as unknown as Document[]);
    }
  }, [fetchedDocuments]);

  const resetForm = () => {
    setFormData({ name: "", url: "", sourceType: "google_drive", notes: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      alert(t.fillRequired);
      return;
    }

    setSubmitting(true);
    try {
      const newDoc = await addDocumentLink({
        name: formData.name,
        url: formData.url,
        sourceType: formData.sourceType,
        notes: formData.notes || undefined,
      });
      setDocuments([...documents, newDoc]);
      resetForm();
      alert(t.addedSuccessfully);
    } catch (error) {
      console.error("Error adding document:", error);
      alert(t.errorAdding);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (docId: string) => {
    if (!confirm(t.confirmRemove)) return;

    setRemoving(docId);
    try {
      await deleteDocument(docId);
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Error removing document:", error);
      alert(t.errorRemoving);
    } finally {
      setRemoving(null);
    }
  };

  if (profileLoading || docsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <ProfileHeader title={t.title} />

      {/* Content - White background */}
      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          {documents.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-base mb-6">{t.noDocuments}</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#FFB299] hover:bg-[#FFA07A] text-gray-800 px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium"
              >
                <FaLink />
                {t.addDocumentLink}
              </button>
            </div>
          ) : (
            <div>
              {/* Add Button when documents exist */}
              {!showForm && (
                <div className="mb-6 flex justify-end">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#FFB299] hover:bg-[#FFA07A] text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <FaLink />
                    {t.addDocumentLink}
                  </button>
                </div>
              )}

              {/* Document Link Form */}
              {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-gray-900 mb-4">{t.addDocumentLink}</h4>
                  
                  <div className="space-y-3">
                    <FormField label={t.platform} required>
                      <select
                        value={formData.sourceType}
                        onChange={(e) => setFormData({...formData, sourceType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PLATFORM_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label={t.name} required>
                      <input
                        type="text"
                        placeholder="esim. Passi.pdf"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormField>

                    <FormField label={t.url} required>
                      <input
                        type="url"
                        placeholder={language === "en" ? "Paste shareable link here" : "Liitä jaettava linkki tähän"}
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormField>

                    <FormField label={t.notes}>
                      <textarea
                        placeholder={language === "en" ? "Add notes or explanations..." : "Lisää huomioita tai selityksiä..."}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </FormField>

                    <PlatformInstructions platform={formData.sourceType} />

                    <div className="flex gap-2 mt-4">
                      <SubmitButton loading={submitting}>
                        {t.submit}
                      </SubmitButton>
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={submitting}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Documents List */}
              {documents.length > 0 && (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{getPlatformIcon(doc.sourceType || 'other_url')}</span>
                        <div>
                          <p className="font-medium text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.sourceType?.replace('_', ' ') || 'Dokumentti'} • {new Date(doc.addedAt).toLocaleDateString("fi-FI")}
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
                          <FaExternalLinkAlt />
                        </a>
                        <button
                          onClick={() => handleRemove(doc.id)}
                          disabled={removing === doc.id}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2"
                        >
                          {removing === doc.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
