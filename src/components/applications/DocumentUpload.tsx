/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { FaLink, FaFileAlt, FaTrash, FaExternalLinkAlt, FaSpinner, FaInfoCircle } from "react-icons/fa";

interface DocumentUploadProps {
  applicationId: string;
  documentType: string;
  onDocumentUploaded?: (document: any) => void;
  onDocumentDeleted?: (documentId: string) => void;
  existingDocuments?: any[];
  required?: boolean;
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

export default function DocumentUpload({
  applicationId,
  documentType,
  onDocumentUploaded,
  onDocumentDeleted,
  existingDocuments = [],
  required = false
}: DocumentUploadProps) {
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [sourceType, setSourceType] = useState("google_drive");
  const [notes, setNotes] = useState("");

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

  const validateLink = (url: string, source: string): boolean => {
    const patterns: Record<string, RegExp> = {
      google_drive: /drive\.google\.com\/(file\/d\/|open\?id=)/,
      onedrive: /1drv\.ms\/|onedrive\.live\.com/,
      dropbox: /dropbox\.com\//,
      icloud: /icloud\.com/,
      other_url: /^https?:\/\/.+/
    };

    const pattern = patterns[source];
    return pattern ? pattern.test(url) : false;
  };

  const handleSubmitLink = async () => {
    // Validation
    if (!documentName.trim() || !documentUrl.trim()) {
      alert('Täytä kaikki pakolliset kentät');
      return;
    }

    if (!validateLink(documentUrl, sourceType)) {
      alert('Virheellinen linkki valitulle alustalle. Tarkista linkki ja yritä uudelleen.');
      return;
    }

    try {
      setSubmitting(true);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const documentData = {
        phase: documentType,
        documentType,
        fileName: documentName,
        fileUrl: documentUrl,
        sourceType,
        notes: notes || undefined,
      };

      const response = await fetch(`${apiUrl}/applications/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add document');
      }

      const savedDocument = await response.json();

      if (onDocumentUploaded) {
        onDocumentUploaded(savedDocument);
      }

      // Clear form
      setDocumentName("");
      setDocumentUrl("");
      setNotes("");
      setShowForm(false);

      alert('Dokumentti lisätty onnistuneesti!');
    } catch (error) {
      console.error("Failed to add document:", error);
      alert("Dokumentin lisääminen epäonnistui. Yritä uudelleen.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän dokumentin?')) {
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/applications/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      if (onDocumentDeleted) {
        onDocumentDeleted(documentId);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Dokumentin poistaminen epäonnistui.");
    }
  };

  return (
    <div className="space-y-3">
      {/* Add Document Button */}
      {!showForm && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            required && existingDocuments.length === 0
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <FaLink className="text-gray-400" size={24} />
            <p className="text-gray-600">
              Lisää dokumentti jakamalla linkki pilvitallennuksesta
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lisää dokumenttilinkki
            </button>
          </div>
        </div>
      )}

      {/* Document Link Form */}
      {showForm && (
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
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
                placeholder="esim. Opintosuoritusote_2024.pdf"
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

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Lisätyt dokumentit:</h5>
          {existingDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{getPlatformIcon(doc.sourceType)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {doc.sourceType?.replace('_', ' ')} • {new Date(doc.uploadedAt || doc.addedAt).toLocaleDateString("fi-FI")}
                  </p>
                  {doc.notes && (
                    <p className="text-xs text-gray-600 mt-1 italic">{doc.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Avaa dokumentti"
                >
                  <FaExternalLinkAlt size={14} />
                </a>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Poista dokumentti"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
