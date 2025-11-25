"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMessageSquare, FiGlobe, FiFileText } from "react-icons/fi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";
import { useLanguage } from "@/context/LanguageContext";

// translations
type CardItem = { title: string; description: string; href: string };
type BenefitItem = { title: string; description: string };
type Locale = {
  heroTitle: string;
  heroSubtitle: string;
  cards: CardItem[];
  whyExchange: string;
  benefits: BenefitItem[];
  chatButton: string;
};

const translations: Record<"fi" | "en", Locale> = {
  fi: {
    heroTitle: "Tervetuloa Metropolian vaihto­sovellukseen!",
    heroSubtitle:
      "Löydä hakuohjeet, kohdemaat, apurahat ja vinkit yhdestä paikasta.",
    cards: [
      {
        title: "VAIHTOON HAKEMINEN",
        description: "Tutustu hakuprosessiin ja ohjeisiin askel askeleelta.",
        href: "/instructions",
      },
      {
        title: "APURAHAT",
        description: "Katso apurahat ja mahdolliset kustannukset.",
        href: "/profile/hakemukset?tab=apurahat",
      },
      {
        title: "KOHDEMAAT",
        description: "Selaa partnerikouluja ja vaihtokohteita.",
        href: "/destinations",
      },
      {
        title: "AI–CHAT JA FAQ",
        description: "Kysy kysymyksiä AI:lta tai selaile usein kysyttyjä.",
        href: "/ai-chat",
      },
    ],
    whyExchange: "MIKSI LÄHTEÄ VAIHTOON?",
    benefits: [
      {
        title: "KANSAINVÄLINEN KOKEMUS",
        description:
          "Kehitä kulttuurista ymmärrystä ja kansainvälistä näkökulmaa",
      },
      {
        title: "AMMATILLINEN KASVU",
        description:
          "Opi uusia menetelmiä ja laajenna osaamistasi eri näkökulmista",
      },
      {
        title: "URAETU",
        description:
          "Erottaudu työmarkkinoilla ja verkostoidu kansainvälisesti",
      },
      {
        title: "HENKILÖKOHTAINEN KASVU",
        description:
          "Vahvista itseluottamusta ja sopeutumiskykyä uusissa tilanteissa",
      },
    ],
    chatButton: "CHAT",
  },
  en: {
    heroTitle: "Welcome to the Exchange Application!",
    heroSubtitle:
      "Find application instructions, destinations, grants, and tips all in one place.",
    cards: [
      {
        title: "APPLY FOR EXCHANGE",
        description:
          "Learn about the application process and view step-by-step instructions.",
        href: "/instructions",
      },
      {
        title: "GRANTS & COSTS",
        description: "Check out grants and potential costs.",
        href: "/profile/hakemukset?tab=apurahat",
      },
      {
        title: "DESTINATIONS",
        description: "Browse partner universities and exchange destinations.",
        href: "/destinations",
      },
      {
        title: "AI CHAT & FAQ",
        description:
          "Ask questions from AI or browse frequently asked questions.",
        href: "/ai-chat",
      },
    ],
    whyExchange: "WHY GO TO EXCHANGE?",
    benefits: [
      {
        title: "INTERNATIONAL EXPERIENCE",
        description:
          "Develop cultural understanding and international perspective",
      },
      {
        title: "PROFESSIONAL GROWTH",
        description:
          "Learn new methods and expand your skills from different perspectives",
      },
      {
        title: "CAREER ADVANTAGE",
        description: "Stand out in the job market and network internationally",
      },
      {
        title: "PERSONAL GROWTH",
        description: "Strengthen confidence and adaptability in new situations",
      },
    ],
    chatButton: "CHAT",
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
              {translations[language].heroTitle}
            </h1>
            <p
              className="text-lg md:text-xl xl:text-2xl text-[var(--typography)]"
              style={{
                fontFamily: "var(--font-montreal-mono-medium)",
              }}
            >
              {translations[language].heroSubtitle}
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
            {translations[language].cards.map(
              (card: CardItem, index: number) => {
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
                    title={card.title}
                    description={card.description}
                    href={card.href}
                  />
                );
              }
            )}
          </div>
        </div>

        <section className="pt-16 pb-20 bg-[var(--va-grey-50)] lg:max-w-6xl lg:mx-auto mx-4 rounded-md">
          <div className="px-6 lg:px-10">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl mb-4 tracking-wider"
                style={{ fontFamily: "var(--font-machina-bold)" }}
              >
                {translations[language].whyExchange}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {translations[language].benefits.map(
                (benefit: BenefitItem, index: number) => (
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
                        priority
                        width={index === 1 || index === 3 ? 140 : 80}
                        height={index === 1 || index === 3 ? 140 : 80}
                        className="h-30 w-30"
                        style={{
                          width: "auto",
                        }}
                      />
                    </div>
                    <h3
                      className={`text-lg mb-4 tracking-wide ${
                        index === 2 ? "lg:mb-11 mb-2" : ""
                      }`}
                      style={{ fontFamily: "var(--font-machina-bold)" }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      className="text-md"
                      style={{ fontFamily: "var(--font-montreal-mono)" }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                )
              )}
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
        {translations[language].chatButton}
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
