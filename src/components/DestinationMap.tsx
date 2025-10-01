"use client";
import React from "react";
import { DestinationWithCoordinatesResponse } from "va-hybrid-types/contentTypes";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DefaultIcon } from "../../leafletConfig";

interface DestinationMapProps {
  data: DestinationWithCoordinatesResponse;
}

const DestinationMap: React.FC<DestinationMapProps> = ({ data }) => {
  if (!data || !data.destinations) {
    return <div>No destination data available.</div>;
  }

  const defaultCenter: [number, number] = [60.1699, 24.9384]; // Helsinki coordinates as fallback

  return (
    <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-md">
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
        {Object.entries(data.destinations).map(([program, universities]) =>
          universities.map((uni, index) => {
            if (uni.coordinates) {
              const position: [number, number] = [
                uni.coordinates.lat,
                uni.coordinates.lng,
              ];
              return (
                <Marker key={`${program}-${index}`} position={position} icon={DefaultIcon}>
                  <Popup>
                    <a
                      href={uni.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {uni.title}
                    </a>
                    <br />
                    {uni.country} - {program}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })
        )}
      </MapContainer>
    </div>
  );
};

export default DestinationMap;
