"use client";
import { useProfileData } from "@/hooks/profileHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

export default function FavoritesPage() {
  const { profileData: profile, loading } = useProfileData();
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);

  useState(() => {
    if (profile?.favorites) {
      setFavorites(profile.favorites);
    }
  });

  const handleRemoveFavorite = async (destination: string) => {
    setRemoving(destination);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API}/profile/favorites`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination }),
        }
      );

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav !== destination));
      } else {
        alert("Virhe poistossa");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Virhe poistossa");
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Ladataan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-white hover:text-gray-200"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Suosikki kohteet</h1>
      </div>

      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--typography)] mb-4 text-base">
                Ei suosikkeja vielä
              </p>
              <button
                onClick={() => router.push("/destinations")}
                className="px-6 py-2 bg-[#FFB299] hover:bg-[#FFA07A] text-[var(--typography)] rounded-lg font-medium"
              >
                Selaa kohteita
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((destination) => (
                <div
                  key={destination}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-[var(--typography)]">
                    {destination}
                  </span>
                  <button
                    onClick={() => handleRemoveFavorite(destination)}
                    disabled={removing === destination}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
