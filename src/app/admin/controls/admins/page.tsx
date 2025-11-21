"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useAdminActions from "@/hooks/adminHooks";
import useSearchActions from "@/hooks/searchHooks";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import SearchUsers from "@/components/admin/SearchUsers";
import AdminList from "@/components/admin/AdminList";
import AddAdminForm from "@/components/admin/addAdminForm";

interface Admin {
  _id: string;
  userName?: string;
  user_level_id: number;
  title?: string;
  email: string;
  avatarUrl?: string;
  showActions?: boolean;
}

interface GetAdminsResponse {
  admins: Admin[];
}

const AdminBoard = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const { promoteToAdmin, getAdmins, demoteFromAdmin, elevateAdmin, loading } =
    useAdminActions();
  const { searchUsersByEmail, usersLoading } = useSearchActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileResponse[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations: Record<
    string,
    {
      currentAdmins: string;
      noAdmins: string;
      actions: string;
      elevate: string;
      demote: string;
      enterEmail: string;
      confirmEmail: string;
      adding: string;
      addAsAdmin: string;
      emptyFields: string;
      emailMismatch: string;
      success: string;
      fail: string;
      [key: string]: string;
    }
  > = {
    en: {
      addAdmin: "Admin Management",
      notice:
        "Adding a new admin will grant them administrative privileges. They may alter content and add other admins. Double-check the email before proceeding.",
      notice2:
        "Email needs to be in the shorter username format. Example: 'mattimei@metropolia.fi' (Matti Meikäläinen)",
      enterEmail: "Enter user email",
      confirmEmail: "Confirm user email",
      addAsAdmin: "Add as Admin",
      adding: "Adding...",
      currentAdmins: "Current Admins",
      noAdmins: "No admins found.",
      emptyFields: "Please fill in both fields.",
      emailMismatch: "Emails do not match.",
      success: "User promoted to admin successfully!",
      fail: "Failed to promote user. Check the email. You may not promote an existing admin or yourself.",
      demote: "Demote",
      actions: "Actions",
      elevate: "Elevate",
      confirmElevate:
        "Are you sure you want to elevate this admin's privileges? They will gain the highest privileges that cannot be undone.",
      confirmDemote:
        "Are you sure you want to demote this admin to a regular user?",
      backToHome: "Back to Admin Home",
      searchUsers: "Search Users",
      noUsers: "No users found.",
      addUserAsAdmin: "Add as Admin",
    },
    fi: {
      addAdmin: "Ylläpitäjien hallinta",
      notice:
        "Uuden ylläpitäjän lisääminen antaa heille hallinnolliset oikeudet. He voivat muokata sisältöä ja lisätä muita ylläpitäjiä. Tarkista sähköposti huolellisesti ennen jatkamista.",
      notice2:
        "Sähköpostin tulee olla lyhyemmässä käyttäjänimi-muodossa. Esim. 'mattimei@metropolia.fi' (Matti Meikäläinen)",
      enterEmail: "Syötä käyttäjän sähköposti",
      confirmEmail: "Vahvista käyttäjän sähköposti",
      addAsAdmin: "Lisää ylläpitäjäksi",
      adding: "Lisätään...",
      currentAdmins: "Nykyiset ylläpitäjät",
      noAdmins: "Ei ylläpitäjiä.",
      emptyFields: "Täytä molemmat kentät.",
      emailMismatch: "Sähköpostit eivät täsmää.",
      success: "Käyttäjä lisättiin ylläpitäjäksi onnistuneesti!",
      fail: "Käyttäjän lisääminen epäonnistui. Tarkista sähköposti. Et voi lisätä ylläpitäjäksi jo olemassa olevaa ylläpitäjää tai itseäsi.",
      demote: "Poista ylläpitäjän oikeudet",
      actions: "Toiminnot",
      elevate: "Korota oikeuksia",
      confirmElevate:
        "Haluatko varmasti korottaa tämän ylläpitäjän oikeuksia? He saavat korkeimmat oikeudet joita ei voi perua.",
      confirmDemote: "Haluatko varmasti poistaa tämän ylläpitäjän oikeudet?",
      backToHome: "Takaisin ylläpitäjien etusivulle",
      searchUsers: "Hae käyttäjiä",
      noUsers: "Käyttäjiä ei löytynyt.",
      addUserAsAdmin: "Lisää ylläpitäjäksi",
    },
  };

  const t: {
    currentAdmins: string;
    noAdmins: string;
    actions: string;
    elevate: string;
    demote: string;
    enterEmail: string;
    confirmEmail: string;
    adding: string;
    addAsAdmin: string;
    emptyFields: string;
    emailMismatch: string;
    success: string;
    fail: string;
    [key: string]: string;
  } = translations[language];

  // Load admins on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = (await getAdmins()) as GetAdminsResponse | undefined;
        if (response && Array.isArray(response.admins)) {
          setAdmins(response.admins);
        } else {
          setAdmins([]);
        }
      } catch (err) {
        setError(t.fail);
      }
    };
    fetchAdmins();
  }, []);

  // Debounced search
  const searchWithDebounce = (() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (query.trim()) {
          try {
            console.log("Searching for users with query:", query);
            const results = await searchUsersByEmail(query.trim());
            setSearchResults(results || []);
          } catch (err) {
            setSearchError("Error searching users.");
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      }, 1000);
    };
  })();

  useEffect(() => {
    searchWithDebounce(searchQuery);
  }, [searchQuery]);

  const handleDemote = async (adminId: string) => {
    const confirmDemote = window.confirm(t.confirmDemote);
    if (!confirmDemote) return;
    try {
      const response = await demoteFromAdmin(adminId);
      if (response?.message) {
        setMessage("Admin demoted successfully.");
        const updated = (await getAdmins()) as GetAdminsResponse | undefined;
        if (updated && Array.isArray(updated.admins)) {
          setAdmins(updated.admins);
        }
      } else {
        setError(response?.error || "Failed to demote admin.");
      }
    } catch {
      setError("Failed to demote admin.");
    }
  };

  const handleElevate = async (adminId: string) => {
    const confirmElevate = window.confirm(t.confirmElevate);
    if (!confirmElevate) return;
    try {
      const response = await elevateAdmin(adminId);
      if (response?.message) {
        setMessage("Admin privileges elevated successfully.");
        const updated = (await getAdmins()) as GetAdminsResponse | undefined;
        if (updated && Array.isArray(updated.admins)) {
          setAdmins(updated.admins);
        }
      } else {
        setError(response?.error || "Failed to elevate admin.");
      }
    } catch {
      setError("Failed to elevate admin.");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[var(--va-orange)] text-white px-4 py-6 flex items-center justify-center relative">
        <Link
          href="/admin"
          className="absolute left-4 sm:left-6 text-white hover:scale-110"
          aria-label={t.backToHome}
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-lg"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t.addAdmin}
        </h1>
      </div>

      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-6 my-4">
        <p className="text-md text-[var(--typography)]">{t.notice}</p>
        <p className="text-md text-[var(--typography)]">{t.notice2}</p>

        {/* Manual Add Admin */}
        <AddAdminForm
          promoteToAdmin={promoteToAdmin}
          getAdmins={getAdmins}
          setAdmins={setAdmins}
          loading={loading}
          t={t}
        />

        <SearchUsers title={t.searchUsers} noUsersText={t.noUsers} />

        {/* Admin list */}
        <AdminList
          admins={admins}
          setAdmins={setAdmins}
          onDemote={handleDemote}
          onElevate={handleElevate}
          loading={loading}
          t={t}
        />
      </div>
    </>
  );
};

export default AdminBoard;
