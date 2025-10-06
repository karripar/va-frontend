import React, { useState } from "react";

interface ContactFormProps {
  onSubmit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to API or backend route
    onSubmit();
    setFormData({ name: "", email: "", topic: "", message: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-[var(--va-border)]"
    >
      <div>
        <label htmlFor="name" className="block font-semibold mb-1">
          Nimi
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-[var(--va-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold mb-1">
          Sähköposti
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-[var(--va-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        />
      </div>

      <div>
        <label htmlFor="topic" className="block font-semibold mb-1">
          Aihe
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
          Viesti
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

      <button
        type="submit"
        className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition"
      >
        Lähetä viesti
      </button>
    </form>
  );
};

export default ContactForm;
