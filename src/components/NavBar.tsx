"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ToggleSwitch from "./LanguageToggle";
import Image from "next/image";

// navigaation kategoriat
const navigationCategories = [
  {
    id: "exchange",
    title: "Opiskelijavaihto",
    links: [
      { href: "/instructions", label: "Hakuprosessi ja ohjeet" },
      { href: "/destinations", label: "Vaihtokohteet" },
      { href: "/profile/hakemukset?tab=budget", label: "Apurahat ja kustannukset" },
    ],
  },
  {
    id: "community",
    title: "Yhteisö ja tuki",
    links: [
      { href: "/tips", label: "Kokemukset ja vinkit" },
      { href: "/faq", label: "FAQ" },
      { href: "/ai-chat", label: "AI Chat" },
      { href: "/contact", label: "Ota yhteyttä" },
    ],
  },
  {
    id: "user",
    title: "Käyttäjän asetukset",
    links: [{ href: "/profile", label: "Profiili" }],
  },
];

const hamburgerLinks = [
  { href: "/", label: "Etusivu" },
  { href: "/instructions", label: "Hakuprosessi ja ohjeet" },
  { href: "/destinations", label: "Vaihtokohteet" },
  { href: "/profile/hakemukset?tab=budget", label: "Apurahat ja kustannukset" },
  { href: "/tips", label: "Kokemukset ja vinkit" },
  { href: "/faq", label: "FAQ" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/contact", label: "Ota yhteyttä" },
];

// navigation
const Navbar = () => {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEn, setIsEn] = useState(false);

  const handleLanguageToggle = () => {
    setIsEn((prevState) => !prevState);
  };

  // log out... will be done later
  const handleLogout = () => {
    console.log("Logging out...");
    // TODO: clear localStorage/sessionStorage + authentication tokens

    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
  };

  const getCurrentPageInfo = () => {
    for (const category of navigationCategories) {
      if (category.links) {
        const link = category.links.find((link) => link.href === pathname);
        if (link) return { category: category.title, page: link.label };
      }
    }
    return { category: "Vaihtoaktivaattori", page: "Vaihtoaktivaattori" };
  };

  const currentPageInfo = getCurrentPageInfo();

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-50">
        <header className="bg-[var(--va-orange)] text-[var(--background)] text-xl sm:text-md px-2 shadow-lg">
          <div className="mx-auto px-4 h-20 flex items-center justify-between">
            <button
              aria-label={mobileMenuOpen ? "Sulje valikko" : "Avaa valikko"}
              className="cursor-pointer p-2 -ml-2 z-60"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "" : <FiMenu size={26} />}
            </button>
            <div
              className="tracking-wide text-md text-center px-2"
              style={{ fontFamily: "var(--font-machina-bold)" }}
            >
              {currentPageInfo.page}
            </div>
            <Link href={"/profile"}>
              <FiUser
                className="hover:scale-110 transition-transform duration-300"
                size={26}
              />
            </Link>
          </div>
        </header>
      </div>

      {/* Desktop header and navigation*/}
      <div className="hidden md:block sticky top-0 z-50 bg-[var(--background)]">
        <div
          className="navbar shadow-md bg-[var(--background)]"
          style={{
            color: "var(--typography)",
          }}
        >
          <div
            className="px-6 py-6 text-center sm:text-2xl text-md shadow-lg tracking-wider relative items-center flex justify-center"
            style={{
              color: "var(--background)",
              backgroundColor: "var(--va-orange)",
              fontFamily: "var(--font-machina-bold)",
            }}
          >
            <Link href={"/"}>
              <Image
              className="absolute left-0 ml-4 top-0 mt-2"
                alt="Logo"
                src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-05.png"
                width={70}
                height={70}
              />
            </Link>
            {currentPageInfo.page}
            <ToggleSwitch isEn={isEn} onToggle={handleLanguageToggle} />
          </div>
          <div className="flex flex-row m-auto z-10 gap-16 justify-center px-4">
            {navigationCategories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* category header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="h-full py-5 text-md flex flex-row gap-4"
                  style={{
                    fontFamily: "var(--font-montreal-mono-medium)",
                  }}
                >
                  <span
                    className={`duration-200 tracking-wide underline-center ${
                      activeCategory === category.id ? "active" : ""
                    }`}
                  >
                    {category.title}
                  </span>
                  <span
                    className={`text-[var(--va-orange)] pl-1 transition-transform duration-300 ${
                      activeCategory === category.id ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* category content */}
                {activeCategory === category.id && (
                  <div className="absolute shadow-lg left-1/2 transform -translate-x-1/2 top-full w-60 lg:w-80 bg-[var(--background)] border border-[var(--va-border)] rounded-b-lg">
                    {category.links && (
                      <div>
                        {category.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-6 py-3 m-1 text-md duration-200 tracking-wide "
                            style={{
                              fontFamily: "var(--font-montreal-mono)",
                              textDecoration:
                                pathname === link.href
                                  ? "underline wavy var(--va-orange) .1rem"
                                  : "none",
                              textUnderlineOffset: ".2rem",
                            }}
                            onMouseEnter={(e) => {
                              if (pathname !== link.href) {
                                e.currentTarget.style.textDecoration =
                                  "underline wavy var(--typography) .1rem";
                                e.currentTarget.style.textUnderlineOffset =
                                  ".2rem";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (pathname !== link.href) {
                                e.currentTarget.style.color =
                                  "var(--typography)";
                                e.currentTarget.style.textDecoration = "none";
                              }
                            }}
                          >
                            {link.label}
                          </Link>
                        ))}
                        {category.id === "user" && (
                          <button
                            onClick={handleLogout}
                            className="px-6 py-2 mx-6 block mt-3 mb-4 text-sm uppercase duration-200 tracking-wider bg-[var(--va-orange)] hover:scale-105 rounded-lg"
                            style={{
                              fontFamily: "var(--font-machina-bold)",
                              color: "var(--background)",
                            }}
                          >
                            Kirjaudu ulos
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hamburger menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] md:hidden"
          onClick={closeMobileMenu}
          aria-hidden
        />
      )}
      <aside
        className={`md:hidden fixed z-[60] top-0 left-0 h-full w-[280px] bg-[var(--background)] shadow-lg transform transition-transform duration-200 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sivunavigaatio"
      >
        <div
          className="h-20 flex items-center justify-between px-4 tracking-wide"
          style={{
            backgroundColor: "var(--va-orange)",
            color: "var(--background)",
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          <ToggleSwitch
            isMobileMenu={true}
            isEn={isEn}
            onToggle={handleLanguageToggle}
          />
          <button
            aria-label="Sulje valikko"
            onClick={closeMobileMenu}
            className="p-2"
          >
            <FiX className="cursor-pointer" size={26} />
          </button>
        </div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
          {hamburgerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-3 text-md tracking-wide border-b border-b-[var(--va-border)]`}
              style={{
                fontFamily: "var(--font-montreal-mono-medium)",
                textDecoration:
                  pathname === link.href
                    ? "underline wavy var(--va-orange) .1rem"
                    : "none",
                textUnderlineOffset: ".2rem",
              }}
              onMouseEnter={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.textDecoration =
                    "underline wavy var(--typography) .1rem";
                  e.currentTarget.style.textUnderlineOffset = ".2rem";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.color = "var(--typography)";
                  e.currentTarget.style.textDecoration = "none";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
