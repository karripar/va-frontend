import React from "react";

interface ContactFormProps {
  newContact: { name: string; title: string; email: string };
  setNewContact: React.Dispatch<
    React.SetStateAction<{ name: string; title: string; email: string }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  t: Record<string, string>;
}

const ContactForm: React.FC<ContactFormProps> = ({
  newContact,
  setNewContact,
  onSubmit,
  loading,
  t,
}) => (
  <form onSubmit={onSubmit} className="border border-gray-300 rounded-xl p-4 flex flex-col gap-3">
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
);

export default ContactForm;
