"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";
import DestinationList from "@/components/DestinationList";

const DestinationMap = React.lazy(() => import("@/components/DestinationMap"));

const fieldLabels: Record<string, string> = {
  tech: "Tekniikka",
  health: "Sosiaali- ja terveysala",
  culture: "Kulttuuri",
  business: "Liiketalous",
};

const DestinationsPage = () => {
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const [selectedField, setSelectedField] = useState<
    "tech" | "health" | "culture" | "business"
  >("tech");
  const { destinationArray, loading, error } = useDestinationData(
    selectedField,
    useMockData
  );

  if (loading) {
    return <div className="p-4 text-center">Loading destinations...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!destinationArray) {
    return <div className="p-4 text-center">No destinations available.</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-18 text-[#FF5000] text-center">
        Kansainväliset yhteistyökorkeakoulut
      </h1>

      {/** field switcher */}
      <div className="text-center overflow-hidden rounded-lg my-18 p-4">
        {/** Header for the switch */}
        <h2 className="text-lg mb-4">
          Valitse koulutusala rajataksesi tuloksia
        </h2>
        {/** Buttons for the switch */}

        <select
          value={selectedField}
          onChange={(e) =>
            setSelectedField(
              e.target.value as "tech" | "health" | "culture" | "business"
            )
          }
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5000] text-gray-700"
        >
          {Object.entries(fieldLabels).map(([field, label]) => (
            <option key={field} value={field}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {/** Map */}
      {destinationArray && <DestinationMap data={destinationArray} />}

      {/* Programs & Countries */}
      {destinationArray && <DestinationList data={destinationArray} />}
    </div>
  );
};

export default DestinationsPage;
