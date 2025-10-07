"use client";
import { useProfileData } from "@/hooks/apiHooks";
import Link from "next/link";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { profileData: profile, loading, error } = useProfileData();
  
  const buttonClassName = "w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] flex justify-between items-center text-gray-800 transition-colors";

  // Handle loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4">
        <p>Ladataan profiilia...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center p-4">
        <p className="text-red-500">Virhe: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Yritä uudelleen
        </button>
      </div>
    );
  }

  // Handle no data state
  if (!profile) {
    return (
      <div className="flex flex-col items-center p-4">
        <p>Profiilia ei löytynyt</p>
      </div>
    );
  }

  // Render profile data
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header with Title (Centered) and Edit Icon */}
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <h1 className="text-2xl font-bold">Profiili</h1>
        <Link
          href="/profile/edit"
          className="absolute right-4 text-white hover:text-gray-200 transition-colors"
        >
          <FaEdit size={24} />
        </Link>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center p-6">
        {/* Avatar */}
        {profile.avatarUrl && (
          <Image 
            src={profile.avatarUrl} 
            alt={`${profile.userName}'s avatar`}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full mb-4"
          />
        )}

        {/* Exchange badge ---> Oikea käyttäjän nimi tulee myöhemmin autentikoinnin logikkojen tekemisen jälkeen */}
        {profile.exchangeBadge && (
          <span className="mb-4 px-4 py-2 bg-[#5B9FED] text-white rounded-full text-sm font-medium">
            Exchange Student
          </span>
        )}
        
        {/* Welcome text */}
        <p className="text-gray-700 text-center text-sm mb-8 max-w-md leading-relaxed">
          Tervetuloa profiiliisi, täällä voit selata tallentamiasi vaihtokohteitä sekä dokumentteja.
        </p>

        {/* Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Link href="/profile/favorites" className={buttonClassName}>
            <span>Suosikki kohteet ({profile.favorites?.length || 0})</span>
            <span>›</span>
          </Link>
          <Link href="/profile/documents" className={buttonClassName}>
            <span>Dokumentit ({profile.documents?.length || 0})</span>
            <span>›</span>
          </Link>
          
          {/* LinkedIn link */}
          {profile.linkedinUrl && (
            <a 
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName}
            >
              <span>LinkedIn Profile</span>
              <span>↗</span>
            </a>
          )}
        </div>

        {/* Member since */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Member since: {new Date(profile.registeredAt).toLocaleDateString('fi-FI')}</p>
        </div>
      </div>
    </div>
  );
}