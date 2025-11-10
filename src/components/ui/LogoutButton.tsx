"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

interface LogoutButtonProps {
  className?: string;
}

const translations = {
  en: {
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    yes: "Logout",
    cancel: "Cancel",
  },
  fi: {
    logout: "Kirjaudu ulos",
    confirmLogout: "Haluatko varmasti kirjautua ulos?",
    yes: "Kirjaudu ulos",
    cancel: "Peruuta",
  },
};

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const { handleLogout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const t = translations[language];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false);
    router.push("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={`hover:scale-110 text-white ${className}`}
        aria-label={t.logout}
      >
        <FiLogOut size={22} />
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-center bg-[var(--va-grey)]/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 border border-[var(--va-border)] shadow-lg">
            <h3 className="text-lg font-semibold text-[var(--typography)] mb-4">
              {t.confirmLogout}
            </h3>
            <div className="flex gap-4 mt-8 mb-2 justify-center">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-[var(--background)] bg-[var(--va-dark-grey)] rounded-md hover:scale-110"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[var(--va-orange)] text-white rounded-md hover:scale-110"
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
