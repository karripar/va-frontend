"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

function ToggleSwitch({ isMobileMenu = false }: { isMobileMenu?: boolean }) {
  const { language, toggleLanguage } = useLanguage();
  const isEn = language === "en";

  return (
    <div className={isMobileMenu ? "" : "absolute right-0 top-5 md:mr-6 mr-4"}>
      <button
        onClick={toggleLanguage}
        className="relative inline-flex h-8 w-20 items-center transition-colors duration-200 px-1 rounded-lg bg-[var(--background)] cursor-pointer"
        aria-label={`Switch to ${isEn ? "Finnish" : "English"}`}
      >
        {/* FI Label */}
        <span
          className="pt-1 absolute left-3 text-sm transition-colors duration-200 text-[var(--typography)]"
          style={{
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          FI
        </span>

        {/* EN Label */}
        <span
          className="pt-1 absolute right-2 text-sm transition-colors duration-200 text-[var(--typography)]"
          style={{
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          EN
        </span>

        {/* Slider */}
        <span
          className={`flex justify-center items-center h-6 w-9 transform rounded-lg transition-transform duration-200 ${
            isEn ? "translate-x-9" : "translate-x-0"
          } text-sm pt-1 text-[var(--background)]`}
          style={{
            backgroundColor: "var(--va-orange)",
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          {isEn ? "EN" : "FI"}
        </span>
      </button>
    </div>
  );
}

export default ToggleSwitch;
