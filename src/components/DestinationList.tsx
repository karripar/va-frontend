"use client";
import React, { useState } from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";

interface DestinationListProps {
  data: DestinationWithCoordinatesResponse;
}

const DestinationList: React.FC<DestinationListProps> = ({ data }) => {
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>({});
  const [openPrograms, setOpenPrograms] = useState<Record<string, boolean>>({});

  const toggleCountry = (countryKey: string) => {
    setOpenCountries((prev) => ({ ...prev, [countryKey]: !prev[countryKey] }));
  };

  const toggleProgram = (programKey: string) => {
    setOpenPrograms((prev) => ({ ...prev, [programKey]: !prev[programKey] }));
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
            <div key={program} className="my-6 border rounded-lg shadow-md overflow-hidden">
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
                          {country} ({unis.length})
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
                        {unis.map((uni) => (
                          <li
                            key={uni.title}
                            className="p-3 border-b last:border-b-0 hover:bg-white hover:shadow transition"
                          >
                            <h3 className="text-gray-800 font-medium">{uni.title}</h3>
                            {uni.link && (
                              <a
                                href={uni.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5000] text-sm hover:underline"
                              >
                                Visit Website
                              </a>
                            )}
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
