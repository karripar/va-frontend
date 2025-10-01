"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";

const DestinationsPage = () => {
  const useMockData = process.env.NODE_ENV !== 'production';

  const [selectedField, setSelectedField] = useState<"tech" | "health" | "culture" | "business">("tech");
  const { destinationArray, loading, error } = useDestinationData(selectedField, useMockData); 
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>({});

  const toggleCountry = (countryKey: string) => {
    setOpenCountries((prev) => ({ ...prev, [countryKey]: !prev[countryKey] }));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#FF5000] text-center">Destinations</h1>

      {/* Field Switcher */}
      <div className="flex justify-center gap-2 mb-6">
        {["tech", "health", "culture", "business"].map((field) => (
          <button
            key={field}
            onClick={() => setSelectedField(field as "tech" | "health" | "culture" | "business")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedField === field
                ? "bg-[#FF5000] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center items-center h-40 text-gray-500">
          Loading...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-40 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
      {!loading && !destinationArray && (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <p>No destinations available.</p>
        </div>
      )}

      {/* Programs & Countries */}
      {destinationArray &&
        Object.entries(destinationArray.destinations).map(([program, universities]) => {
          const countries: Record<string, typeof universities> = {};
          universities.forEach((uni) => {
            if (!countries[uni.country]) countries[uni.country] = [];
            countries[uni.country].push(uni);
          });

          return (
            <div key={program} className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#FF5000]">{program}</h2>

              {Object.entries(countries).map(([country, unis]) => {
                const countryKey = `${program}-${country}`;
                const isOpen = openCountries[countryKey];

                return (
                  <div
                    key={countryKey}
                    className="mb-3 border rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      className="w-full text-left p-3 bg-[#FF5000] text-white font-semibold flex justify-between items-center"
                      onClick={() => toggleCountry(countryKey)}
                    >
                      <span>{country} ({unis.length})</span>
                      <span
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    <ul
                      className={`overflow-hidden transition-[max-height] duration-300 ease-in-out bg-gray-200 ${
                        isOpen ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      {unis.map((uni) => (
                        <li
                          key={uni.title}
                          className="p-3 border-b last:border-b-0 rounded hover:shadow transition-shadow"
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
          );
        })}
    </div>
  );
};

export default DestinationsPage;
