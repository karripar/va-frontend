"use client";

import { useState } from "react";

export interface Admin {
  _id: string;
  email: string;
  user_level_id: number;
  userName?: string;
  title?: string;
  avatarUrl?: string;
  showActions?: boolean;
}

interface AddAdminFormProps {
  promoteToAdmin: (email: string) => Promise<{ message?: string; error?: string } | undefined>;
  getAdmins: () => Promise<{ admins: Admin[] } | undefined>;
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
  loading: boolean;
  t: {
    enterEmail: string;
    confirmEmail: string;
    adding: string;
    addAsAdmin: string;
    emptyFields: string;
    emailMismatch: string;
    success: string;
    fail: string;
  };
}

const AddAdminForm = ({
  promoteToAdmin,
  getAdmins,
  setAdmins,
  loading,
  t,
}: AddAdminFormProps) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddAdmin = async () => {
    setMessage(null);
    setError(null);

    if (!email || !confirmEmail) {
      setError(t.emptyFields);
      return;
    }

    if (email !== confirmEmail) {
      setError(t.emailMismatch);
      return;
    }

    try {
      const result = await promoteToAdmin(email);

      if (result?.message) {
        setMessage(t.success);
        setEmail("");
        setConfirmEmail("");

        const updated = await getAdmins();
        if (updated && Array.isArray(updated.admins)) {
          setAdmins(updated.admins); // ✔ fully typed now
        }
      } else {
        setError(result?.error || t.fail);
      }
    } catch {
      setError(t.fail);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.enterEmail}
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.target.value)}
        placeholder={t.confirmEmail}
        className="border p-2 rounded w-full"
      />

      <button
        disabled={loading}
        onClick={handleAddAdmin}
        className="bg-[var(--va-orange)] text-white px-4 py-2 rounded w-full hover:opacity-90"
      >
        {loading ? t.adding : t.addAsAdmin}
      </button>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default AddAdminForm;
