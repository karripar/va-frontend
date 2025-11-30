"use client";
import { useState } from "react";
import { useExchangeStories, useFeaturedStories, StoryFilters, ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import StoryMindMap from "@/components/exchange-stories/StoryMindMap";
import StoryModal from "@/components/exchange-stories/StoryModal";
import StoryFiltersComponent from "@/components/exchange-stories/StoryFilters";
import StoryAdminPanel from "@/components/exchange-stories/StoryAdminPanel";
import { FaSpinner, FaStar, FaMap, FaList } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID } from "@/config/roles";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/tips";

export default function TipsPage() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [filters, setFilters] = useState<StoryFilters>({});
  const [viewMode, setViewMode] = useState<"mindmap" | "list">("mindmap");
  const [selectedStory, setSelectedStory] = useState<ExchangeStory | null>(null);
  const { stories, loading, error } = useExchangeStories(filters);
  const { stories: featured, loading: featuredLoading } = useFeaturedStories();

  const isAdmin = isAuthenticated && user?.user_level_id === Number(ADMIN_LEVEL_ID);

  const handleFilterChange = (newFilters: StoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">{t.title}</h1>
          <p className="text-lg text-white/90">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Panel */}
        {isAdmin && <StoryAdminPanel />}

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-lg shadow p-1 flex gap-1">
            <button
              onClick={() => setViewMode("mindmap")}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                viewMode === "mindmap"
                  ? "bg-[#FF5722] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaMap />
              {t.mindMap}
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                viewMode === "list"
                  ? "bg-[#FF5722] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaList />
              {t.listView}
            </button>
          </div>
        </div>

        {/* Filters & only in list view */}
        {viewMode === "list" && (
          <StoryFiltersComponent onFilterChange={handleFilterChange} />
        )}

        {/* Content */}
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
              {t.tryAgain}
            </button>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">{t.noStories}</p>
            {viewMode === "list" && (
              <button
                onClick={() => setFilters({})}
                className="text-[#FF5722] font-semibold hover:underline"
              >
                {t.clearFilters}
              </button>
            )}
          </div>
        ) : viewMode === "mindmap" ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {t.exploreByCountry}
            </h3>
            <StoryMindMap stories={stories} onStorySelect={setSelectedStory} />
          </div>
        ) : (
          <>
            {!featuredLoading && featured.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-yellow-500 text-xl" />
                  <h3 className="text-xl font-bold text-gray-900">{t.featured}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featured.slice(0, 3).map((story) => (
                    <button
                      key={story.id}
                      onClick={() => setSelectedStory(story)}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-left"
                    >
                      <h4 className="font-bold text-gray-900 mb-1">{story.title}</h4>
                      <p className="text-sm text-gray-600">{story.city}, {story.country}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-left"
                >
                  <h4 className="font-bold text-gray-900 mb-1">{story.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {story.city}, {story.country}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">{story.summary}</p>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Story Modal */}
        {selectedStory && (
          <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        )}
      </div>
    </div>
  );
}

