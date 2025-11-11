"use client";
import { useState } from "react";
import { useExchangeStories, useFeaturedStories, StoryFilters } from "@/hooks/exchangeStoriesHooks";
import StoryCard from "@/components/exchange-stories/StoryCard";
import StoryFiltersComponent from "@/components/exchange-stories/StoryFilters";
import { FaSpinner, FaStar } from "react-icons/fa";

export default function TipsPage() {
  const [filters, setFilters] = useState<StoryFilters>({});
  const { stories, loading, error } = useExchangeStories(filters);
  const { stories: featured, loading: featuredLoading } = useFeaturedStories();

  const handleFilterChange = (newFilters: StoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Vaihtokokemuksia</h1>
          <p className="text-lg text-white/90">
            Löydä inspiraatiota ja vinkkejä aiempien vaihto-opiskelijoiden tarinoista
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Stories */}
        {!featuredLoading && featured.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FaStar className="text-yellow-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900">Suositellut tarinat</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <StoryFiltersComponent onFilterChange={handleFilterChange} />

        {/* Stories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-[#FF5722]" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#E64A19]"
            >
              Yritä uudelleen
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">Ei tarinoita hakuehdoilla</p>
            <button
              onClick={() => setFilters({})}
              className="text-[#FF5722] font-semibold hover:underline"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

