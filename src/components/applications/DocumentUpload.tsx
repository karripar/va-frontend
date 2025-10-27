/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef } from "react";
import { FaUpload, FaFileAlt, FaTrash, FaDownload, FaSpinner } from "react-icons/fa";

interface DocumentUploadProps {
  applicationId: string;
  documentType: string;
  onDocumentUploaded?: (document: any) => void;
  onDocumentDeleted?: (documentId: string) => void;
  existingDocuments?: any[];
  required?: boolean;
}

export default function DocumentUpload({
  applicationId,
  documentType,
  onDocumentUploaded,
  onDocumentDeleted,
  existingDocuments = [],
  required = false
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      // Step 1: Upload the actual file
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch(`${apiUrl}/profile/applications/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const uploadResult = await uploadResponse.json();

      // Step 2: Save document metadata to application
      const documentData = {
        phase: documentType, // Using documentType as phase
        documentType,
        fileName: uploadResult.originalName,
        fileUrl: uploadResult.fileUrl,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
      };

      const metadataResponse = await fetch(`${apiUrl}/profile/applications/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to save document metadata');
      }

      const savedDocument = await metadataResponse.json();

      if (onDocumentUploaded) {
        onDocumentUploaded(savedDocument);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      // You might want to show an error toast/notification here
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiUrl}/profile/applications/documents/${documentId}`, {
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
      // You might want to show an error toast/notification here
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : required && existingDocuments.length === 0
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <FaSpinner className="text-blue-500 animate-spin" size={24} />
            <p className="text-gray-600">Ladataan tiedostoa...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <FaUpload className="text-gray-400" size={24} />
            <p className="text-gray-600">
              Vedä tiedosto tähän tai{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                selitse tiedosto
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Tuetut tiedostotyypit: PDF, DOC, DOCX, JPG, PNG (maks. 10MB)
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Ladatut tiedostot:</h5>
          {existingDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FaFileAlt className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString("fi-FI")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(doc.fileUrl, "_blank")}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  title="Lataa tiedosto"
                >
                  <FaDownload size={14} />
                </button>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  title="Poista tiedosto"
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