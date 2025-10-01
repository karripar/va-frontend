"use client";
import { useDestinationData } from "@/hooks/apiHooks";
import React, { useState } from "react";
import DestinationList from "@/components/DestinationList";

const DestinationMap = React.lazy(() => import('@/components/DestinationMap'));

const DestinationsPage = () => {
  const useMockData = process.env.NODE_ENV !== 'production';

  const [selectedField, setSelectedField] = useState<"tech" | "health" | "culture" | "business">("tech");
  const { destinationArray, loading, error } = useDestinationData(selectedField, useMockData); 

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
      <h1 className="text-2xl font-bold mb-6 text-[#FF5000] text-center">Destinations</h1>

      {/** field switcher */}
      <div className="flex justify-center mb-6 space-x-4">
        {["tech", "health", "culture", "business"].map((field) => (
          <button
            key={field}
            onClick={() => setSelectedField(field as "tech" | "health" | "culture" | "business")}
            className={`relative px-4 py-2 font-medium transition ${
              selectedField === field
                ? "text-[#FF5000] font-bold"
                : "text-gray-700 hover:text-[#FF5000]"
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {selectedField === field && (
              <span className="absolute left-0 right-0 -bottom-1 h-1 bg-[#FF5000] rounded-full animate-slideIn" />
            )}
          </button>
        ))}
      </div>
      {/** Map */}
      {destinationArray && <DestinationMap data={destinationArray} /> }

      {/* Programs & Countries */}
      {destinationArray && <DestinationList data={destinationArray} /> }
    </div>
  );
};

export default DestinationsPage;
