"use client";
import React, { useState } from "react";
import ContactForm from "@/components/contact-form/ContactForm";
import ContactSuccess from "@/components/contact-form/ContactSuccess";

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto mt-4 text-[var(--typography)]">
      <h1 className="text-2xl font-bold mb-6 text-[#FF5000] text-center">
        Ota yhteyttä
      </h1>
      <p className="text-center text-lg mb-8 text-[var(--typography)]">
        Onko sinulla kysyttävää vaihto-opiskelusta tai sivuston käytöstä? Täytä
        lomake alla, niin palaamme sinulle mahdollisimman pian.
      </p>

      {!submitted ? (
        <ContactForm onSubmit={() => setSubmitted(true)} />
      ) : (
        <ContactSuccess />
      )}
    </div>
  );
};

export default ContactPage;
