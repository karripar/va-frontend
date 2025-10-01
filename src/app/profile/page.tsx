"use client";
import React from  'react'
import{useProfileData} from "@/hooks/apiHooks"


export default function ProfilePage() {
    const { profileData, loading, error } = useProfileData();
    const user = profileData?.user;
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-500">
                    Ladataan profiilitietoja...
                </div>;
    }
    if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">
      <p>Virhe: {error}</p>
        </div>;
    }
    if (!user) {
    return <div className="flex justify-center items-center h-screen text-gray-500">
      <p>Profiilia ei löytynyt.</p>
    </div>;
  }
    const userName = user?.name || "Käyttäjä";
    return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#FF5000] text-center">Hei {userName}!</h1>
      <p className="text-gray-600 text-center">
        Tervetuloa profiiliisi – täältä löydät tallentamasi vaihtokohteet ja dokumentit.
      </p>

      {/* Suosikit */}
      <section>
        <h2 className="text-lg font-semibold mb-2"> Suosikkikohteet</h2>
        {user.favorites && user.favorites.length > 0 ? (
          <ul className="list-disc list-inside">
            {user.favorites.map((fav: string, i: number) => (
              <li key={i}>{fav}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Ei suosikkeja vielä.</p>
        )}
      </section>

      {/* Dokumentit */}
      <section>
        <h2 className="text-lg font-semibold mb-2"> Dokumentit</h2>
        {user.documents && user.documents.length > 0 ? (
          <ul className="list-disc list-inside">
            {user.documents.map((doc: string, i: number) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Ei dokumentteja tallennettuna.</p>
        )}
      </section>
    </div>
  );
}