"use client";
import React, { useState } from "react";
import ContactForm from "@/components/contact-form/ContactForm";
import ContactSuccess from "@/components/contact-form/ContactSuccess";

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-[#FF5000] text-center">
        Ota yhteyttä
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Onko sinulla kysyttävää vaihto-opiskelusta tai sivuston käytöstä?
        Täytä lomake alla, niin palaamme sinulle mahdollisimman pian.
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
