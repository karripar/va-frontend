"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";

const DestinationsPage = () => {
  const { destinationArray, loading, error } = useDestinationData();
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!destinationArray) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>No destinations available.</p>
      </div>
    );
  }

  const toggleCountry = (countryKey: string) => {
    setOpenCountries((prev) => ({ ...prev, [countryKey]: !prev[countryKey] }));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#FF5000] text-center">
        Destinations
      </h1>
      <div className="mb-6 text-center text-gray-700">
        Confirm current destination schools and programs offered by Metropolia from{" "}
        <a
          href="https://www.metropolia.fi/en/international-relations/partner-institutions/technology"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF5000] hover:underline"
        >
          here
        </a>.
      </div>

      {Object.entries(destinationArray.destinations).map(([program, universities]) => {
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
                <div key={countryKey} className="mb-3 border rounded-lg shadow-sm overflow-hidden">
                  <button
                    className="w-full text-left p-3 bg-[#FF5000] text-white font-semibold flex justify-between items-center"
                    onClick={() => toggleCountry(countryKey)}
                  >
                    <span>{country} ({unis.length})</span>
                    <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
                  </button>

                  {/* Smooth dropdown */}
                  <ul
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out bg-gray-200 ${
                      isOpen ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    {unis.map((uni) => (
                      <li
                        key={uni.name}
                        className="p-3 border-b last:border-b-0 rounded hover:shadow transition-shadow"
                      >
                        <h3 className="text-gray-800 font-medium">{uni.name}</h3>
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
