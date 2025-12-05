"use client";
import { useDestinationData } from "@/hooks/destinationHooks";
import React, { useEffect, useState } from "react";
import DestinationList from "@/components/exchange-destinations/DestinationList";
import { useLanguage } from "@/context/LanguageContext";
import DestinationAdminPanel from "@/components/exchange-destinations/destinationAdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID, ELEVATED_LEVEL_ID } from "@/config/roles";
import { DestinationUrlResponse, useDestinationUrls } from "@/hooks/destinationUrlHooks";
import DestinationButtons from "@/components/exchange-destinations/linkButtons";

const DestinationMap = React.lazy(
  () => import("@/components/exchange-destinations/DestinationMap")
);

const DestinationsPage = () => {
  const { language } = useLanguage();
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  const { isAuthenticated, user } = useAuth();
  const { getDestinationUrls } = useDestinationUrls();
  const [destinationUrls, setDestinationUrls] = useState<DestinationUrlResponse[]>([]);

  const adminLevels = [Number(ADMIN_LEVEL_ID), Number(ELEVATED_LEVEL_ID)];

  const [selectedField, setSelectedField] = useState<"tech" | "health" | "culture" | "business">("tech");
  const { destinationArray, loading, error } = useDestinationData(selectedField, useMockData);

  useEffect(() => {
    const fetchUrls = async () => {
      const urls = await getDestinationUrls();
      if (urls) setDestinationUrls(urls.urls);
    };
    fetchUrls();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading destinations...</div>;

  if (error && (!isAuthenticated || !adminLevels.includes(Number(user?.user_level_id)))) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!destinationArray && (!isAuthenticated || !adminLevels.includes(Number(user?.user_level_id)))) {
    return <div className="p-4 text-center">No destinations available. Try refreshing the page.</div>;
  }

  const translations: Record<string, Record<string, string>> = {
    fi: {
      partnerSchools: "Kansainväliset yhteistyökorkeakoulut",
      chooseField: "Valitse koulutusala rajataksesi tuloksia",
      couldNotLoad: "Kohteita ei voida ladata: ",
      youCanStillModify: "Voit silti muokata kohteiden URL-osoitteita. Tarkista että kaikki kohteiden URL-osoitteet löytyvät hallintapaneelista.",
      tech: "Tekniikka",
      health: "Sosiaali- ja terveysala",
      culture: "Kulttuuri",
      business: "Liiketalous",
      checkAllDestinations: "Voit varmistaa kohteet niiden niiden varsinaisten URL-osoitteiden kautta.",
    },
    en: {
      partnerSchools: "International Partner Universities",
      chooseField: "Select a field of study to filter results",
      couldNotLoad: "Could not load destinations: ",
      youCanStillModify: "You can still modify destination URLs. Make sure all destination URLs are found in the admin panel.",
      tech: "Technology",
      health: "Health and Social Services",
      culture: "Culture",
      business: "Business",
      checkAllDestinations: "You can verify the destinations through their actual URLs.",
    },
  };

  const fieldLabels: Record<string, string> = {
    tech: translations[language].tech,
    health: translations[language].health,
    culture: translations[language].culture,
    business: translations[language].business,
  };

  return (
    <div className="p-4 mt-4 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-6 text-[#FF5000] text-center tracking-wide" style={{ fontFamily: "var(--font-machina-bold)" }}>
        {translations[language].partnerSchools}
      </h1>

      {isAuthenticated && adminLevels.includes(Number(user?.user_level_id)) && <DestinationAdminPanel fetchError={error} />}

      {!error && destinationArray && (
        <>
          <div className="text-center overflow-hidden rounded-lg my-12 p-4">
            <h2 className="text-lg mb-4">{translations[language].chooseField}</h2>
            <label htmlFor="field-select" className="sr-only">{translations[language].chooseField}</label>
            <select
              id="field-select"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value as "tech" | "health" | "culture" | "business")}
              className="px-6 py-2 bg-[var(--va-mint-50)] rounded-full font-medium shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            >
              {Object.entries(fieldLabels).map(([field, label]) => (
                <option key={field} value={field} className="text-[var(--typography)] bg-[var(--background)]">{label}</option>
              ))}
            </select>
          </div>

          <DestinationMap data={destinationArray} />
          <DestinationList data={destinationArray} />

          { destinationUrls.length > 0 && (
            <DestinationButtons destinations={destinationUrls} fieldLabels={fieldLabels} />
          ) }
        </>
      )}

      {error && isAuthenticated && user && adminLevels.includes(Number(user.user_level_id)) && (
        <div className="p-4 text-center text-red-500">
          {translations[language].couldNotLoad} {error} <br />
          {translations[language].youCanStillModify}
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
