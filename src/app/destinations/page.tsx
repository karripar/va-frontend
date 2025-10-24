"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";
import DestinationList from "@/components/exchange-destinations/DestinationList";
import Image from "next/image";

// const DestinationMap = React.lazy(() => import("@/components/exchange-destinations/DestinationMap"));

// Normal import for testing purposes, vitest has issues with React.lazy
import DestinationMap from "@/components/exchange-destinations/DestinationMap";


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
    <div className="p-4 mt-4 max-w-2xl mx-auto">
      <h1
        className="text-2xl mb-6 text-[#FF5000] text-center tracking-wide"
        style={{ fontFamily: "var(--font-machina-regular)" }}
      >
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
      <div className="text-center overflow-hidden rounded-lg my-6 p-4 ">
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
          className="px-6 py-2 bg-[var(--va-mint-50)] rounded-full font-medium shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
        >
          {Object.entries(fieldLabels).map(([field, label]) => (
            <option
              key={field}
              value={field}
              className="text-[var(--typography)] bg-[var(--background)]"
            >
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
