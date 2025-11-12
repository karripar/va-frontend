"use client";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import LogoutButton from "@/components/ui/LogoutButton";

export default function ProfilePage() {
  const { user: profile, loading } = useAuth();

  // Handling loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan profiilia...</p>
      </div>
    );
  }

  // Handling no data state
  if (!profile) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Profiilia ei löytynyt</p>
        <Link
          href="/login"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Kirjaudu uudelleen
        </Link>
      </div>
    );
  }

  // Rendering profile data
  return (
    <div className="min-h-screen">
      {/* Orange Header with Title, Back Arrow and Edit Icon, Logout */}
      <div className="bg-[#FF5722] text-white px-8 py-6 flex items-center justify-center relative">
        <Link
          href="/"
          className="absolute left-6 text-white hover:scale-110"
          aria-label="Takaisin etusivulle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-xl"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          Profiili
        </h1>
        <Link
          href="/profile/edit"
          className="absolute right-16 text-white hover:scale-110"
        >
          <FiEdit size={22} />
        </Link>
        <LogoutButton className="absolute right-6 text-white hover:scale-110" />
      </div>

      {/* Profile Content - White background */}
      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
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

            {/* Exchange badge */}
            {profile.exchangeBadge && (
              <span className="mb-4 px-4 py-2 bg-[#5B9FED] text-white rounded-full text-sm font-medium">
                Exchange Student
              </span>
            )}

            {/* Welcome text */}
            <p className="text-gray-800 text-center text-base mb-2 font-normal mt-4">
              Tervetuloa profiiliisi, täällä voit selata tallentamiasi
              vaihtokohteitä ja seurata hakemustesi etenemistä vaiheittain.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3">
            <Link
              href="/profile/favorites"
              className="block w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] transition-colors"
            >
              <div className="flex justify-between items-center text-[var(--typography)]">
                <span className="font-medium">
                  Suosikkikohteet ({profile.favorites?.length || 0})
                </span>
                <span>›</span>
              </div>
            </Link>

            <Link
              href="/profile/documents"
              className="block w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] transition-colors"
            >
              <div className="flex justify-between items-center text-[var(--typography)]">
                <span className="font-medium">
                  Omat dokumentit ({profile.documents?.length || 0})
                </span>
                <span>›</span>
              </div>
            </Link>

            <Link
            href="/profile/hakemukset"
            className="block w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] transition-colors"
            >
              <div className="flex justify-between items-center text-gray-800">
                <span className="font-medium">
                  Hakemukset ({profile.applications ? Object.keys(profile.applications).length : 0})
                </span>
                <span>›</span>
              </div>
            </Link>
            {/* LinkedIn link */}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-4 rounded-lg bg-[#FFB299] hover:bg-[#FFA07A] transition-colors"
              >
                <div className="flex justify-between items-center text-[var(--typography)]">
                  <span className="font-medium">LinkedIn Profile</span>
                  <span>↗</span>
                </div>
              </a>
            )}
          </div>

          {/* Member since */}
          <div className="mt-8 text-center text-sm text-[var(--typography)]">
            <p>
              Member since:{" "}
              {new Date(profile.registeredAt).toLocaleDateString("fi-FI")}
            </p>
          </div>
        </div>
      </div>

      {/* Modal moved to LogoutButton component */}
    </div>
  );
}
