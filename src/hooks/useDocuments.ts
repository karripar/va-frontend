import { useState} from "react";
import fetchData from "@/lib/fetchData";

interface Document {
  filename: string;
  url: string;
  media_type: string;
  filesize: number;
  uploadedAt: string;
}

// hook to manage documents: list and delete
// for admin users
export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch the list of documents
  const fetchDocuments = async () => {
    try {
      const uploadApiUrl =
        process.env.NEXT_PUBLIC_UPLOAD_API || "http://localhost:3003/api/v1";
      const authToken = localStorage.getItem("authToken");

      const response = await fetchData<{ documents: Document[] }>(
        `${uploadApiUrl}/uploads/list`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // Response comes back as { documents: Document[] }
      // sort documents by date, newest first
      const sortedDocuments = response.documents.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      setDocuments(sortedDocuments);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Virhe haettaessa dokumentteja");
      }
    } finally {
      setLoading(false);
    }
  };

  // delete a document by filename
  const deleteDocument = async (filename: string) => {
    try {
      const uploadApiUrl =
        process.env.NEXT_PUBLIC_UPLOAD_API || "http://localhost:3003/api/v1";
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found");
        return false;
      }

      await fetchData<{ message: string }>(`${uploadApiUrl}/uploads/delete/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Jos poisto onnistui (ei heittänyt virhettä), päivitetään lista
      await fetchDocuments();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Virhe poistettaessa tiedostoa");
      }
      return false;
    }
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    deleteDocument,
  };
};
