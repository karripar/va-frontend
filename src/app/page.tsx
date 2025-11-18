"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMessageSquare, FiGlobe, FiFileText } from "react-icons/fi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { useLanguage } from "@/context/LanguageContext";

// get label based on language
const getLabel = (language: string, label: string, labelEn: string): string => {
  return language === "en" ? labelEn : label;
};

// translations for hero section and cards
const translations = {
  heroTitle: {
    fi: "Tervetuloa Metropolian vaihto­sovellukseen!",
    en: "Welcome to the Exchange Application!",
  },
  heroSubtitle: {
    fi: "Löydä hakuohjeet, kohdemaat, apurahat ja vinkit yhdestä paikasta.",
    en: "Find application instructions, destinations, grants, and tips all in one place.",
  },
  cards: [    
    {
      titleFi: "VAIHTOON HAKEMINEN",
      titleEn: "APPLY FOR EXCHANGE",
      descriptionFi: "Tutustu hakuprosessiin ja ohjeisiin askel askeleelta.",
      descriptionEn:
        "Learn about the application process and view step-by-step instructions.",
      href: "/instructions",
    },
    {
      titleFi: "APURAHAT",
      titleEn: "GRANTS & COSTS",
      descriptionFi: "Katso apurahat ja mahdolliset kustannukset.",
      descriptionEn: "Check out grants and potential costs.",
      href: "/profile/hakemukset?tab=apurahat",
    },
    {
      titleFi: "KOHDEMAAT",
      titleEn: "DESTINATIONS",
      descriptionFi: "Selaa partnerikouluja ja vaihtokohteita.",
      descriptionEn: "Browse partner universities and exchange destinations.",
      href: "/destinations",
    },
    {
      titleFi: "AI–CHAT JA FAQ",
      titleEn: "AI CHAT & FAQ",
      descriptionFi: "Kysy kysymyksiä AI:lta tai selaa usein kysyttyjä.",
      descriptionEn: "Ask questions from AI or browse frequently asked questions.",
      href: "/ai-chat",
    },
  ],
  whyExchange: {
    fi: "MIKSI LÄHTEÄ VAIHTOON?",
    en: "WHY GO TO EXCHANGE?",
  },
  benefits: [
    {
      titleFi: "KANSAINVÄLINEN KOKEMUS",
      titleEn: "INTERNATIONAL EXPERIENCE",
      descriptionFi:
        "Kehitä kulttuurista ymmärrystä ja kansainvälistä näkökulmaa",
      descriptionEn:
        "Develop cultural understanding and international perspective",
    },
    {
      titleFi: "AMMATILLINEN KASVU",
      titleEn: "PROFESSIONAL GROWTH",
      descriptionFi:
        "Opi uusia menetelmiä ja laajenna osaamistasi eri näkökulmista",
      descriptionEn:
        "Learn new methods and expand your skills from different perspectives",
    },
    {
      titleFi: "URAETU",
      titleEn: "CAREER ADVANTAGE",
      descriptionFi:
        "Erottaudu työmarkkinoilla ja verkostoidu kansainvälisesti",
      descriptionEn: "Stand out in the job market and network internationally",
    },
    {
      titleFi: "HENKILÖKOHTAINEN KASVU",
      titleEn: "PERSONAL GROWTH",
      descriptionFi:
        "Vahvista itseluottamusta ja sopeutumiskykyä uusissa tilanteissa",
      descriptionEn: "Strengthen confidence and adaptability in new situations",
    },
  ],
  chatButton: {
    fi: "CHAT",
    en: "CHAT",
  },
};

export default function Home() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--va-orange-50)] shadow-lg mb-6 max-w-10xl mx-auto">
        <div className="relative mx-auto flex gap-2 flex-row justify-center">
          <div className="flex flex-col pl-8 pr-8 lg:pl-10 md:pl-12 md:pt-14 sm:pb-10 lg:max-w-xl xl:max-w-3xl md:max-w-md md:text-left text-center pt-12 pb-14 ">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wider text-[var(--typography)] uppercase pb-8 xl:leading-15 lg:leading-12 leading-10"
              style={{ fontFamily: "var(--font-machina-bold)" }}
            >
              {getLabel(
                language,
                translations.heroTitle.fi,
                translations.heroTitle.en
              )}
            </h1>
            <p
              className="text-lg md:text-xl xl:text-2xl text-[var(--typography)]"
              style={{
                fontFamily: "var(--font-montreal-mono-medium)",
              }}
            >
              {getLabel(
                language,
                translations.heroSubtitle.fi,
                translations.heroSubtitle.en
              )}
            </p>
          </div>
          <div className="relative flex-1 h-[400px] hidden md:flex xl:max-w-200">
            <svg
              viewBox="0 0 550 500"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full block w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <clipPath id="mClip" clipPathUnits="userSpaceOnUse">
                  <path
                    d="M1,521.09V1h0v443.36c.19-47,13.21-111.89,39.01-183.56C91.66,117.32,174.98,1,226.11,1
          c29.66,0,41.97,39.14,37.01,100C298.85,40.78,337.42,1,364.99,1s37.5,39.78,29.88,100
          C433.73,40.14,474.21,1,503.87,1c51.13,0,50.72,116.32-.94,259.79-51.65,143.48-134.97,259.79-186.1,259.79
          -36.26,0-46.59-58.52-31.11-143.72-28.89,40.61-57.79,65.78-79.71,65.78s-32.7-25.17-32.35-65.78
          c-45.86,85.21-98.31,143.72-134.58,143.72-25.5,0-38.18-28.94-38.07-75.76v76.27h0Z"
                  />
                </clipPath>
              </defs>

              <image
                href="/Marjaana_Malkamaki_KEKSI_Metropolia_Heta_Tuuri_2022-9278_nettikoko.jpg"
                x="-80"
                y="-100"
                width="620"
                height="600"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#mClip)"
              />
            </svg>
          </div>
        </div>
      </section>
      {/* Main content */}
      <main className="lg:mx-auto lg:px-10 py-6 rounded-md">
        {/* Action cards */}
        <div className="bg-[var(--va-grey-50)]  lg:max-w-6xl lg:mx-auto mx-4 p-8 mb-16 rounded-md">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 uppercase"
            style={{ fontFamily: "var(--font-machina-bold)" }}
          >
            {translations.cards.map((card, index) => {
              const icons = [
                <FiFileText
                  key="file"
                  className="text-[var(--va-orange)]"
                  size={38}
                />,
                <RiMoneyEuroCircleLine
                  key="money"
                  className="text-[var(--va-orange)]"
                  size={38}
                />,
                <FiGlobe
                  key="globe"
                  className="text-[var(--va-orange)]"
                  size={38}
                />,
                <FiMessageSquare
                  key="message"
                  className="text-[var(--va-orange)]"
                  size={38}
                />,
              ];
              return (
                <Card
                  key={card.href}
                  icon={icons[index]}
                  title={getLabel(language, card.titleFi, card.titleEn)}
                  description={getLabel(
                    language,
                    card.descriptionFi,
                    card.descriptionEn
                  )}
                  href={card.href}
                />
              );
            })}
          </div>
        </div>

        <section className="pt-16 pb-20 bg-[var(--va-grey-50)] lg:max-w-6xl lg:mx-auto mx-4 rounded-md">
          <div className="px-6 lg:px-10">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl mb-4 tracking-wider"
                style={{ fontFamily: "var(--font-machina-bold)" }}
              >
                {getLabel(
                  language,
                  translations.whyExchange.fi,
                  translations.whyExchange.en
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {translations.benefits.map((benefit, index) => (
                <div key={index} className="text-center p-4">
                  <div className="mx-auto mb-4 flex items-center justify-center">
                    <Image
                      src={
                        [
                          "/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png",
                          "/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-03.png",
                          "/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-09.png",
                          "/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-13.png",
                        ][index]
                      }
                      alt=""
                      width={index === 1 || index === 3 ? 140 : 80}
                      height={index === 1 || index === 3 ? 140 : 80}
                      className="h-30 w-30"
                    />
                  </div>
                  <h3
                    className={`text-lg mb-4 tracking-wide ${
                      index === 2 ? "lg:mb-11 mb-2" : ""
                    }`}
                    style={{ fontFamily: "var(--font-machina-bold)" }}
                  >
                    {getLabel(language, benefit.titleFi, benefit.titleEn)}
                  </h3>
                  <p
                    className="text-md"
                    style={{ fontFamily: "var(--font-montreal-mono)" }}
                  >
                    {getLabel(
                      language,
                      benefit.descriptionFi,
                      benefit.descriptionEn
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Vertical chat tab */}
      <a
        href="/ai-chat"
        className="fixed -right-6 bottom-1/10 -translate-y-1/2 z-40 origin-center -rotate-90 bg-[var(--va-orange)] text-[var(--background)] px-4 py-3 rounded-t-md shadow hover:brightness-95 text-sm tracking-wider"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        {getLabel(
          language,
          translations.chatButton.fi,
          translations.chatButton.en
        )}
      </a>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  href?: string;
}) {
  const CardContent = () => (
    <div className="bg-[var(--background)] group h-full flex flex-col gap-4 rounded-2xl border border-[var(--va-border)] p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--va-orange)] cursor-pointer hover:-translate-y-1">
      <div className="flex items-start gap-4 flex-1">
        <div className="grid place-items-center rounded-xl text-[var(--va-orange)] transition-all duration-300 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 flex flex-col">
          <div className="font-extrabold text-lg tracking-wide text-[var(--typography)] group-hover:text-[var(--va-orange)] transition-colors duration-300 mb-2">
            {title}
          </div>
          {description && (
            <p
              className="text-md text-[var(--typgraphy)] normal-case leading-relaxed flex-1"
              style={{ fontFamily: "var(--font-montreal-mono-medium)" }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-auto">
        <span className="text-[var(--va-orange)] group-hover:translate-x-1 transition-transform duration-300 text-xl">
          →
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
