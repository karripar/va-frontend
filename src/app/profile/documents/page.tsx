"use client";
import { useProfileData } from "@/hooks/apiHooks";
import { useProfileDocuments } from "@/hooks/documentsHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFileAlt, FaTrash, FaExternalLinkAlt, FaLink, FaArrowLeft, FaSpinner, FaInfoCircle } from "react-icons/fa";

interface Document {
  id: string;
  name: string;
  url: string;
  sourceType?: string;
  notes?: string;
  uploadedAt: string;
}

// Platform instructions component
const PlatformInstructions = ({ platform }: { platform: string }) => {
  const instructions: Record<string, { title: string; steps: string[] }> = {
    google_drive: {
      title: "Google Drive",
      steps: [
        "1. Avaa tiedostosi Google Drivessa",
        "2. Klikkaa 'Jaa' -painiketta",
        "3. Vaihda pääsy: 'Kuka tahansa linkillä'",
        "4. Klikkaa 'Kopioi linkki'",
        "5. Liitä linkki alle"
      ]
    },
    onedrive: {
      title: "OneDrive",
      steps: [
        "1. Klikkaa tiedostoa hiiren oikealla OneDrivessa",
        "2. Valitse 'Jaa'",
        "3. Klikkaa 'Kopioi linkki'",
        "4. Varmista: 'Kuka tahansa linkillä voi katsella'",
        "5. Liitä linkki alle"
      ]
    },
    dropbox: {
      title: "Dropbox",
      steps: [
        "1. Klikkaa tiedostoa hiiren oikealla Dropboxissa",
        "2. Valitse 'Jaa'",
        "3. Klikkaa 'Luo linkki'",
        "4. Klikkaa 'Kopioi linkki'",
        "5. Liitä linkki alle"
      ]
    },
    icloud: {
      title: "iCloud",
      steps: [
        "1. Valitse tiedostosi iCloudissa",
        "2. Klikkaa jakamiskuvaketta",
        "3. Klikkaa 'Kopioi linkki'",
        "4. Liitä linkki alle"
      ]
    },
    other_url: {
      title: "Muu URL",
      steps: [
        "Varmista, että URL:",
        "- On julkisesti saavutettavissa",
        "- On suora linkki dokumenttiin",
        "- On luotettavasta lähteestä"
      ]
    }
  };

  const info = instructions[platform];
  if (!info) return null;

  return (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
        <div className="text-sm">
          <h4 className="font-medium text-blue-900 mb-2">
            Kuinka saada jaettava linkki {info.title}:stä:
          </h4>
          <ol className="text-blue-800 space-y-1">
            {info.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default function DocumentsPage() {
  const { profileData: profile, loading } = useProfileData();
  const { addDocumentLink, deleteDocument } = useProfileDocuments();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [sourceType, setSourceType] = useState("google_drive");
  const [notes, setNotes] = useState("");

  useState(() => {
    if (profile?.documents) {
      setDocuments(profile.documents as unknown as Document[]);
    }
  });

  const getPlatformIcon = (sourceType: string) => {
    const icons: Record<string, string> = {
      google_drive: '📁',
      onedrive: '☁️',
      dropbox: '📦',
      icloud: '☁️',
      other_url: '🔗'
    };
    return icons[sourceType] || '📄';
  };

  const handleSubmitLink = async () => {
    if (!documentName.trim() || !documentUrl.trim()) {
      alert('Täytä kaikki pakolliset kentät');
      return;
    }

    setSubmitting(true);
    try {
      const newDoc = await addDocumentLink({
        name: documentName,
        url: documentUrl,
        sourceType,
        notes: notes || undefined,
      });

      setDocuments([...documents, newDoc]);
      
      // Clear form
      setDocumentName("");
      setDocumentUrl("");
      setNotes("");
      setShowForm(false);

      alert('Dokumentti lisätty onnistuneesti!');
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Virhe dokumentin lisäämisessä");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän dokumentin?')) {
      return;
    }

    setRemoving(docId);
    try {
      await deleteDocument(docId);
      setDocuments(documents.filter((doc) => doc.id !== docId));
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
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
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
          {documents.length === 0 && !showForm ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-base mb-6">Ei dokumentteja vielä</p>
              
              {/* Add Document Button */}
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#FFB299] hover:bg-[#FFA07A] text-gray-800 px-6 py-3 rounded-lg inline-flex items-center gap-2 font-medium"
              >
                <FaLink />
                Lisää dokumenttilinkki
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
                    Lisää dokumenttilinkki
                  </button>
                </div>
              )}

              {/* Document Link Form */}
              {showForm && (
                <div className="mb-6 border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-gray-900 mb-4">Lisää dokumenttilinkki</h4>
                  
                  <div className="space-y-3">
                    {/* Platform selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilvipalvelu *
                      </label>
                      <select
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="google_drive">Google Drive</option>
                        <option value="onedrive">OneDrive</option>
                        <option value="dropbox">Dropbox</option>
                        <option value="icloud">iCloud</option>
                        <option value="other_url">Muu URL</option>
                      </select>
                    </div>

                    {/* Document name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dokumentin nimi *
                      </label>
                      <input
                        type="text"
                        placeholder="esim. Passi.pdf"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Document URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jaettava linkki *
                      </label>
                      <input
                        type="url"
                        placeholder="Liitä jaettava linkki tähän"
                        value={documentUrl}
                        onChange={(e) => setDocumentUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lisätiedot (valinnainen)
                      </label>
                      <textarea
                        placeholder="Lisää huomioita tai selityksiä..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Platform Instructions */}
                    <PlatformInstructions platform={sourceType} />

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleSubmitLink}
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Lisätään...
                          </>
                        ) : (
                          'Lisää dokumentti'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setDocumentName("");
                          setDocumentUrl("");
                          setNotes("");
                        }}
                        disabled={submitting}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
                      >
                        Peruuta
                      </button>
                    </div>
                  </div>
                </div>
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
                            {doc.sourceType?.replace('_', ' ') || 'Dokumentti'} • {new Date(doc.uploadedAt).toLocaleDateString("fi-FI")}
                          </p>
                          {doc.notes && (
                            <p className="text-xs text-gray-600 mt-1 italic">{doc.notes}</p>
                          )}
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
                          onClick={() => handleRemoveDocument(doc.id)}
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

