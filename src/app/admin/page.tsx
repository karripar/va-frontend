"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LogoutButton from "@/components/ui/LogoutButton";
import { FaArrowLeft } from "react-icons/fa6";

const AdminControlPanel = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Admin Panel",
      backToHome: "Back to Home",
      logout: "Logout",
      confirmLogout: "Are you sure you want to logout?",
      welcome:
        "Welcome to the admin panel. Here you can manage administrators and uploaded documents.",
      adminManagement: "Admin Management",
      userManagement: "User Management",
      documentManagement: "Document Management",
    },
    fi: {
      title: "Hallintapaneeli",
      backToHome: "Takaisin etusivulle",
      logout: "Kirjaudu ulos",
      confirmLogout: "Haluatko varmasti kirjautua ulos?",
      welcome:
        "Tervetuloa hallintapaneeliin. Täällä voit hallita ylläpitäjiä ja ladattuja dokumentteja.",
      adminManagement: "Ylläpitäjien hallinta",
      userManagement: "Käyttäjien hallinta",
      documentManagement: "Dokumenttien hallinta",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen">
      <div className="bg-[var(--va-orange)] text-white px-4 py-6 flex items-center justify-center relative h-15 sm:h-20">
        <Link
          href="/"
          className="absolute left-6 text-white hover:scale-110"
          aria-label={t.backToHome}
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1
          className="tracking-widest sm:text-2xl text-xl"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {t.title}
        </h1>
        <LogoutButton className="absolute right-6 text-white hover:scale-110" />
      </div>

      {/* Content - White background */}
      <div className="bg-white min-h-screen">
        <div className="p-6 max-w-2xl mx-auto">
          {/* Welcome text */}
          <div className="flex flex-col items-center mb-8">
            <p
              className="text-gray-800 text-center text-base mb-2 font-normal mt-4"
              style={{ fontFamily: "var(--font-montreal-mono)" }}
            >
              {t.welcome}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3">
            <Link
              href="/admin/controls/admins"
              className="block w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] text-[var(--typography)] hover:text-white transition-colors"
            >
              <div
                className="flex justify-between items-center"
                style={{ fontFamily: "var(--font-machina-regular)" }}
              >
                <span className="font-medium text-lg tracking-wide">
                  {t.adminManagement}
                </span>
                <span>›</span>
              </div>
            </Link>

            <Link
              href="/admin/controls/users"
              className="block w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] text-[var(--typography)] hover:text-white transition-colors"
            >
              <div
                className="flex justify-between items-center"
                style={{ fontFamily: "var(--font-machina-regular)" }}
              >
                <span className="font-medium text-lg tracking-wide">
                  {t.userManagement}
                </span>
                <span>›</span>
              </div>
            </Link>

            <Link
              href="/admin/fileManagement"
              className="block w-full p-4 rounded-lg bg-[var(--va-orange-50)] hover:bg-[var(--va-orange)] text-[var(--typography)] hover:text-white transition-colors"
            >
              <div
                className="flex justify-between items-center"
                style={{ fontFamily: "var(--font-machina-regular)" }}
              >
                <span className="font-medium text-lg tracking-wide">
                  {t.documentManagement}
                </span>
                <span>›</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControlPanel;
