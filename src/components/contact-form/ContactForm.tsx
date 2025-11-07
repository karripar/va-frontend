"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useContactMessages } from "@/hooks/contactHooks";
import { useLanguage } from "@/context/LanguageContext";

interface ContactFormProps {
  onSubmit?: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const { postMessage, loading, error } = useContactMessages();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.userName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await postMessage({
        subject: formData.topic,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        name: user?.userName || "",
        email: user?.email || "",
        topic: "",
        message: "",
      });

      onSubmit?.();
    } catch (err) {
      console.error("Error sending contact message:", err);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      successMessage: "Message sent successfully!",
      name: "Name",
      email: "Email",
      topic: "Topic",
      message: "Message",
      sendMessage: "Send Message",
      sending: "Sending...",
    },
    fi: {
      successMessage: "Viesti lähetetty onnistuneesti!",
      name: "Nimi",
      email: "Sähköposti",
      topic: "Aihe",
      message: "Viesti",
      sendMessage: "Lähetä viesti",
      sending: "Lähetetään...",
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-[var(--va-border)]"
    >
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          {translations[language]?.name || "Name"}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={!!user}
          className="w-full p-3 border border-[var(--va-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-1">
          {translations[language]?.email || "Email"}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={!!user}
          className="w-full p-3 border border-[var(--va-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      <div>
        <label htmlFor="topic" className="block font-semibold mb-1">
          {translations[language]?.topic || "Topic"}
        </label>
        <input
          type="text"
          id="topic"
          name="topic"
          required
          value={formData.topic}
          onChange={handleChange}
          className="w-full p-3 border border-[var(--va-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block font-semibold mb-1">
          {translations[language]?.message || "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border border-[var(--va-border)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm font-medium">
          {translations[language]?.successMessage ||
            "Message sent successfully!"}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition disabled:opacity-50"
      >
        {loading
          ? translations[language]?.sending || "Sending..."
          : translations[language]?.sendMessage || "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
