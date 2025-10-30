"use client";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: profile, loading, handleLogout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  // handle logout
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false);
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

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
        <button
          onClick={handleLogoutClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Kirjaudu uudelleen
        </button>
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
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1
          className="text-2xl tracking-wide pt-1"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          Profiili
        </h1>
        <Link
          href="/profile/edit"
          className="absolute right-16 text-white hover:scale-110"
        >
          <FiEdit size={24} />
        </Link>
        <button
          onClick={handleLogoutClick}
          className=" hover:scale-110 absolute right-6 text-white"
        >
          <FiLogOut size={24} />
        </button>
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
              vaihtokohteitä sekä dokumentteja.
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
                  Suosikki kohteet ({profile.favorites?.length || 0})
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
                  Dokumentit ({profile.documents?.length || 0})
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (

        <div className="fixed inset-0 flex items-center justify-center z-50 text-center bg-[var(--va-grey)]/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 border border-[var(--va-border)] shadow-lg">
            <h3 className="text-lg font-semibold text-[var(--typography)] mb-4">
              Vahvista uloskirjautuminen
            </h3>
            <p className="text-[var(--typography)] mb-6">
              Oletko varma, että haluat kirjautua ulos?
            </p>
            <div className="flex gap-4 mt-8 mb-2 justify-center">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-[var(--background)] bg-[var(--va-dark-grey)] rounded-md hover:scale-110"
              >
                Peruuta
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[var(--va-orange)] text-white rounded-md hover:scale-110"
              >
                Kirjaudu ulos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
