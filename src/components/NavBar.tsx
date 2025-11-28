"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import ToggleSwitch from "./LanguageToggle";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

// navigaation kategoriat ja sivun käännökset
type NavLink = { href: string; label: string; requiresAdmin?: boolean };
type NavCategory = { id: string; title: string; links?: NavLink[] };

const Navbar = () => {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const adminLevels = [2, 3];
  const isAdmin = user && adminLevels.includes(Number(user.user_level_id));

  const translations = {
    fi: {
      openMenu: "Avaa valikko",
      closeMenu: "Sulje valikko",
      defaultTitle: "Go Exchange",
      nav: {
        categories: [
          {
            id: "exchange",
            title: "Opiskelijavaihto",
            links: [
              { href: "/instructions", label: "Hakuprosessi ja ohjeet" },
              { href: "/destinations", label: "Vaihtokohteet" },
              {
                href: "/profile/hakemukset?tab=budget",
                label: "Apurahat ja kustannukset",
              },
            ],
          },
          {
            id: "community",
            title: "Yhteisö ja tuki",
            links: [
              { href: "/tips", label: "Kokemukset ja vinkit" },
              { href: "/ai-chat", label: "AI Chat ja FAQ" },
              { href: "/contact", label: "Ota yhteyttä" },
            ],
          },
          {
            id: "user",
            title: "Käyttäjän asetukset",
            links: [
              { href: "/profile", label: "Profiili" },
              { href: "/admin", label: "Ylläpito", requiresAdmin: true },
            ],
          },
        ],
        hamburger: [
          { href: "/", label: "Etusivu" },
          { href: "/instructions", label: "Hakuprosessi ja ohjeet" },
          { href: "/destinations", label: "Vaihtokohteet" },
          {
            href: "/profile/hakemukset?tab=budget",
            label: "Apurahat ja kustannukset",
          },
          { href: "/tips", label: "Kokemukset ja vinkit" },
          { href: "/ai-chat", label: "AI Chat ja FAQ" },
          { href: "/contact", label: "Ota yhteyttä" },
          { href: "/admin", label: "Ylläpito", requiresAdmin: true },
        ],
      },
    },
    en: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      defaultTitle: "Go Exchange",
      nav: {
        categories: [
          {
            id: "exchange",
            title: "Student Exchange",
            links: [
              { href: "/instructions", label: "Application Process" },
              { href: "/destinations", label: "Destinations" },
              {
                href: "/profile/hakemukset?tab=budget",
                label: "Grants & Costs",
              },
            ],
          },
          {
            id: "community",
            title: "Community & Support",
            links: [
              { href: "/tips", label: "Experiences & Tips" },
              { href: "/ai-chat", label: "AI Chat & FAQ" },
              { href: "/contact", label: "Contact" },
            ],
          },
          {
            id: "user",
            title: "User Settings",
            links: [
              { href: "/profile", label: "Profile" },
              { href: "/admin", label: "Admin Panel", requiresAdmin: true },
            ],
          },
        ],
        hamburger: [
          { href: "/", label: "Home" },
          { href: "/instructions", label: "Application Process" },
          { href: "/destinations", label: "Destinations" },
          { href: "/profile/hakemukset?tab=budget", label: "Grants & Costs" },
          { href: "/tips", label: "Experiences & Tips" },
          { href: "/ai-chat", label: "AI Chat & FAQ" },
          { href: "/contact", label: "Contact" },
          { href: "/admin", label: "Admin Panel", requiresAdmin: true },
        ],
      },
    },
  };

  const localizedNavigation: NavCategory[] =
    translations[language]?.nav?.categories || translations.fi.nav.categories;
  const hamburgerLinksLocalized: NavLink[] =
    translations[language]?.nav?.hamburger || translations.fi.nav.hamburger;

  // get the current page's name to display it in the nav
  const getCurrentPageInfo = () => {
    for (const category of localizedNavigation) {
      if (category.links) {
        const link = category.links.find(
          (link: NavLink) => link.href === pathname
        );
        if (link) return { category: category.title, page: link.label };
      }
    }
    return {
      category:
        translations[language]?.defaultTitle || translations.fi.defaultTitle,
      page:
        translations[language]?.defaultTitle || translations.fi.defaultTitle,
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
          <div className="mx-auto h-15 flex items-center justify-between px-2 my-auto">
            <button
              aria-label={
                mobileMenuOpen
                  ? translations[language]?.closeMenu ||
                    translations.fi.closeMenu
                  : translations[language]?.openMenu || translations.fi.openMenu
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
              {currentPageInfo.page}
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
            {currentPageInfo.page}
            <ToggleSwitch />
          </div>
          <div className="flex flex-row m-auto z-10 gap-16 justify-center px-4">
            {localizedNavigation.map((category: NavCategory) => (
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
                        {category.links.filter(
                          (link: NavLink) => !link.requiresAdmin || isAdmin
                        ).length > 0
                          ? category.links
                              .filter(
                                (link: NavLink) =>
                                  !link.requiresAdmin || isAdmin
                              )
                              .map((link: NavLink) => (
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
                                      e.currentTarget.style.textDecoration =
                                        "none";
                                    }
                                  }}
                                >
                                  {link.label}
                                </Link>
                              ))
                          : null}
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
          className="h-15 flex items-center justify-between px-4 tracking-wide"
          style={{
            backgroundColor: "var(--va-orange)",
            color: "var(--background)",
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          <ToggleSwitch isMobileMenu={true} />
          <button
            aria-label={
              translations[language]?.closeMenu || translations.fi.closeMenu
            }
            onClick={closeMobileMenu}
            className="p-2"
          >
            <FiX className="cursor-pointer" size={24} />
          </button>
        </div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-5rem)]">
          {hamburgerLinksLocalized
            .filter((link: NavLink) => !link.requiresAdmin || isAdmin)
            .map((link: NavLink) => (
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
                {link.label}
              </Link>
            ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
