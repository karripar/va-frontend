"use client";
import React, { useEffect, useState } from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { DefaultIcon } from "../../leafletConfig";
import MapSearchbar from "./MapSearchbar";

interface DestinationMapProps {
  data: DestinationWithCoordinatesResponse;
}

const DestinationMap: React.FC<DestinationMapProps> = ({ data }) => {
  const [programFilter, setProgramFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUni, setSelectedUni] = useState<{
    title: string;
    country: string;
    program: string;
    link: string;
  } | null>(null);

  const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki fallback

  // use effect for searching as user types
  useEffect(() => {
    if (searchTerm) {
      setProgramFilter(null); // Clear program filter when searching
    }
  }, [searchTerm]);

  if (!data || !data.destinations) {
    return <div>No destination data available.</div>;
  }

  // 🔑 Apply filter
  const filteredDestinations = 
  programFilter && programFilter !== "all"
    ? { [programFilter]: data.destinations[programFilter] || [] }
    : data.destinations;

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-lg p-2">
      {/* Program filter dropdown */}
      <div className="mb-4">
        <select
          value={programFilter || ""}
          onChange={(e) => setProgramFilter(e.target.value || null)}
          className="p-2 border rounded"
        >
          <option value="all">Kaikki kohteet</option>
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

          {/* 🔑 Markers */}
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
                    eventHandlers={{
                      click: () =>
                        setSelectedUni({
                          title: uni.title,
                          country: uni.country,
                          program,
                          link: uni.link,
                        }),
                    }}
                  />
                );
              })
          )}
        </MapContainer>

        {/* 🔍 Searchbar overlay */}
        <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-90 rounded shadow">
          <MapSearchbar onSearch={(query) => setSearchTerm(query)} />
        </div>

        {/* 🔥 Fullscreen Popup Overlay */}
        {selectedUni && (
          <div className="absolute inset-0 z-20 bg-white bg-opacity-95 flex flex-col items-center justify-center p-6">
            <button
              onClick={() => setSelectedUni(null)}
              className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-600"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {selectedUni.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedUni.country} · {selectedUni.program}
            </p>
            <a
              href={selectedUni.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#FF5000] text-white rounded-lg shadow hover:bg-[#e04e00]"
            >
              Vieraile verkkosivulla
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationMap;
