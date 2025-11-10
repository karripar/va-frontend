"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useDocuments } from "@/hooks/useDocuments";
import Link from "next/link";
import { FaTrashCan } from "react-icons/fa6";

const DocumentManagement = () => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { language } = useLanguage();
  const { documents, loading, error, deleteDocument, fetchDocuments } =
    useDocuments();

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translations = {
    en: {
      title: "Document Management",
      noDocuments: "No documents uploaded",
      fileName: "Filename",
      uploadDate: "Uploaded",
      clock: "at:",
      actions: "Delete",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete:",
      yes: "Yes, delete",
      no: "Cancel",
      error: "Error deleting file",
      backToHome: "Back to Admin Panel",
    },
    fi: {
      title: "Dokumenttien hallinta",
      noDocuments: "Ei ladattuja dokumentteja",
      fileName: "Tiedoston nimi",
      uploadDate: "Lisätty",
      clock: "klo:",
      actions: "Poista",
      delete: "Poista",
      confirmDelete: "Haluatko varmasti poistaa tiedoston:",
      yes: "Kyllä, poista",
      no: "Peruuta",
      error: "Virhe poistettaessa tiedostoa",
      backToHome: "Takaisin hallintapaneeliin",
    },
  };

  const t = translations[language];

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (filename: string) => {
    try {
      const success = await deleteDocument(filename);
      if (success) {
        setDeleteConfirm(null);
        setDeleteError(null);
      } else {
        setDeleteError(t.error);
      }
    } catch (err) {
      setDeleteError((err as Error).message);
    }
  };

  if (loading) {
    return <div className="p-6 font-machina-regular">Loading...</div>;
  }

  return (
    <>
      <div className="bg-[var(--va-orange)] text-white px-2 h-20 flex items-center mx-auto relative">
        <Link
          href="/admin"
          className="absolute left-4 sm:left-6 text-white hover:scale-110"
          aria-label={t.backToHome}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-lg text-center mx-auto max-w-50 sm:max-w-full"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t.title}
        </h1>
      </div>
      <div className="mx-auto max-w-4xl my-4">
        {(error || deleteError) && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded font-montreal-mono">
            {error || deleteError}
          </div>
        )}

        {documents.length === 0 ? (
          <p className="text-[var(--typography)] font-montreal-mono">
            {t.noDocuments}
          </p>
        ) : (
          <div className="overflow-x-hidden sm:mx-6">
            <table className="min-w-full table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-montreal-mono-medium text-sm text-[var(--typography)] w-[60%]">
                    {t.fileName}
                  </th>
                  <th className="px-4 py-3 text-left font-montreal-mono-medium text-sm text-[var(--typography)] w-[30%]">
                    {t.uploadDate}
                  </th>
                  <th className="px-4 py-3 text-left font-montreal-mono-medium text-sm text-[var(--typography)] w-[10%]">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--va-border)]">
                {documents.map((doc) => (
                  <tr
                    key={doc.filename}
                  >
                    <td className="px-4 py-4 font-montreal-mono max-w-[150px] sm:max-w-[300px]">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block break-words underline text-blue-500"
                      >
                        {doc.filename}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-montreal-mono text-sm">
                      {new Date(doc.uploadedAt).toLocaleDateString("fi-FI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      <br aria-hidden="true" />
                      {t.clock}{" "}
                      {new Date(doc.uploadedAt).toLocaleTimeString("fi-FI", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setDeleteConfirm(doc.filename)}
                          className="text-[var(--va-orange)] font-machina-regular transition-colors p-1 rounded-full hover:scale-105"
                          aria-label={`${t.delete} ${doc.filename}`}
                        >
                          <FaTrashCan />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-center bg-[var(--va-grey)]/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 border border-[var(--va-border)] shadow-lg">
            <h3 className="text-lg font-semibold text-[var(--typography)] mb-4">
              {t.confirmDelete}
              <br />
              <span className="break-words text-base font-montreal-mono mt-4 block">
                {deleteConfirm}
              </span>
            </h3>
            <div className="flex gap-4 mt-8 mb-2 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[var(--background)] bg-[var(--va-dark-grey)] rounded-md hover:scale-110"
              >
                {t.no}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-[var(--va-orange)] text-white rounded-md hover:scale-110"
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentManagement;
