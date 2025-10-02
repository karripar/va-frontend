"use client";
import React, { useState } from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DefaultIcon } from "../../leafletConfig";
import MapSearchbar from "./MapSearchbar";

interface DestinationMapProps {
  data: DestinationWithCoordinatesResponse;
}

const DestinationMap: React.FC<DestinationMapProps> = ({ data }) => {
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (!data || !data.destinations) {
    return <div>No destination data available.</div>;
  }

  const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki fallback

  // 🔑 Apply filter: only include selected program (or all if none)
  const filteredDestinations = programFilter
    ? { [programFilter]: data.destinations[programFilter] || [] }
    : data.destinations;

  return (
    <div className="w-full">
      {/* Filter dropdown stays outside map */}
      <div className="mb-4">
        <select
          value={programFilter || ""}
          onChange={(e) => setProgramFilter(e.target.value || null)}
          className="p-2 border rounded"
        >
          <option value="">Kaikki kohteet</option>
          {Object.keys(data.destinations).map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={defaultCenter}
          zoom={4}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔑 Use filteredDestinations */}
          {Object.entries(filteredDestinations).map(([program, universities]) =>
            universities
              .filter((uni) =>
                searchTerm
                  ? uni.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    uni.country.toLowerCase().includes(searchTerm.toLowerCase())
                  : true
              )
              .map((uni, index) => {
                if (!uni.coordinates) return null;
                const position: [number, number] = [
                  uni.coordinates.lat,
                  uni.coordinates.lng,
                ];
                return (
                  <Marker
                    key={`${program}-${index}`}
                    position={position}
                    icon={DefaultIcon}
                  >
                    <Popup>
                      <div className="p-2 rounded-lg bg-white text-center">
                        <a
                          href={uni.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {uni.title}
                        </a>
                        <p className="mt-1 text-sm text-gray-600">
                          {uni.country} <span className="text-gray-400">·</span>{" "}
                          {program}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
          )}
        </MapContainer>
      </div>
      {/* Searchbar overlay */}
      <div className="relative z-10 p-4 bg-white bg-opacity-90">
        <MapSearchbar onSearch={(query) => setSearchTerm(query)} />
      </div>
    </div>
  );
};

export default DestinationMap;
