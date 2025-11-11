"use client";
import { useState } from "react";
import { ErasmusPlusGrantType } from "va-hybrid-types";

interface ErasmusGrantOption {
  type: ErasmusPlusGrantType;
  title: string;
  description: string;
  bgColor: string;
}

interface ErasmusGrantTypesProps {
  onSelectGrant?: (grantType: ErasmusPlusGrantType) => void;
}

export default function ErasmusGrantTypes({ onSelectGrant }: ErasmusGrantTypesProps) {
  const [selectedGrant, setSelectedGrant] = useState<ErasmusPlusGrantType | null>(null);

  const grantTypes: ErasmusGrantOption[] = [
    {
      type: "base_grant",
      title: "Erasmus+ matkatuki",
      description: "Perus Erasmus+ -apuraha vaihtoon",
      bgColor: "bg-[#FFCCBC] hover:bg-[#FFAB91]"
    },
    {
      type: "travel_grant",
      title: "Vihreän matkustamisen tuki",
      description: "Lisätuki ympäristöystävällisestä matkustamisesta",
      bgColor: "bg-[#FFCCBC] hover:bg-[#FFAB91]"
    },
    {
      type: "green_travel_supplement",
      title: "Osallisuustuki",
      description: "Tuki erityistarpeita varten",
      bgColor: "bg-[#FFCCBC] hover:bg-[#FFAB91]"
    }
  ];

  const handleGrantSelect = (grantType: ErasmusPlusGrantType) => {
    setSelectedGrant(grantType);
    if (onSelectGrant) {
      onSelectGrant(grantType);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Erasmus+ lisätuet</h3>
      
      <div className="space-y-3">
        {grantTypes.map((grant) => (
          <button
            key={grant.type}
            onClick={() => handleGrantSelect(grant.type)}
            className={`w-full p-4 rounded-lg transition-all text-left ${
              selectedGrant === grant.type
                ? "ring-2 ring-orange-500"
                : ""
            } ${grant.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{grant.title}</h4>
                <p className="text-sm text-gray-700">{grant.description}</p>
              </div>
              <span className="text-gray-700 ml-4">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
