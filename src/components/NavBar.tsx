"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ToggleSwitch from "./LanguageToggle";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

// navigaation kategoriat
const navigationCategories = [
  {
    id: "exchange",
    title: "Opiskelijavaihto",
    titleEn: "Student Exchange",
    links: [
      {
        href: "/instructions",
        label: "Hakuprosessi ja ohjeet",
        labelEn: "Application Process",
      },
      {
        href: "/destinations",
        label: "Vaihtokohteet",
        labelEn: "Destinations",
      },
      {
        href: "/grants",
        label: "Apurahat ja kustannukset",
        labelEn: "Grants & Costs",
      },
    ],
  },
  {
    id: "community",
    title: "Yhteisö ja tuki",
    titleEn: "Community & Support",
    links: [
      {
        href: "/tips",
        label: "Kokemukset ja vinkit",
        labelEn: "Experiences & Tips",
      },
      { href: "/ai-chat", label: "AI Chat ja FAQ", labelEn: "AI Chat & FAQ" },
      { href: "/contact", label: "Ota yhteyttä", labelEn: "Contact" },
    ],
  },
  {
    id: "user",
    title: "Käyttäjän asetukset",
    titleEn: "User Settings",
    links: [
      { href: "/profile", label: "Profiili", labelEn: "Profile" },
      { href: "/admin", label: "Ylläpito", labelEn: "Admin Panel", requiresAdmin: true },
    ],
  },
];

const hamburgerLinks = [
  { href: "/", label: "Etusivu", labelEn: "Home" },
  {
    href: "/instructions",
    label: "Hakuprosessi ja ohjeet",
    labelEn: "Application Process",
  },
  { href: "/destinations", label: "Vaihtokohteet", labelEn: "Destinations" },
  {
    href: "/grants",
    label: "Apurahat ja kustannukset",
    labelEn: "Grants & Costs",
  },
  {
    href: "/tips",
    label: "Kokemukset ja vinkit",
    labelEn: "Experiences & Tips",
  },
  { href: "/ai-chat", label: "AI Chat ja FAQ", labelEn: "AI Chat & FAQ" },
  { href: "/contact", label: "Ota yhteyttä", labelEn: "Contact" },
  { href: "/admin", label: "Ylläpito", labelEn: "Admin Panel", requiresAdmin: true },
];

// get label based on language
const getLabel = (language: string, label: string, labelEn: string): string => {
  return language === "en" ? labelEn : label;
};

// navigation
const Navbar = () => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.user_level_id === 2;

  // get the current page's name to display it in the nav
  const getCurrentPageInfo = () => {
    for (const category of navigationCategories) {
      if (category.links) {
        const link = category.links.find((link) => link.href === pathname);
        if (link)
          return {
            category: category.title,
            page: link.label,
            pageEn: link.labelEn,
          };
      }
    }
    return {
      category: "Vaihtoaktivaattori",
      page: "Vaihtoaktivaattori",
      pageEn: "Vaihtoaktivaattori",
    };
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
          <div className="mx-auto h-20 flex items-center justify-between px-2 my-auto">
            <button
              aria-label={
                mobileMenuOpen
                  ? language === "en"
                    ? "Close menu"
                    : "Sulje valikko"
                  : language === "en"
                  ? "Open menu"
                  : "Avaa valikko"
              }
              className="cursor-pointer p-2 -ml-2 z-60"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "" : <FiMenu size={22} />}
            </button>
            <h1
              className="tracking-widest text-md text-center px-2"
              style={{ fontFamily: "var(--font-machina-bold)" }}
            >
              {getLabel(language, currentPageInfo.page, currentPageInfo.pageEn)}
            </h1>
            <Link href={"/profile"}>
              <FiUser
                className="hover:scale-110 transition-transform duration-300"
                size={22}
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
            className="px-6 py-6 text-center sm:text-2xl text-md shadow-lg tracking-widest relative items-center flex justify-center"
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
            {getLabel(language, currentPageInfo.page, currentPageInfo.pageEn)}
            <ToggleSwitch />
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
                    {getLabel(language, category.title, category.titleEn)}
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
                        {category.links
                          .filter(link => !link.requiresAdmin || isAdmin)
                          .map((link) => (
                            <Link
                            key={link.href}
                            href={link.href}
                            className="block px-6 py-3 m-1 text-md duration-200 tracking-wide "
                            style={{
                              fontFamily: "var(--font-montreal-mono)",
                              textDecoration:
                                pathname === link.href
                                  ? "underline var(--va-orange) .1rem"
                                  : "none",
                              textUnderlineOffset: ".3rem",
                            }}
                            onMouseEnter={(e) => {
                              if (pathname !== link.href) {
                                e.currentTarget.style.textDecoration =
                                  "underline var(--typography) .1rem";
                                e.currentTarget.style.textUnderlineOffset =
                                  ".3rem";
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
                            {getLabel(language, link.label, link.labelEn)}
                          </Link>
                        ))}
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
          <ToggleSwitch isMobileMenu={true} />
          <button
            aria-label={language === "en" ? "Close menu" : "Sulje valikko"}
            onClick={closeMobileMenu}
            className="p-2"
          >
            <FiX className="cursor-pointer" size={26} />
          </button>
        </div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
          {hamburgerLinks
            .filter(link => !link.requiresAdmin || isAdmin)
            .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-3 text-md tracking-wide border-b border-b-[var(--va-border)]`}
              style={{
                fontFamily: "var(--font-montreal-mono-medium)",
                textDecoration:
                  pathname === link.href
                    ? "underline var(--va-orange) .1rem"
                    : "none",
                textUnderlineOffset: ".3rem",
              }}
              onMouseEnter={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.textDecoration =
                    "underline var(--typography) .1rem";
                  e.currentTarget.style.textUnderlineOffset = ".3rem";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== link.href) {
                  e.currentTarget.style.color = "var(--typography)";
                  e.currentTarget.style.textDecoration = "none";
                }
              }}
            >
              {getLabel(language, link.label, link.labelEn)}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
