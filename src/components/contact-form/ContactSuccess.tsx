import Image from "next/image";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const ContactSuccess: React.FC = () => {
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    en: {
      thankYou: "Thank you for contacting us!",
      responseInfo: "We will get back to you as soon as possible.",
      additionalInfo:
        "Receiving a response is not guaranteed, but we strive to reply to all messages. If you do not receive a response, you may try contacting us via email.",
    },
    fi: {
      thankYou: "Kiitos yhteydenotostasi!",
      responseInfo: "Vastaamme sinulle mahdollisimman pian.",
      additionalInfo:
        "Vastauksen saaminen ei ole taattua, mutta pyrimme vastaamaan kaikkiin viesteihin. Jos et saa vastausta, voit kokeilla ottaa yhteyttä sähköpostitse.",
    },
  };  

  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-md border border-[var(--va-border)]">
      <h2 className="text-xl font-semibold mb-2 text-[#FF5000]">
        {translations[language]?.thankYou || "Kiitos yhteydenotostasi!"}
      </h2>
      <p>
        {translations[language]?.responseInfo ||
          "Vastaamme sinulle mahdollisimman pian."}
      </p>

      <Image
        src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png"
        alt="Metropolia liito-orava logo"
        width={939}
        height={814}
        className="mx-auto mt-4 h-32 w-auto"
      />

      <span className="text-sm text-[var(--typography)] mt-6 block">
        {translations[language]?.additionalInfo ||
          "Vastauksen saaminen ei ole taattua, mutta pyrimme vastaamaan kaikkiin viesteihin. Jos et saa vastausta, voit kokeilla ottaa yhteyttä sähköpostitse."}
      </span>
    </div>
  );
};

export default ContactSuccess;
