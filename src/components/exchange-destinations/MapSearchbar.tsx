"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MapSearchbarProps {
  onSearch: (query: string) => void;
}

const MapSearchbar: React.FC<MapSearchbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    en: {
      searchPlaceholder: "Search destinations...",
      search: "Search",
    },
    fi: {
      searchPlaceholder: "Hae kohteita...",
      search: "Haku",
    },
  };

  // Debounce effect: waits until typing pauses
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms debounce
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query); // still allows manual submit with button
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-lg shadow p-2"
    >
      <input
        type="text"
        placeholder={translations[language]?.searchPlaceholder || "Search..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        className="flex-grow px-3 py-2 rounded-l-lg outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#FF5000] text-white rounded-r-lg hover:bg-orange-600 transition"
      >
        {translations[language]?.search || "Search"}
      </button>
    </form>
  );
};

export default MapSearchbar;
