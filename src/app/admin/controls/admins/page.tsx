"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useAdminActions from "@/hooks/adminHooks";
import Link from "next/link";

interface Admin {
  _id: string;
  userName?: string;
  title?: string;
  email: string;
}

interface GetAdminsResponse {
  admins: Admin[];
}

const AdminBoard = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const { promoteToAdmin, getAdmins, loading } = useAdminActions();
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    en: {
      addAdmin: "Admin Management",
      notice:
        "Adding a new admin will grant them administrative privileges. They may alter content and add other admins. Double-check the email before proceeding.",
      enterEmail: "Enter user email",
      confirmEmail: "Confirm user email",
      enterTitle: "Enter user title",
      addAsAdmin: "Add as Admin",
      adding: "Adding...",
      currentAdmins: "Current Admins",
      noAdmins: "No admins found.",
      emptyFields: "Please fill in both fields.",
      emailMismatch: "Emails do not match.",
      success: "User promoted to admin successfully!",
      fail: "Failed to promote user. Check the email. You may not promote an existing admin or yourself.",
    },
    fi: {
      addAdmin: "Ylläpitäjien hallinta",
      notice:
        "Uuden ylläpitäjän lisääminen antaa heille hallinnolliset oikeudet. He voivat muokata sisältöä ja lisätä muita ylläpitäjiä. Tarkista sähköposti huolellisesti ennen jatkamista.",
      enterEmail: "Syötä käyttäjän sähköposti",
      confirmEmail: "Vahvista käyttäjän sähköposti",
      enterTitle: "Syötä yhteyshenkilön titteli",
      addAsAdmin: "Lisää ylläpitäjäksi",
      adding: "Lisätään...",
      currentAdmins: "Nykyiset ylläpitäjät",
      noAdmins: "Ei ylläpitäjiä.",
      emptyFields: "Täytä molemmat kentät.",
      emailMismatch: "Sähköpostit eivät täsmää.",
      success: "Käyttäjä lisättiin ylläpitäjäksi onnistuneesti!",
      fail: "Käyttäjän lisääminen epäonnistui. Tarkista sähköposti. Et voi lisätä ylläpitäjäksi jo olemassa olevaa ylläpitäjää tai itseäsi.",
    },
  };

  const t = translations[language];

  // Load admins on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = (await getAdmins()) as GetAdminsResponse | undefined;
        if (response && Array.isArray(response.admins)) {
          setAdmins(response.admins);
        } else {
          console.warn("Unexpected admin response format:", response);
          setAdmins([]);
        }
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError(t.fail);
      }
    };

    fetchAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email.trim() || !confirmEmail.trim()) {
      setError(t.emptyFields);
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError(t.emailMismatch);
      return;
    }

    const confirmAdd = window.confirm(
      `Are you sure you want to promote ${email.trim()} to admin?`
    );
    if (!confirmAdd) return;

    try {
      const response = await promoteToAdmin(email.trim());
      if (response?.message) {
        setMessage(t.success);
        setEmail("");
        setConfirmEmail("");

        // Refresh admin list
        const updated = (await getAdmins()) as GetAdminsResponse | undefined;
        if (updated && Array.isArray(updated.admins)) {
          setAdmins(updated.admins);
        }
      } else {
        setError(response?.error || t.fail);
      }
    } catch {
      setError(t.fail);
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
          className="tracking-widest sm:text-2xl text-lg"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t.addAdmin}
        </h1>
      </div>

      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg space-y-6 my-4">
        <p className="text-md text-[var(--typography)]">{t.notice}</p>

        {/* Add new admin form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder={t.enterEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder={t.confirmEmail}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF5000] text-white py-2 rounded disabled:bg-[var(--va-grey-50)] hover:disabled:cursor-not-allowed hover:bg-[#e04e00] transition"
          >
            {loading ? t.adding : t.addAsAdmin}
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-sm font-medium">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        {/* Admin list */}
        <div>
          <h3 className="text-lg font-semibold mt-6">{t.currentAdmins}</h3>
          {admins.length > 0 ? (
            <ul className="mt-2 border rounded divide-y">
              {admins.map((admin) => (
                <li key={admin._id} className="p-2 flex justify-between">
                  <span>{admin.userName || admin.email}</span>
                  <span className="text-[var(--typography)] text-sm">
                    {admin.email}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--typography)] mt-2">{t.noAdmins}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBoard;
