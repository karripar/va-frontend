import { useState } from "react";

interface UploadResponse {
  url: string;
  name: string;
  size: number;
}

interface ServerResponse {
  message: string;
  data: {
    filename: string;
    url: string;
    media_type: string;
    filesize: number;
  };
}

// hook for admins to upload files to the instructions page
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<UploadResponse | null> => {
    try {
      setUploading(true);
      const uploadApiUrl =
        process.env.NEXT_PUBLIC_UPLOAD_API || "http://localhost:3003/api/v1";
      const authToken = localStorage.getItem("authToken") || "";

      const form = new FormData();
      form.append("file", file);

      const response = await fetch(`${uploadApiUrl}/uploads/upload`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const responseData = (await response.json()) as ServerResponse;

      // convert upload-server response format to our hook's format
      return {
        url: responseData.data.url,
        name: responseData.data.filename,
        size: responseData.data.filesize,
      };
    } catch (error) {
      console.error("Upload error:", error);
      setError("File upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading,
    error,
  };
};
