"use client";
import { useProfileData } from "@/hooks/apiHooks";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

export default function ProfilePage() {
  const { profileData: profile, loading, error } = useProfileData();
  const { logout } = useAuth();

  // handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    logout();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const buttonClassName =
    "w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] flex justify-between items-center text-[var(--typography)] transition-colors hover:text-white";

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan profiilia...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-4 py-2 bg-[var(--va-mint-50)] text-[var(--typography)] rounded-md hover:bg-[var(--va-mint)] hover:scale-105 cursor-pointer"
        >
          Yritä uudelleen
        </button>
      </div>
    );
  }

  // Handle no data state
  if (!profile) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Profiilia ei löytynyt</p>
      </div>
    );
  }

  // Render profile data
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <h1
        className="md:text-2xl text-xl text-center mb-4"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        Hey {profile.userName}!
      </h1>

      {/* Optional: Display exchange badge if user has it */}
      {profile.exchangeBadge && (
        <span className="mt-2 px-3 py-1 bg-[var(--va-orange-50)] text-white rounded-full text-sm">
          Exchange Student
        </span>
      )}

      <p className="m-2 text-[var(--typography)] text-center text-md max-w-150">
        Welcome to your profile, here you can browse your saved exchange
        destinations and documents.
      </p>

      <div className="mt-6 space-y-4 w-full max-w-xs ">
        <button className={buttonClassName}>
          <span> Favorite destinations ({profile.favorites?.length || 0})</span>
          <span>›</span>
        </button>
        <button className={buttonClassName}>
          <span> Documents ({profile.documents?.length || 0})</span>
          <span>›</span>
        </button>

        

        {/* Optional: LinkedIn link if available */}
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange] hover:text-white flex justify-between items-center text-[var(--typography)] transition-colors"
          >
            <span> LinkedIn Profile</span>
            <span>↗</span>
          </a>
        )}
      </div>

      {/* Optional: Display additional info */}
      <div className="mt-8 text-sm text-[var(--typography)]">
        <p>
          Member since:{" "}
          {new Date(profile.registeredAt).toLocaleDateString("fi-FI")}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="md:hidden px-6 py-2 mx-6 block m-12 md:text-md text-sm uppercase duration-200 tracking-wider bg-[var(--va-orange)] hover:scale-105 rounded-lg "
        style={{
          fontFamily: "var(--font-machina-bold)",
          color: "var(--background)",
        }}
      >
        Kirjaudu ulos
      </button>
    </div>
  );
}