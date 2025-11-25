import { useEffect, useState } from "react";
import fetchData from "@/lib/fetchData";
import { useLanguage } from "@/context/LanguageContext";

/**
 * fetch all instruction steps (content)
 */
export const useInstructionSteps = () => {
  const { language } = useLanguage();
  const [steps, setSteps] = useState<
    Array<{
      stepIndex: number;
      titleFi: string;
      titleEn: string;
      textFi: string;
      textEn: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setLoading(true);
        setError(null);
        const contentApiUrl =
          process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
        const url = `${contentApiUrl}/instructions/steps`;
        const data = await fetchData(url);
        setSteps(
          data as Array<{
            stepIndex: number;
            titleFi: string;
            titleEn: string;
            textFi: string;
            textEn: string;
          }>
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch steps");
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [language]);

  // Palauta oikea kieliversio
  const mappedSteps = steps.map((s) => ({
    title: language === "en" ? s.titleEn : s.titleFi,
    text: language === "en" ? s.textEn : s.textFi,
    stepIndex: s.stepIndex,
  }));

  return { steps: mappedSteps, rawSteps: steps, loading, error };
};

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
 * update an instruction step (admin only)
 */
export const useUpdateInstructionStep = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStep = async (
    stepIndex: number,
    updates: {
      titleFi?: string;
      titleEn?: string;
      textFi?: string;
      textEn?: string;
    }
  ): Promise<{
    stepIndex: number;
    titleFi: string;
    titleEn: string;
    textFi: string;
    textEn: string;
  } | null> => {
    try {
      setLoading(true);
      setError(null);
      const contentApiUrl =
        process.env.NEXT_PUBLIC_CONTENT_API || "http://localhost:3002/api/v1";
      const url = `${contentApiUrl}/instructions/steps/${stepIndex}`;
      const authToken = localStorage.getItem("authToken") || "";
      const data: {
        message: string;
        step: {
          stepIndex: number;
          titleFi: string;
          titleEn: string;
          textFi: string;
          textEn: string;
        };
      } = await fetchData(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });
      return data.step;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateStep, loading, error };
};

/**
 * fetch all instruction links
 */
const useInstructionLinks = () => {
  const [links, setLinks] = useState<
    Array<{
      _id: string;
      stepIndex: number;
      labelFi?: string;
      labelEn?: string;
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
          labelFi?: string;
          labelEn?: string;
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
      labelFi?: string;
      labelEn?: string;
      href?: string;
      isExternal?: boolean;
      isFile?: boolean;
    }
  ): Promise<{
    _id: string;
    labelFi?: string;
    labelEn?: string;
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
          labelFi?: string;
          labelEn?: string;
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
