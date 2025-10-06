"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";
import DestinationList from "@/components/DestinationList";
import Image from "next/image";

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
      <h1 className="text-2xl font-bold mb-6 text-[#FF5000] text-center">
        Kansainväliset yhteistyökorkeakoulut
      </h1>
      <Image
        src="/liito-orava-liput.png"
        alt="Liito orava"
        width={940} // intrinsic width
        height={814} // intrinsic height
        className="max-w-[200] h-auto mx-auto mb-6 hover:rotate-360 transition-transform duration-300"
      />

      {/** field switcher */}
      <div className="text-center overflow-hidden rounded-lg my-6 p-4">
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
          className="px-6 py-2 rounded-full bg-[var(--va-mint-50)] font-medium shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        >
          {Object.entries(fieldLabels).map(([field, label]) => (
            <option key={field} value={field} className="text-gray-800">
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
