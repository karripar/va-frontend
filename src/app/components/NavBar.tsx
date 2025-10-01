"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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

// navigation
const Navbar = () => {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  return (
    <nav>
      {/* header */}
      <div
        className="px-6 py-8 text-center font-bold text-2xl shadow-lg tracking-wider"
        style={{
          color: "var(--white)",
          backgroundColor: "var(--metropolia-orange)",
          fontFamily: "var(--font-machina-bold)",
        }}
      >
        {currentPageInfo.page}
      </div>

      <div
        className="navbar shadow-md"
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
                className={`h-full lg:py-5 py-4 font-bold text-md duration-200 tracking-wide underline-center ${
                  activeCategory === category.id ? 'active' : ''
                }`}
                style={{
                  fontFamily: "var(--font-montreal-mono-medium)",
                  
                }}
                
              >
                {category.title}
              </button>

              {/* category content */}
              {activeCategory === category.id && (
                <div className="absolute shadow-lg left-1/2 transform -translate-x-1/2 top-full w-50 z-20">
                  {category.links && (
                    <div className="py-2">
                      {category.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-6 py-3 text-md duration-200 tracking-wide"
                          style={{
                            fontFamily: "var(--font-montreal-mono)",
                            textDecoration:
                              pathname === link.href
                                ? "underline wavy #ff5000 .1rem"
                                : "none",
                            textUnderlineOffset: ".2rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration =
                              "underline wavy var(--typography) .1rem";
                            e.currentTarget.style.textUnderlineOffset = ".2rem";
                          }}
                          onMouseLeave={(e) => {
                            if (pathname !== link.href) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
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
    </nav>
  );
};

export default Navbar;
