import { useEffect, useState } from "react";
import fetchData from "@/lib/fetchData";

/**
 * fetch instruction visibility settings
 */
const useInstructionVisibility = () => {
  const [visibility, setVisibility] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisibility = async () => {
      try {
        setLoading(true);
        setError(null);

        const contentApiUrl =
          process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
        const url = `${contentApiUrl}/instructions/visibility`;

        const data: Array<{ stepIndex: number; isVisible: boolean }> =
          await fetchData(url);
        // nine steps overall
        const visibilityArray = new Array(9).fill(true);
        data.forEach((item) => {
          if (item.stepIndex < visibilityArray.length) {
            visibilityArray[item.stepIndex] = item.isVisible;
          }
        });
        setVisibility(visibilityArray);
      } catch (err) {
        console.error("Error fetching visibility:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch visibility"
        );
        setVisibility(new Array(9).fill(true));
      } finally {
        setLoading(false);
      }
    };

    fetchVisibility();
  }, []);

  return { visibility, loading, error };
};

/**
 * toggle instruction visibility (admin only)
 */
const useToggleInstructionVisibility = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = async (
    stepIndex: number
  ): Promise<boolean | null> => {
    try {
      setLoading(true);
      setError(null);

      const contentApiUrl =
        process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
      const url = `${contentApiUrl}/instructions/visibility/${stepIndex}`;
      const authToken = localStorage.getItem("authToken") || "";

      const data: {
        message: string;
        visibility: { stepIndex: number; isVisible: boolean };
      } = await fetchData(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      return data.visibility.isVisible;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Toggle failed";
      setError(errorMessage);
      console.error("Toggle visibility error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleVisibility,
    loading,
    error,
  };
};

/**
 * fetch all instruction links
 */
const useInstructionLinks = () => {
  const [links, setLinks] = useState<
    Array<{
      _id: string;
      stepIndex: number;
      label: string;
      href: string;
      isExternal: boolean;
      isFile: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        setError(null);

        const contentApiUrl =
          process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
        const url = `${contentApiUrl}/instructions/links`;

        const data: Array<{
          _id: string;
          stepIndex: number;
          label: string;
          href: string;
          isExternal: boolean;
          isFile: boolean;
        }> = await fetchData(url);
        setLinks(data);
      } catch (err) {
        console.error("Error fetching instruction links:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch links");
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error };
};

/**
 * update an instruction link (admin only)
 */
const useUpdateInstructionLink = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLink = async (
    linkId: string,
    updates: {
      label?: string;
      href?: string;
      isExternal?: boolean;
      isFile?: boolean;
    }
  ): Promise<{
    _id: string;
    label: string;
    href: string;
    isExternal: boolean;
    isFile: boolean;
  } | null> => {
    try {
      setLoading(true);
      setError(null);

      const contentApiUrl =
        process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
      const url = `${contentApiUrl}/instructions/links/${linkId}`;
      const authToken = localStorage.getItem("authToken") || "";
      
      const data: {
        message: string;
        link: {
          _id: string;
          label: string;
          href: string;
          isExternal: boolean;
          isFile: boolean;
        };
      } = await fetchData(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });

      return data.link;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      console.error("Update link error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateLink, loading, error };
};

export {
  useInstructionVisibility,
  useToggleInstructionVisibility,
  useInstructionLinks,
  useUpdateInstructionLink,
};
