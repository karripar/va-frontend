"use client";
import { useState } from "react";
import Link from "next/link";
import BudgetCategories from "@/components/applications/BudgetCategories";
import GrantCalculator from "@/components/applications/GrantCalculator";
import ErasmusGrantTypes from "@/components/applications/ErasmusGrantTypes";
import { useBudgetEstimate } from "@/hooks/budgetArviointiHooks";
import { useGrantsData } from "@/hooks/grantsManagingHooks";

export default function GrantsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const { grants, loading: grantsLoading, error: grantsError } = useGrantsData();
  const { budget } = useBudgetEstimate();

  const handleCategorySelect = (category: string) => {
    console.log("Selected category:", category);
    
  };

  const handleCalculate = (amount: number) => {
    console.log("Calculated amount:", amount);
  };

  const handleGrantSelect = (grantType: string) => {
    console.log("Selected grant type:", grantType);
    
  };

  if (grantsLoading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan apurahoja...</p>
      </div>
    );
  }

  if (grantsError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {grantsError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Yritä uudelleen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header */}
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <Link
          href="/profile"
          className="absolute left-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Takaisin profiiliin"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">Apurahat</h1>
        
        {/* Chat button on the right */}
        <button
          className="absolute right-4 bg-[#FF5722] text-white px-4 py-2 rounded-full hover:bg-[#F4511E] transition-colors"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}
        >
          CHAT
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex">
          <button
            onClick={() => setViewMode("categories")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              viewMode === "categories"
                ? "text-[#FF5722] border-b-2 border-[#FF5722]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Kustannukset
          </button>
          <button
            onClick={() => setViewMode("calculator")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              viewMode === "calculator"
                ? "text-[#FF5722] border-b-2 border-[#FF5722]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Laskuri
          </button>
          <button
            onClick={() => setViewMode("erasmus_types")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              viewMode === "erasmus_types"
                ? "text-[#FF5722] border-b-2 border-[#FF5722]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Erasmus+ lisätuet
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {viewMode === "categories" && (
          <div>
            <BudgetCategories onCategorySelect={handleCategorySelect} />
            
            {budget && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Arvioitu budjettisi
                </h3>
                <div className="text-3xl font-bold text-[#FF5722]">
                  {budget.totalEstimate || 0}€
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Kohde: {budget.destination}
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === "calculator" && (
          <GrantCalculator onCalculate={handleCalculate} />
        )}

        {viewMode === "erasmus_types" && (
          <div>
            <ErasmusGrantTypes onSelectGrant={handleGrantSelect} />
            
            {/* Summary section */}
            {grants && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Yhteenveto apurahoista
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Erasmus+ -apurahat</span>
                    <span className="font-medium text-gray-900">
                      {grants.erasmusGrants?.length || 0} kpl
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-semibold text-gray-900">Arvioitu kokonaistuki</span>
                    <span className="text-2xl font-bold text-[#FF5722]">
                      {grants.totalEstimatedSupport || 0}€
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Vinkki</h4>
          <p className="text-sm text-blue-800">
            Kannattaa hakea useita apurahoja samanaikaisesti. Voit yhdistää Erasmus+ -apurahan,
            Kela-tuen ja muita säätiöiden apurahoja maksimoidaksesi taloudellisen tukesi.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/profile/hakemukset"
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-medium text-gray-900">Hakemukset</span>
          </Link>
          <Link
            href="/profile/documents"
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <span className="text-sm font-medium text-gray-900">Dokumentit</span>
          </Link>
        </div>
      </div>
    </div>
  );
  type ViewMode = "categories" | "calculator" | "erasmus_types";
}
