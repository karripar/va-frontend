"use client";
import { StoryFilters } from "@/hooks/exchangeStoriesHooks";
import { useState } from "react";
import { FaSearch, FaStar, FaFilter } from "react-icons/fa";

interface StoryFiltersProps {
  onFilterChange: (filters: StoryFilters) => void;
}

export default function StoryFiltersComponent({ onFilterChange }: StoryFiltersProps) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [minRating, setMinRating] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "rating">("recent");
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      search: search || undefined,
      country: country || undefined,
      minRating,
      sort: sortBy,
    });
  };

  const handleReset = () => {
    setSearch("");
    setCountry("");
    setMinRating(undefined);
    setSortBy("recent");
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Etsi vaihtokokemuksia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <FaFilter />
          Suodata
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maa</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            >
              <option value="">Kaikki maat</option>
              <option value="Spain">Espanja</option>
              <option value="France">Ranska</option>
              <option value="Germany">Saksa</option>
              <option value="Japan">Japani</option>
              <option value="South Korea">Etelä-Korea</option>
              <option value="USA">USA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min. Arvio</label>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={minRating || ""}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1-5"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Järjestys</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "rating")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            >
              <option value="recent">Uusimmat</option>
              <option value="popular">Suosituimmat</option>
              <option value="rating">Parhaat arviot</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Tyhjennä
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#E64A19]"
        >
          Hae
        </button>
      </div>
    </div>
  );
}
