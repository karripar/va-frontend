import React, { useState } from "react";

function ToggleSwitch({ isMobileMenu = false }: { isMobileMenu?: boolean }) {
  // FI is default language
  const [isEn, setIsEn] = useState(false);

  const handleToggle = () => {
    setIsEn((prevState) => !prevState);
  };

  return (
    <div className={isMobileMenu ? "" : "absolute left-0 top-6 md:ml-6 ml-4"}>
      <button
        onClick={handleToggle}
        className="relative inline-flex h-8 w-20 items-center transition-colors duration-200 px-1 rounded-lg bg-[var(--background)]"
        aria-label={`Switch to ${isEn ? "Finnish" : "English"}`}
      >
        {/* FI Label */}
        <span
          className="absolute left-2 text-sm transition-colors duration-200 text-[var(--typography)]"
          style={{
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          FI
        </span>

        {/* EN Label */}
        <span
          className="absolute right-2 text-sm transition-colors duration-200 text-[var(--typography)]"
          style={{
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          EN
        </span>

        {/* Slider */}
        <span
          className={`inline-block h-6 w-10 transform rounded-lg transition-transform duration-200 ${
            isEn ? "translate-x-8" : "translate-x-0"
          }`}
          style={{ backgroundColor: "var(--va-orange)" }}
        />
      </button>
    </div>
  );
}

export default ToggleSwitch;
