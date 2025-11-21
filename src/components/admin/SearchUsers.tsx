"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import useSearchActions from "@/hooks/searchHooks";

interface Props {
  title: string;
  noUsersText: string;
}

export default function SearchUsers({ title, noUsersText }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProfileResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { searchUsersByEmail, usersLoading } = useSearchActions();

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
        placeholder="Search by email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {usersLoading && <p>Loading...</p>}

      {results.length > 0 && (
        <ul className="mt-2 border rounded divide-y">
          {results.map((user) => (
            <li key={user._id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={user.avatarUrl || "/images/default-avatar.png"}
                  alt={user.userName || user.email}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{user.userName || user.email}</span>
                  <span className="text-sm break-all text-gray-600">{user.email}</span>
                </div>
              </div>

            </li>
          ))}
        </ul>
      )}

      {query && results.length === 0 && !usersLoading && (
        <p className="text-sm text-gray-600 mt-1">{noUsersText}</p>
      )}
    </div>
  );
}
