"use client";
import { useDestinationData } from "@/hooks/destinationHooks";
import React, { useState } from "react";
import DestinationList from "@/components/exchange-destinations/DestinationList";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import DestinationAdminPanel from "@/components/exchange-destinations/destinationAdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID } from "@/config/roles";

const DestinationMap = React.lazy(() => import("@/components/exchange-destinations/DestinationMap"));

// Normal import for testing purposes, vitest has issues with React.lazy
// import DestinationMap from "@/components/exchange-destinations/DestinationMap";

const DestinationsPage = () => {
  const { language } = useLanguage();
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  const { isAuthenticated, user } = useAuth();

  const [selectedField, setSelectedField] = useState<
    "tech" | "health" | "culture" | "business"
  >("tech");
  const { destinationArray, loading, error } = useDestinationData(
    selectedField,
    useMockData
  );

  if (loading) {
    return <div className="p-4 text-center">Loading destinations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!destinationArray) {
    return <div className="p-4 text-center">No destinations available. Try refreshing the page.</div>;
  }
  
  const translations: Record<string, Record<string, string>> = {
    fi: {
      partnerSchools: "Kansainväliset yhteistyökorkeakoulut",
      selectField: "Valitse koulutusala rajataksesi tuloksia",
      loading: "Ladataan kohteita...",
      error: "Virhe: ",
      chooseField: "Valitse koulutusala rajataksesi tuloksia",
      tech: "Tekniikka",
      health: "Sosiaali- ja terveysala",
      culture: "Kulttuuri",
      business: "Liiketalous",
    },
    en: {
      partnerSchools: "International Partner Universities",
      selectField: "Select a field of study to filter results",
      loading: "Loading destinations...",
      error: "Error: ",
      chooseField: "Select a field of study to filter results",
      tech: "Technology",
      health: "Health and Social Services",
      culture: "Culture",
      business: "Business",
    }
  };

  const fieldLabels: Record<string, string> = {
    tech: translations[language].tech,
    health: translations[language].health,
    culture: translations[language].culture,
    business: translations[language].business,
  };

  return (
    <div className="p-4 mt-4 max-w-2xl mx-auto">
      <h1
        className="text-3xl mb-6 text-[#FF5000] text-center tracking-wide"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        {translations[language].partnerSchools}
      </h1>

      {/** Admin board for changing scraping url's */}
      {isAuthenticated && user?.user_level_id === Number(ADMIN_LEVEL_ID) && <DestinationAdminPanel />}

      <Image
        src="/liito-orava-liput.png"
        alt="Liito orava"
        width={940} // intrinsic width
        height={814} // intrinsic height
        className="max-w-[200] h-auto mx-auto mb-6 hover:rotate-360 transition-transform duration-300"
      />

      {/** field switcher */}
      <div className="text-center overflow-hidden rounded-lg my-6 p-4 ">
        <h2 className="text-lg mb-4">
          {translations[language].chooseField}
        </h2>
        {/** Buttons for the switch */}

        <select
          value={selectedField}
          onChange={(e) =>
            setSelectedField(
              e.target.value as "tech" | "health" | "culture" | "business"
            )
          }
          className="px-6 py-2 bg-[var(--va-mint-50)] rounded-full font-medium shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        >
          {Object.entries(fieldLabels).map(([field, label]) => (
            <option
              key={field}
              value={field}
              className="text-[var(--typography)] bg-[var(--background)]"
            >
              {label}
            </option>
          ))}
        </select>
      </div>
      {/** Map */}
      {destinationArray && <DestinationMap data={destinationArray} />}

      {/* Programs & Countries */}
      {destinationArray && <DestinationList data={destinationArray} />}
    </div>
  );
};

export default DestinationsPage;
