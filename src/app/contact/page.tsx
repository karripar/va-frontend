"use client";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminContacts } from "@/hooks/contactHooks";
import { ADMIN_LEVEL_ID } from "@/config/roles";

const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { getContacts, addContact, deleteContact, loading, error } = useAdminContacts();

  const [contacts, setContacts] = useState<
    { _id: string; name: string; title: string; email: string }[]
  >([]);
  const [newContact, setNewContact] = useState({ name: "", title: "", email: "" });

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: "Admin Contact Information",
      addTitle: "Add New Contact",
      name: "Name",
      titleLabel: "Title / Role",
      email: "Email",
      add: "Add",
      remove: "Remove",
      confirmRemove: "Are you sure you want to delete this contact?",
      loading: "Loading...",
      error: "Failed to fetch contacts",
    },
    fi: {
      title: "Ylläpitäjien yhteystiedot",
      addTitle: "Lisää uusi yhteystieto",
      name: "Nimi",
      titleLabel: "Titteli / Rooli",
      email: "Sähköposti",
      add: "Lisää",
      remove: "Poista",
      confirmRemove: "Haluatko varmasti poistaa tämän yhteystiedon?",
      loading: "Ladataan...",
      error: "Tietojen haku epäonnistui",
    },
  };

  const t = translations[language] || translations.fi;
  const isAdmin =
    isAuthenticated && !authLoading && user?.user_level_id === ADMIN_LEVEL_ID;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await getContacts();
        if (res && "contacts" in res) setContacts(res.contacts);
      } catch (err) {
        console.error("Error loading contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.title.trim() || !newContact.email.trim()) return;

    try {
      const res = await addContact(newContact);
      if (res?.contact) {
        setContacts((prev) => [...prev, res.contact]);
        setNewContact({ name: "", title: "", email: "" });
      }
    } catch (err) {
      console.error("Error adding contact:", err);
    }
  };

  const handleRemoveContact = async (id: string) => {
    const confirm = window.confirm(t.confirmRemove);
    if (!confirm) return;

    try {
      const res = await deleteContact(id);
      if (res?.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== id));
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-6 text-[var(--typography)]">
      <h2 className="text-2xl font-semibold text-center mb-6">{t.title}</h2>

      {loading && <p className="text-center text-gray-500">{t.loading}</p>}
      {error && <p className="text-center text-red-500">{t.error}</p>}

      <ul className="space-y-4 mb-8">
        {contacts.map((contact) => (
          <li
            key={contact._id}
            className="flex justify-between items-center border border-gray-300 rounded-xl p-4"
          >
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm italic text-gray-500">{contact.title}</p>
              <p className="text-sm text-gray-600">{contact.email}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleRemoveContact(contact._id)}
                className="text-red-600 hover:underline"
              >
                {t.remove}
              </button>
            )}
          </li>
        ))}
      </ul>

      {isAdmin && (
        <form
          onSubmit={handleAddContact}
          className="border border-gray-300 rounded-xl p-4 flex flex-col gap-3"
        >
          <h3 className="text-lg font-semibold">{t.addTitle}</h3>
          <input
            type="text"
            placeholder={t.name}
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            placeholder={t.titleLabel}
            value={newContact.title}
            onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="email"
            placeholder={t.email}
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF5000] text-white rounded-lg py-2 hover:bg-[var(--sushi-red3)] transition-colors"
          >
            {loading ? t.loading : t.add}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
