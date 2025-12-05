"use client";
import React, { useState } from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";
import { useLanguage } from "@/context/LanguageContext";
import FavoriteButton from "@/components/ui/FavoriteButton";

interface DestinationListProps {
  data: DestinationWithCoordinatesResponse;
}

const DestinationList: React.FC<DestinationListProps> = ({ data }) => {
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>(
    {}
  );
  const [openPrograms, setOpenPrograms] = useState<Record<string, boolean>>({});
  const { language } = useLanguage();

  const toggleCountry = (countryKey: string) => {
    setOpenCountries((prev) => ({ ...prev, [countryKey]: !prev[countryKey] }));
  };

  const toggleProgram = (programKey: string) => {
    setOpenPrograms((prev) => ({ ...prev, [programKey]: !prev[programKey] }));
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      visitWebsite: "Visit Website",
    },
    fi: {
      visitWebsite: "Vieraile verkkosivuilla",
    },
  };

  return (
    <>
      {/* Programs & Countries */}
      {data &&
        Object.entries(data.destinations).map(([program, universities]) => {
          const countries: Record<string, typeof universities> = {};
          universities.forEach((uni) => {
            if (!countries[uni.country]) countries[uni.country] = [];
            countries[uni.country].push(uni);
          });

          const isProgramOpen = openPrograms[program];

          return (
            <div
              key={program}
              className="my-6 border rounded-lg shadow-md overflow-hidden"
            >
              {/* Program Header */}
              <button
                onClick={() => toggleProgram(program)}
                className="w-full text-left p-4 bg-[#FF5000] text-white font-bold flex justify-between items-center"
              >
                <span>
                  {program} ({universities.length})
                </span>
                <span
                  className={`transition-transform duration-300 ${
                    isProgramOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Countries inside program */}
              <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                  isProgramOpen ? "max-h-[3000px]" : "max-h-0"
                }`}
              >
                {Object.entries(countries).map(([country, unis]) => {
                  const countryKey = `${program}-${country}`;
                  const isCountryOpen = openCountries[countryKey];

                  return (
                    <div key={countryKey} className="mb-3 border-t">
                      <button
                        className="w-full text-left p-3 bg-gray-100 font-semibold flex justify-between items-center"
                        onClick={() => toggleCountry(countryKey)}
                      >
                        <span>
                          {country} (
                          {
                            unis.filter(
                              (u) =>
                                u.title &&
                                u.title.trim() !== "," &&
                                u.title.trim() !== ""
                            ).length
                          }
                          )
                        </span>

                        <span
                          className={`transition-transform duration-300 ${
                            isCountryOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      <ul
                        className={`overflow-hidden transition-[max-height] duration-400 ease-in-out bg-gray-50 ${
                          isCountryOpen ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        {unis.map((uni, index) => (
                          <li
                          key={`${uni.title}-${uni.country}-${index}`}
                          className="p-3 border-b last:border-b-0 hover:bg-white hover:shadow transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[var(--typography)] font-medium text-base sm:text-lg">
                                {uni.title}
                              </h3>
                              {uni.studyField &&
                                uni.studyField !== uni.title &&
                                uni.studyField !== uni.country && (
                                  <span className="text-sm text-gray-600 block mt-1 sm:mt-0.5">
                                    {uni.studyField}
                                  </span>
                                )}
                              {uni.link && (
                                <a
                                  href={uni.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline block mt-1 sm:mt-0.5"
                                  style={{ color: 'var(--va-orange)' }}
                                >
                                  {translations[language]?.visitWebsite || "Visit Website"}
                                </a>
                              )}
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-3 flex-shrink-0">
                              <FavoriteButton destinationName={uni.title} className="p-2 sm:p-3" />
                            </div>
                          </div>
                        </li>
                        
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default DestinationList;
