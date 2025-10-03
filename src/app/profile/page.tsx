"use client";
import { useEffect, useState } from "react";
import React from  'react'
import { ProfileResponse } from "va-hybrid-types/contentTypes";


export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    // Testissä haetaan käyttäjä id:
    fetch("/api/profile/1")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return <p>Ladataan profiilia...</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold">Hei {profile.userName}!</h1>
      <p className="mt-2 text-gray-600 text-center">
        Welcome to your profile, here you can browse your saved exchange destinations and documents.
      </p>

      <div className="mt-6 space-y-4 w-full max-w-xs">
        <button className="w-full p-4 rounded-lg bg-orange-300 flex justify-between items-center">
          <span> Favorite destinations</span>
          <span>›</span>
        </button>
        <button className="w-full p-4 rounded-lg bg-orange-300 flex justify-between items-center">
          <span> Documents</span>
          <span>›</span>
        </button>
      </div>
    </div>
  );
}