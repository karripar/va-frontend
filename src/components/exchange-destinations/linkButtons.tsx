"use client";
import React from "react";
import { DestinationUrlResponse } from "@/hooks/destinationUrlHooks";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface DestinationButtonsProps {
  destinations: DestinationUrlResponse[];
  fieldLabels: Record<string, string>;
}

const DestinationButtons: React.FC<DestinationButtonsProps> = ({
  destinations,
  fieldLabels,
}) => {
  const { language } = useLanguage();

  const t: Record<string, Record<string, string>> = {
    fi: {
      checkAllDestinations:
        "Voit varmistaa kaikki kohteet Metropolian kansainvälisten yhteistyökorkeakoulujen sivujen kautta.",
    },
    en: {
      checkAllDestinations:
        "You can verify the destinations through Metropolia's international partner universities page.",
    },
  };

  if (!destinations.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-12">
      <h2 className="col-span-full text-center font-semibold text-xl mb-4">
        {t[language].checkAllDestinations}
      </h2>
      {destinations.map((dest) => (
        <a
          key={dest._id}
          href={dest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex flex-col justify-between p-12 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-lg transition"
        >
          <Image
            src="/liito-orava-liput.png"
            alt="Button background image"
            width={400}
            height={250}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span className="absolute inset-0 bg-white translate-x-0 group-hover:translate-x-full transition-transform duration-500 ease-out"></span>
          <div className="relative z-10 flex items-center justify-between text-[#ff5000] drop-shadow-lg w-full">
            <div className="font-semibold text-lg">
              {fieldLabels[dest.field]}
            </div>
            <FiExternalLink size={20} className="text-[#ff5000]" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default DestinationButtons;
