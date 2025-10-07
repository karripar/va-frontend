"use client";
import { useProfileData } from "@/hooks/apiHooks";
import Link from "next/link";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { profileData: profile, loading, error } = useProfileData();

  const buttonClassName =
    "w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] flex justify-between items-center text-[var(--typography)] transition-colors";

  // Handling loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan profiilia...</p>
      </div>
    );
  }

  // Handling error state
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

  // Handling no data state
  if (!profile) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Profiilia ei löytynyt</p>
      </div>
    );
  }

  // Rendering profile data
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <h1 className="text-xl font-bold">
        Hey {profile.userName}, welcome to your profile!
      </h1>
      
      {/* Avatar */}
      {profile.avatarUrl && (
        <Image
          src={profile.avatarUrl}
          alt={`${profile.userName}'s avatar`}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full mt-4"
        />
      )}
      
      {/* Displaying exchange badge if user has it */}
      {profile.exchangeBadge && (
        <span className="mt-2 px-3 py-1 bg-[var(--va-orange-50)] text-white rounded-full text-sm">
          Exchange Student
        </span>
      )}

      {/* Displaying additional info */}
      <div className="mt-8 text-sm text-[var(--typography)]">
        <p>
          Member since:{" "}
          {new Date(profile.registeredAt).toLocaleDateString("fi-FI")}
        </p>
      </div>
    </div>
  );
}
