"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import useSearchActions from "@/hooks/searchHooks";
import { useLanguage } from "@/context/LanguageContext";
import useAdminActions from "@/hooks/adminHooks";

interface Props {
  title: string;
  noUsersText: string;
  adminActions: boolean;
}

export default function SearchUsers({
  title,
  noUsersText,
  adminActions,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { searchUsersByEmail, usersLoading } = useSearchActions();
  const [blockedUsers, setBlockedUsers] = useState<ProfileResponse[]>([]);
  const { language } = useLanguage();
  const { toggleBlockUser, deleteUser } = useAdminActions();

  const t: Record<string, Record<string, string>> = {
    en: {
      noUsersFound: "No users found with that email.",
      searchByEmail: "Search by email...",
      block: "Block",
      unblock: "Unblock",
      toBlock: "block",
      toUnblock: "unblock",
      delete: "Delete User",
      confirmDelete: "To confirm deletion, please type the user's email:",
      emailMatch: "Email did not match. Deletion cancelled.",
      areYouSure: "Are you sure you want to",
    },
    fi: {
      noUsersFound: "Ei käyttäjiä löydetty kyseisellä sähköpostilla.",
      searchByEmail: "Etsi sähköpostilla...",
      block: "Estä",
      toBlock: "estää",
      toUnblock: "poistaa eston",
      unblock: "Poista esto",
      delete: "Poista käyttäjä",
      confirmDelete: "Vahvista poisto kirjoittamalla käyttäjän sähköposti:",
      emailMatch: "Sähköposti ei täsmää. Poisto peruutettu.",
      areYouSure: "Oletko varma, että haluat"
    },
  };

  const handleToggleBlock = async (
    userId: string,
    email: string,
    isCurrentlyBlocked: boolean
  ) => {
    if (
      !window.confirm(
        `${t[language]?.areYouSure || "Are you sure you want to"} ${isCurrentlyBlocked ? t[language]?.toUnblock || "unblock" : t[language]?.toBlock || "block"} ${email}?`
      )
    ) {
      return;
    }

    try {
      const response = await toggleBlockUser(userId);
      if (response?.message) {
        // Update local state immediately
        setBlockedUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: !isCurrentlyBlocked }
              : user
          )
        );

        // Also update SearchUsers results if needed
        setResults((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: !isCurrentlyBlocked }
              : user
          )
        );
      }
    } catch (err) {
      alert("Error toggling block status");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    // Ask admin to type the email to confirm
    const input = window.prompt(
      t[language]?.confirmDelete.replace("user's email", email) ||
        "To confirm deletion, please type the user's email:"
    );
  
    if (!input || input.trim() !== email) {
      window.alert(t[language]?.emailMatch || "Email did not match. Deletion cancelled.");
      return;
    }
  
    try {
      const response = await deleteUser(userId);
      if (response?.message) {
        window.alert(response.message);
        setError(null);
  
        // Optionally remove the user from results immediately
        setResults((prev) => prev.filter((user) => user._id !== userId));
      }
    } catch (err) {
      window.alert("Error deleting user.");
    }
  };
  

  // Debounce search
  const debounceSearch = (() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (!value.trim()) {
          setResults([]);
          return;
        }
        try {
          const res = await searchUsersByEmail(value.trim());
          console.log("Search results:", res);
          setResults(res || []);
        } catch {
          setError("Error searching users.");
          setResults([]);
        }
      }, 600);
    };
  })();

  useEffect(() => {
    debounceSearch(query);
  }, [query]);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">{title}</h3>

      <input
        type="text"
        placeholder={t[language]?.searchByEmail || "Search by email..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {usersLoading && <p>Loading...</p>}

      {results.length > 0 && (
        <div className="mt-2 border rounded overflow-y-auto max-h-[500px]">
          <ul className="divide-y">
            {results.map((user) => (
              <li
                key={user._id}
                className="p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatarUrl || "/images/default-avatar.png"}
                    alt={user.userName || user.email}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />

                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.userName || user.email}
                    </span>
                    <span className="text-sm break-all text-gray-600">
                      {user.email}
                    </span>
                  </div>
                </div>

                {adminActions && user.user_level_id !== 3 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleToggleBlock(
                          user._id,
                          user.email,
                          user.isBlocked ?? false
                        )
                      }
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-600"
                          : "bg-[var(--va-orange)]"
                      }`}
                    >
                      {user.isBlocked
                        ? t[language]?.unblock || "Unblock"
                        : t[language]?.block || "Block"}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user._id, user.email)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      {t[language]?.delete || "Delete User"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && results.length === 0 && !usersLoading && (
        <p className="text-sm text-gray-600 mt-1">{noUsersText}</p>
      )}
    </div>
  );
}
