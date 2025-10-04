"use client";
import { useProfileData } from "@/hooks/apiHooks"; // Adjust import path to match your project structure
import React from "react";
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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Hey {profile.userName}, welcome to your profile!</h1>
      
      {/* Optional: Display user's avatar if available */}
      {profile.avatarUrl && (
        <img 
          src={profile.avatarUrl} 
          alt={`${profile.userName}'s avatar`}
          className="w-20 h-20 rounded-full mt-4"
        />
      )}
      
      {/* Optional: Display exchange badge if user has it */}
      {profile.exchangeBadge && (
        <span className="mt-2 px-3 py-1 bg-[#5B9FED] text-white rounded-full text-sm">
           Exchange Student
        </span>
      )}
      
      <p className="mt-2 text-gray-600 text-center">
        Welcome to your profile, here you can browse your saved exchange destinations and documents.
      </p>

      <div className="mt-6 space-y-4 w-full max-w-xs">
        <button className={buttonClassName}>
          <span> Favorite destinations ({profile.favorites.length})</span>
          <span>›</span>
        </button>
        <button className={buttonClassName}>
          <span> Documents ({profile.documents.length})</span>
          <span>›</span>
        </button>
        
        {/* Optional: LinkedIn link if available */}
        {profile.linkedinUrl && (
          <a 
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] flex justify-between items-center text-gray-800 transition-colors"
          >
            <span> LinkedIn Profile</span>
            <span>↗</span>
          </a>
        )}
      </div>

      {/* Optional: Display additional info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>Member since: {new Date(profile.registeredAt).toLocaleDateString('fi-FI')}</p>
      </div>
    </div>
  );
}