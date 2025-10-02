"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

// navigaation kategoriat
const navigationCategories = [
  {
    id: "exchange",
    title: "Opiskelijavaihto",
    links: [
      { href: "/hakuprosessi", label: "Hakuprosessi ja ohjeet" },
      { href: "/vaihtokohteet", label: "Vaihtokohteet" },
      { href: "/apurahat", label: "Apurahat ja kustannukset" },
    ],
  },
  {
    id: "community",
    title: "Yhteisö ja tuki",
    links: [
      { href: "/kokemukset", label: "Kokemukset ja vinkit" },
      { href: "/ai-chat", label: "AI Chat ja FAQ" },
      { href: "/ota-yhteytta", label: "Ota yhteyttä" },
    ],
  },
  {
    id: "user",
    title: "Käyttäjän asetukset",
    links: [
      { href: "/profiili", label: "Profiili" },
      { href: "/kirjaudu-ulos", label: "Kirjaudu ulos" },
    ],
  },
];

// flatten all links for mobile menu
const allNavLinks = navigationCategories.flatMap((category) =>
  category.links ? category.links : []
);

// navigation
const Navbar = () => {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* mobile hamburger for small screens */}
      <header className="sticky top-0 z-30 bg-[var(--va-orange)] text-[var(--background)] text-xl">
        <div className="mx-auto px-4 h-20 flex items-center justify-between md:hidden">
          <button
            aria-label={mobileMenuOpen ? "Sulje valikko" : "Avaa valikko"}
            className="p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div
            className="tracking-wide text-md"
            style={{ fontFamily: "var(--font-machina-bold)" }}
          >
            {currentPageInfo.page}
          </div>
          <div className="w-6" />
        </div>

        {/* Header */}
        <div
          className="hidden md:block px-6 py-8 text-center sm:text-2xl text-md shadow-lg tracking-wider"
          style={{
            color: "var(--background)",
            backgroundColor: "var(--va-orange)",
            fontFamily: "var(--font-machina-bold)",
          }}
        >
          {currentPageInfo.page}
        </div>
      </header>

      {/* Hamburger menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden
        />
      )}
      <aside
        className={`md:hidden fixed z-40 top-0 left-0 h-full w-[280px] bg-[var(--background)] shadow-lg transform transition-transform duration-200 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sivunavigaatio"
      >
        <div
          className="h-20 flex items-center px-4 font-semibold tracking-wide"
          style={{
            backgroundColor: "var(--va-orange)",
            color: "var(--background)",
            fontFamily: "var(--font-machina-bold)",
          }}
        ></div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-2rem)]">
          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-sm font-semibold tracking-wide`}
              style={{
                fontFamily: "var(--font-montreal-mono)",
                textDecoration:
                  pathname === link.href
                    ? "underline wavy var(--va-orange-50) .1rem"
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
        <div className="absolute bottom-0 inset-x-0 p-4 border-t">
          <button
            className="w-full rounded-full bg-[var(--background)] border px-4 py-2 text-xs font-bold tracking-wide"
            style={{
              color: "var(--va-orange)",
              fontFamily: "var(--font-montreal-mono-medium)",
            }}
          >
            KIRJAUDU ULOS
          </button>
          <button
            aria-label="Sulje valikko"
            onClick={closeMobileMenu}
            className="absolute -right-6 bottom-4 bg-[var(--background)] rounded-full p-2 border shadow"
          >
            <FiX />
          </button>
        </div>
      </aside>

      {/* Desktop Navigation */}
      <div
        className="hidden md:block navbar shadow-md"
        style={{
          color: "var(--typography)",
        }}
      >
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
                className={`h-full py-5 font-bold text-md duration-200 tracking-wide underline-center ${
                  activeCategory === category.id ? "active" : ""
                }`}
                style={{
                  fontFamily: "var(--font-montreal-mono-medium)",
                }}
              >
                {category.title}
              </button>

              {/* category content */}
              {activeCategory === category.id && (
                <div className="absolute shadow-lg left-1/2 transform -translate-x-1/2 top-full w-60 bg-[var(--background)] border border-[var(--va-grey-50)] rounded-b-lg">
                  {category.links && (
                    <div>
                      {category.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-6 py-3 text-md duration-200 tracking-wide"
                          style={{
                            fontFamily: "var(--font-montreal-mono)",
                            textDecoration:
                              pathname === link.href
                                ? "underline wavy var(--va-orange-50) .1rem"
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
                              e.currentTarget.style.color = "var(--typography)";
                              e.currentTarget.style.textDecoration = "none";
                            }
                          }}
                        >
                          {link.label}
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
    </>
  );
};

export default Navbar;
