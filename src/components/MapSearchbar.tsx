"use client";
import React, { useState } from "react";

interface MapSearchbarProps {
  onSearch: (query: string) => void;
}

const MapSearchbar: React.FC<MapSearchbarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white rounded-lg shadow p-2"
    >
      <input
        type="text"
        placeholder="Hae kohteita..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-3 py-2 rounded-l-lg outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#FF5000] text-white rounded-r-lg hover:bg-orange-600 transition"
      >
        Haku
      </button>
    </form>
  );
};

export default MapSearchbar;
