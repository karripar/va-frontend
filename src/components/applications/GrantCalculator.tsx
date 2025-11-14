"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface GrantCalculatorProps {
  onCalculate?: (amount: number) => void;
}

export default function GrantCalculator({ onCalculate }: GrantCalculatorProps) {
  const [amount, setAmount] = useState(540);
  const [searchQuery, setSearchQuery] = useState("");

  const minAmount = 0;
  const maxAmount = 10000;
  const program = "Erasmus+";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    setAmount(newAmount);
    if (onCalculate) {
      onCalculate(newAmount);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div>
        <p className="text-gray-700 mb-4">
          Hae arvio apurahasta vaihto-ohjelman tai kohteen perusteella
        </p>

        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Etsi kohteita"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#8BC34A] focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Vaihto-ohjelmat dropdown */}
        <button className="w-full mt-3 px-4 py-3 bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342] transition-colors flex items-center justify-between">
          <span>Vaihto-ohjelmat</span>
          <span>›</span>
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-[var(--typography)] mb-4">Arvio apurasta</h3>

        {/* Amount Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[var(--typography)]">
            {amount}€ / KK
          </div>
        </div>

        {/* Slider */}
        <div className="relative mb-2">
          <input
            type="range"
            min={minAmount}
            max={maxAmount}
            value={amount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
            style={{
              background: `linear-gradient(to right, #8BC34A 0%, #8BC34A ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #E5E7EB ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #E5E7EB 100%)`
            }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="flex justify-between text-sm text-[var(--typography)] mb-6">
          <span>{minAmount}€</span>
          <span>{maxAmount}€</span>
        </div>

        {/* Destination and Program */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[var(--typography)]">Kohde</span>
            <span className="font-medium text-[var(--typography)]">Italia</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--typography)]">Ohjelma</span>
            <span className="font-medium text-[var(--typography)]">{program}</span>
          </div>
        </div>

        {/* Apply Button */}
        <button className="w-full mt-6 px-6 py-3 bg-[#FF5722] text-white rounded-lg hover:bg-[#F4511E] transition-colors font-medium flex items-center justify-center space-x-2">
          <span>HAE APURAHAA</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </button>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #8BC34A;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider-green::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #8BC34A;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
