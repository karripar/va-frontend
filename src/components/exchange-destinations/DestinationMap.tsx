"use client";
import React, { useEffect, useState } from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { DefaultIcon } from "../../../leafletConfig";
import MapSearchbar from "./MapSearchbar";
import { useLanguage } from "@/context/LanguageContext";

interface DestinationMapProps {
  data: DestinationWithCoordinatesResponse;
}

interface SelectedCountry {
  country: string;
  universities: { title: string; program: string; link: string }[];
}

const DestinationMap: React.FC<DestinationMapProps> = ({ data }) => {
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCountry, setSelectedCountry] =
    useState<SelectedCountry | null>(null);
  const { language } = useLanguage();

  const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki fallback

  // Clear program filter when searching
  useEffect(() => {
    if (searchTerm) {
      setProgramFilter(null);
    }
  }, [searchTerm]);

  if (!data || !data.destinations) {
    return <div>No destination data available.</div>;
  }

  // Apply filter
  const filteredDestinations =
    programFilter && programFilter !== "all"
      ? { [programFilter]: data.destinations[programFilter] || [] }
      : data.destinations;

  // Group by country
  const countries: Record<
    string,
    {
      coordinates: { lat: number; lng: number };
      universities: { title: string; program: string; link: string }[];
    }
  > = {};

  Object.entries(filteredDestinations).forEach(([program, universities]) => {
    universities
      .filter((uni) =>
        searchTerm
          ? uni.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            uni.country.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .forEach((uni) => {
        if (!uni.coordinates) return;
        if (!countries[uni.country]) {
          countries[uni.country] = {
            coordinates: uni.coordinates,
            universities: [],
          };
        }
        countries[uni.country].universities.push({
          title: uni.title,
          program,
          link: uni.link,
        });
      });
  });

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg p-2">
      {/* Program filter dropdown */}
      <div className="mb-4">
        <select
          value={programFilter || "all"}
          onChange={(e) => setProgramFilter(e.target.value || null)}
          className="p-2 border rounded"
        >
          <option value="all">Kaikki yhteistyösopimukset</option>
          {Object.keys(data.destinations).map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="w-full h-[400px] relative">
        <MapContainer
          center={defaultCenter}
          zoom={4}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            subdomains={["a", "b", "c", "d"]}
            maxZoom={20}
          />

          {/* Markers per country */}
          {Object.entries(countries).map(
            ([country, { coordinates, universities }]) => (
              <Marker
                key={country}
                position={[coordinates.lat, coordinates.lng]}
                icon={DefaultIcon}
                eventHandlers={{
                  click: () => setSelectedCountry({ country, universities }),
                }}
              />
            )
          )}
        </MapContainer>

        {/* Searchbar overlay */}
        <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-90 rounded shadow-md">
          <MapSearchbar onSearch={(query) => setSearchTerm(query)} />
        </div>

        {selectedCountry && (
        <div className="fixed top-1/6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl max-h-[80%] overflow-y-auto p-6">
          <button
            onClick={() => setSelectedCountry(null)}
            className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-600"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {selectedCountry.country}
          </h2>

          <ul className="space-y-4">
            {selectedCountry.universities.map((uni, index) => (
              <li key={index} className="border-b pb-4">
                <h3 className="font-semibold">{uni.title}</h3>
                <p className="">{uni.program}</p>
                {uni.link && (
                  <a
                    href={uni.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-[#FF5000] text-white rounded-lg shadow hover:bg-[#e04e00]"
                  >
                    Vieraile verkkosivulla
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
};

export default DestinationMap;
