import React from "react";

function ToggleSwitch({
  isMobileMenu = false,
  isEn,
  onToggle,
}: {
  isMobileMenu?: boolean;
  isEn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={isMobileMenu ? "" : "absolute left-0 top-5 md:ml-6 ml-4"}>
      <button
        onClick={onToggle}
        className="relative inline-flex h-8 w-20 items-center transition-colors duration-200 px-1 rounded-lg bg-[var(--background)] cursor-pointer"
        aria-label={`Switch to ${isEn ? "Finnish" : "English"}`}
      >
        {/* FI Label */}
        <span
          className="pt-1 absolute left-2 text-sm transition-colors duration-200 text-[var(--typography)]"
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
          className={`flex justify-center items-center h-6 w-10 transform rounded-lg transition-transform duration-200 ${
            isEn ? "translate-x-8" : "translate-x-0"
          } flex items-center justify-center text-sm pt-1 text-[var(--background)]`}
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
