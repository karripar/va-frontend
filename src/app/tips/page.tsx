"use client";
import { useState } from "react";
import { useExchangeStories, ExchangeStory } from "@/hooks/exchangeStoriesHooks";
import StoryMindMap from "@/components/exchange-stories/StoryMindMap";
import StoryModal from "@/components/exchange-stories/StoryModal";
import StoryAdminPanel from "@/components/exchange-stories/StoryAdminPanel";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID, ELEVATED_LEVEL_ID} from "@/config/roles";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/tips";

export default function TipsPage() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedStory, setSelectedStory] = useState<ExchangeStory | null>(null);
  const [activeTab, setActiveTab] = useState<"stories" | "management">("stories");
  const { stories, loading, error } = useExchangeStories();

  const adminLevels = [ADMIN_LEVEL_ID, ELEVATED_LEVEL_ID];
  const isAdmin = isAuthenticated && user?.user_level_id && adminLevels.includes(user.user_level_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
          <p className="text-base text-white/90">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Tabs */}
        {isAdmin && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === "stories"
                      ? "border-[#FF5722] text-[#FF5722]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.storiesTab}
                </button>
                <button
                  onClick={() => setActiveTab("management")}
                  className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                    activeTab === "management"
                      ? "border-[#FF5722] text-[#FF5722]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t.managementTab}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {isAdmin && activeTab === "management" ? (
          <StoryAdminPanel />
        ) : (
          /* Stories Tab (default for all users) */
          <>
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
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#FF5722] to-[#FF7043] rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  {t.exploreByCountry}
                </h3>
                <StoryMindMap stories={stories} onStorySelect={setSelectedStory} />
              </div>
            )}

            {/* Story Modal */}
            {selectedStory && (
              <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

