"use client";
import { useProfileData } from "@/hooks/apiHooks";
import React from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { profileData: profile, loading, error } = useProfileData();

  const buttonClassName =
    "w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] flex justify-between items-center text-[var(--typography)] transition-colors";

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
      <h1 className="text-xl font-bold">
        Hey {profile.userName}, welcome to your profile!
      </h1>
      
      {profile.avatarUrl && (
        <Image
          src={profile.avatarUrl}
          alt={`${profile.userName}'s avatar`}
          width={80}
          height={80}
          className="w-20 h-20 rounded-full mt-4"
        />
      )}
      {/* Optional: Display exchange badge if user has it */}
      {profile.exchangeBadge && (
        <span className="mt-2 px-3 py-1 bg-[var(--va-orange-50)] text-white rounded-full text-sm">
          Exchange Student
        </span>
      )}

      <p className="mt-2 text-[var(--typography)] text-center">
        Welcome to your profile, here you can browse your saved exchange
        destinations and documents.
      </p>

      <div className="mt-6 space-y-4 w-full max-w-xs">
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
            className="w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange] flex justify-between items-center text-[var(--typography)] transition-colors"
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
    </div>
  );
}
