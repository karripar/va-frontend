"use client";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import LogoutButton from "@/components/ui/LogoutButton";
import { FaArrowLeft } from "react-icons/fa6";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/profile";

export default function ProfilePage() {
  const { user: profile, loading } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  // Handling loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>{t.loading}</p>
      </div>
    );
  }

  // Handling no data state
  if (!profile) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>{t.notFound}</p>
        <Link
          href="/login"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {t.loginAgain}
        </Link>
      </div>
    );
  }

  // Rendering profile data
  return (
    <div className="min-h-screen relative">
      {/* Orange Header with Title, Back Arrow and Edit Icon, Logout */}
      <div className="bg-[#FF5722] text-white px-8 py-6 flex items-center justify-center relative">
        {/* Language Toggle at top right, above icons */}
        <div className="absolute right-16 top-2">
          <LanguageToggle />
        </div>
        <Link
          href="/"
          className="absolute left-6 text-white hover:scale-110"
          aria-label={t.backToHome}
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-xl"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t.title}
        </h1>
        <Link
          href="/profile/edit"
          className="absolute right-16 text-white hover:scale-110"
        >
          <FiEdit size={15} />
        </Link>
        <LogoutButton className="absolute right-6 text-white hover:scale-110 !text-base" />
      </div>

      {/* Profile Content - White background */}
      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            {/* Avatar */}
            {profile.avatarUrl && (
              <Image
                src={profile.avatarUrl || "/images/default-avatar.png"}
                alt={`${profile.userName}'s avatar`}
                width={48}
                height={48}
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
              {t.welcome}
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
                  {t.favorites} ({profile.favorites?.length || 0})
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
                  {t.documents} ({profile.documents?.length || 0})
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
                  {t.applications} (
                  {profile.applications
                    ? Object.keys(profile.applications).length
                    : 0}
                  )
                </span>
                <span>›</span>
              </div>
            </Link>
          </div>

          {/* Member since */}
          <div className="mt-8 text-center text-sm text-[var(--typography)]">
            <p>
              {t.memberSince}{" "}
              {profile.registeredAt
                ? new Date(profile.registeredAt).toLocaleDateString(language === "en" ? "en-US" : "fi-FI")
                : t.notAvailable}
            </p>
          </div>
        </div>
      </div>

      {/* Modal moved to LogoutButton component */}
    </div>
  );
}
