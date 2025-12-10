"use client";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const {
    favorites,
    removeFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const [removing, setRemoving] = useState<string | null>(null);

  const isLoading = favoritesLoading;


  const handleRemoveFavorite = async (destination: string) => {
    setRemoving(destination);
    const success = await removeFavorite(destination);
    if (!success) {
      alert(t.errorRemoving);
    }
    setRemoving(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <ProfileHeader title={t.title} />
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="py-10 max-w-2xl mx-auto">
          {favorites.length === 0 ? (
            <div className="text-center pt-6">
              <div className="mb-6">
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "var(--font-montreal-mono)",
                    color: "var(--va-dark-grey)",
                  }}
                >
                  {t.noFavorites}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 px-4">
              {favorites.map((destination) => (
                <div
                  key={destination}
                  className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: "var(--va-card)",
                    border: "1px solid var(--va-border)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-medium"
                      style={{
                        color: "var(--typography)",
                        fontFamily: "var(--font-montreal-mono-medium)",
                      }}
                    >
                      {destination}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(destination)}
                    disabled={removing === destination}
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 focus-ring"
                    style={{
                      color: "var(--va-dark-grey)",
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => router.push("/destinations")}
            className="px-6 py-2 my-8 rounded-full text-md transition-all duration-200 hover:scale-105 focus-ring mx-auto block tracking-wider cursor-pointer"
            style={{
              backgroundColor: "var(--va-dark-grey)",
              color: "var(--background)",
              fontFamily: "var(--font-machina-bold)",
            }}
          >
            {t.browseMore}
          </button>
        </div>
      </div>
    </div>
  );
}
