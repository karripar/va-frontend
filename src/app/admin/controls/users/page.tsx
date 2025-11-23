"use client";

import React, { useEffect, useState } from "react";
import useAdminActions from "@/hooks/adminHooks";
import Image from "next/image";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import SearchUsers from "@/components/admin/SearchUsers";

const Page = () => {
  const { getBlockedUsers } = useAdminActions();
  const [blockedUsers, setBlockedUsers] = useState<ProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const data = await getBlockedUsers(); // { blockedUsers: [...] }
        console.log("Blocked users:", data);
        setBlockedUsers(data?.blockedUsers || []); // <-- extract the array
      } catch (err) {
        setError("Error fetching blocked users.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocked();
  }, []);

  const t: Record<string, Record<string, string>> = {
    en: {
      backToHome: "Back to Admin Home",
      userManagement: "User Management",
      block: "Block",
      unblock: "Unblock",
      blockedUsers: "Blocked Users",
      noBlockedUsers: "No blocked users.",
    },
    fi: {
      backToHome: "Takaisin ylläpitäjän etusivulle",
      userManagement: "Käyttäjien hallinta",
      block: "Estä",
      unblock: "Poista esto",
      blockedUsers: "Estetyt käyttäjät",
      noBlockedUsers: "Ei estettyjä käyttäjiä.",
    },
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[var(--va-orange)] text-white px-4 py-6 flex items-center justify-center relative">
        <Link
          href="/admin"
          className="absolute left-4 sm:left-6 text-white hover:scale-110"
          aria-label={t[language]?.backToHome || "Back to Admin Home"}
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-lg"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t[language]?.userManagement || "User Management"}
        </h1>
      </div>
      <div className="p-6 max-w-3xl mx-auto space-y-12">
        <SearchUsers
          title={t[language]?.userManagement || "User Management"}
          noUsersText="No users found."
          adminActions={true}
        />

        <h1 className="text-xl font-semibold mb-4">
            {t[language]?.blockedUsers || "Blocked Users"}
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && blockedUsers.length === 0 && (
          <p className="text-gray-600">
            {t[language]?.noBlockedUsers || "No blocked users."}
          </p>
        )}

        {!loading && blockedUsers.length > 0 && (
          <ul className="border rounded divide-y">
            {blockedUsers.map((user) => (
              <li key={user._id} className="p-3 flex items-center gap-4">
                <Image
                  src={user.avatarUrl || "/images/default-avatar.png"}
                  alt={user.userName || user.email}
                  width={40}
                  height={40}
                  className="rounded-full"
                />

                <div>
                  <p className="font-medium">{user.userName || "No name"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Page;
