"use client";
import { useDestinationData } from "@/hooks/destinationHooks";
import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DestinationAdminPanel from "@/components/exchange-destinations/destinationAdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_LEVEL_ID, ELEVATED_LEVEL_ID } from "@/config/roles";
import {
  DestinationUrlResponse,
  useDestinationUrls,
} from "@/hooks/destinationUrlHooks";
import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";

// Normal import for testing purposes, vitest has issues with React.lazy
// import DestinationMap from "@/components/exchange-destinations/DestinationMap";

const DestinationsPage = () => {
  const { language } = useLanguage();
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  const { isAuthenticated, user } = useAuth();
  const { getDestinationUrls } = useDestinationUrls();
  const [destinationUrls, setDestinationUrls] = useState<
    DestinationUrlResponse[]
  >([]);

  const adminLevels = [Number(ADMIN_LEVEL_ID), Number(ELEVATED_LEVEL_ID)];

  const [selectedField, setSelectedField] = useState<
    "tech" | "health" | "culture" | "business"
  >("tech");
  const { destinationArray, loading, error } = useDestinationData(
    selectedField,
    useMockData
  );

  useEffect(() => {
    const fetchUrls = async () => {
      const urls = await getDestinationUrls();
      if (urls) {
        setDestinationUrls(urls.urls);
      }
    };
    fetchUrls();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading destinations...</div>;
  }

  // Show error ONLY to non-admin users
  if (
    error &&
    (!isAuthenticated || !adminLevels.includes(Number(user?.user_level_id)))
  ) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  // If no destinations AND user is NOT admin → block page
  if (
    !destinationArray &&
    (!isAuthenticated || !adminLevels.includes(Number(user?.user_level_id)))
  ) {
    return (
      <div className="p-4 text-center">
        No destinations available. Try refreshing the page.
      </div>
    );
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
      couldNotLoad: "Kohteita ei voida ladata: ",
      youCanStillModify:
        "Voit silti muokata kohteiden URL-osoitteita. Tarkista että kaikki kohteiden URL-osoitteet löytyvät hallintapaneelista.",
      findDestinations: "Löydät Metropolian vaihtokohteet alla olevista linkeistä aloittain:"
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
      couldNotLoad: "Could not load destinations: ",
      youCanStillModify:
        "You can still modify destination URLs. Make sure all destination URLs are found in the admin panel.",
      findDestinations: "You can find Metropolia's exchange destinations from the links below by fields of study:"
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
      <h1
        className="text-2xl sm:text-3xl mb-6 text-[#FF5000] text-center tracking-wide"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        {translations[language].partnerSchools}
      </h1>
      <p className="text-center mb-6">
        {translations[language].findDestinations}
      </p>

      {/** Admin board for changing scraping URLs (always visible for admins) */}
      {isAuthenticated && adminLevels.includes(Number(user?.user_level_id)) && (
        <DestinationAdminPanel fetchError={error} />
      )}

      {/** Show destination urls as link buttons to the users */}
      {destinationUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          {destinationUrls.map((dest) => (
            <a
            key={dest._id}
            href={dest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden flex flex-col justify-between p-12 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-lg transition"
          >
            {/* IMAGE BEHIND */}
            <Image
              src="/liito-orava-liput.png"
              alt="Button background image"
              width={400}
              height={250}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          
            {/* DARK GRADIENT OVERLAY */}
            <span
              className="
                absolute inset-0 
                bg-gradient-to-t from-black/50 to-black/10 
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
              "
            ></span>
          
            {/* SLIDING REVEAL LAYER */}
            <span
              className="
                absolute inset-0 bg-white
                translate-x-0 group-hover:translate-x-full
                transition-transform duration-500 ease-out
              "
            ></span>
          
            {/* TEXT + ICON */}
            <div className="relative z-10 flex items-center justify-between text-[#ff5000] drop-shadow-lg w-full">
              <div className="font-semibold text-lg">
                {fieldLabels[dest.field]}
              </div>
          
              <FiExternalLink size={20} className="text-[#ff5000]" />
            </div>
          </a>
          
          
          
          
          ))}
        </div>
      )}

      {/** Optional message for admins when data fetch failed */}
      {error &&
        isAuthenticated &&
        user &&
        adminLevels.includes(Number(user.user_level_id)) && (
          <div className="p-4 text-center text-red-500">
            {translations[language].couldNotLoad} {error} <br />
            {translations[language].youCanStillModify}
          </div>
        )}
    </div>
  );
};

export default DestinationsPage;
