"use client";
import React, { useState } from "react";
import ContactForm from "@/components/contact-form/ContactForm";
import ContactSuccess from "@/components/contact-form/ContactSuccess";
import { useLanguage } from "@/context/LanguageContext";

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    en: {
      infoText: "Do you have questions about exchange studies or using the site? Fill out the form below and we will get back to you as soon as possible.",
    },
    fi: {
      infoText: "Onko sinulla kysyttävää vaihto-opiskelusta tai sivuston käytöstä? Täytä lomake alla, niin palaamme sinulle mahdollisimman pian.",
    },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-4 text-[var(--typography)]">
      <p className="text-center text-lg mb-8 text-[var(--typography)]">
        {translations[language]?.infoText ||
          "Onko sinulla kysyttävää vaihto-opiskelusta tai sivuston käytöstä? Täytä lomake alla, niin palaamme sinulle mahdollisimman pian."}
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
