"use client";
import React, {useState} from "react";
import { DestinationResponse } from "va-hybrid-types/contentTypes";

interface DestinationListProps {
    data: DestinationResponse
};

const DestinationList: React.FC<DestinationListProps> = ({ data }) => {
    const [openCountries, setOpenCountries] = useState<Record<string, boolean>>({});

    const toggleCountry = (countryKey: string) => {
        setOpenCountries((prev) => ({ ...prev, [countryKey]: !prev[countryKey] }));
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
        </>
    );
}

export default DestinationList;