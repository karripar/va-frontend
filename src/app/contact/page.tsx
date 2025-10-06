"use client";
import Image from "next/image";
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API call or email handler here
    setSubmitted(true);
    setFormData({ name: "", email: "", topic: "", message: "" });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-[#FF5000] text-center">
        Ota yhteyttä
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Onko sinulla kysyttävää vaihto-opiskelusta tai sivuston käytöstä? 
        Täytä lomake alla, niin palaamme asiaan mahdollisimman pian.
      </p>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 space-y-4 border border-gray-100"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
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
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition"
          >
            Lähetä viesti
          </button>
        </form>
      ) : (
        <div className="text-center bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-2 text-[#FF5000]">
            Kiitos yhteydenotostasi!
          </h2>
          <p>Vastaamme sinulle mahdollisimman pian.</p>
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png"
            alt="Thank You"
            width={939}
            height={814}
            className="mx-auto mt-4 max-h-30 w-auto"
          />
          <span className="text-sm text-gray-500 mt-4 block">
            Vastauksen saaminen ei ole taattua, mutta pyrimme vastaamaan
            kaikkiin viesteihin. Jos et saa vastausta, voit kokeilla ottaa
            yhteyttää puhelimitse tai sähköpostitse.
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
