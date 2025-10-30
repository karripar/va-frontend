"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMessageSquare, FiGlobe, FiFileText } from "react-icons/fi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--va-orange-50)] shadow-lg mb-6 max-w-10xl mx-auto">
        <div className="relative mx-auto max-w-full flex justify-between flex-row">
          <div className="flex flex-col px-12 lg:pl-16 md:pl-10 lg:pt-18 md:pt-12 sm:pb-10 lg:max-w-xl xl:max-w-3xl md:max-w-md py-12 md:text-left text-center">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl tracking-wider text-[var(--typography)] uppercase pb-8"
              style={{ fontFamily: "var(--font-machina-bold)" }}
            >
              Tervetuloa Metropolian vaihto­sovellukseen!
            </h1>
            <p
              className="text-lg md:text-xl text-[var(--typography)]"
              style={{
                fontFamily: "var(--font-montreal-mono-medium)",
              }}
            >
              Löydä hakuohjeet, kohdemaat, apurahat ja vinkit yhdestä paikasta.
            </p>
          </div>
          <div className="relative flex-1 h-[400px] hidden md:flex">
            <svg
              viewBox="0 0 550 500"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block"
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
            <Card
              icon={
                <FiFileText className="text-[var(--va-orange)]" size={38} />
              }
              title="VAIHTOON HAKEMINEN"
              description="Tutustu hakuprosessiin ja ohjeisiin askel askeleelta"
              href="/instructions"
            />
            <Card
              icon={
                <RiMoneyEuroCircleLine
                  className="text-[var(--va-orange)]"
                  size={38}
                />
              }
              title="APURAHAT"
              description="Katso apurahat ja mahdolliset kustannukset"
              href="/grants"
            />
            <Card
              icon={<FiGlobe className="text-[var(--va-orange)]" size={38} />}
              title="KOHDEMAAT"
              description="Selaa partnerikouluja ja vaihtokohteita"
              href="/destinations"
            />
            <Card
              icon={
                <FiMessageSquare
                  className="text-[var(--va-orange)]"
                  size={38}
                />
              }
              title="AI–CHAT JA FAQ"
              description="Kysy kysymyksiä AI:lta tai selaa usein kysyttyjä"
              href="/ai-chat"
            />
          </div>
        </div>

        <section className="pt-16 pb-20 bg-[var(--va-grey-50)] lg:max-w-6xl lg:mx-auto mx-4 rounded-md">
          <div className="px-6 lg:px-10">
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl mb-4 tracking-wider"
                style={{ fontFamily: "var(--font-machina-bold)" }}
              >
                MIKSI LÄHTEÄ VAIHTOON?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png"
                    alt=""
                    width={80}
                    height={80}
                    className="h-30 w-30"
                  />
                </div>
                <h3
                  className="text-lg mb-4 tracking-wide"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  KANSAINVÄLINEN KOKEMUS
                </h3>
                <p
                  className="text-md"
                  style={{ fontFamily: "var(--font-montreal-mono)" }}
                >
                  Kehitä kulttuurista ymmärrystä ja kansainvälistä näkökulmaa
                </p>
              </div>

              <div className="text-center p-4">
                <div className=" mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-03.png"
                    alt=""
                    width={140}
                    height={140}
                    className="h-30 w-30"
                  />
                </div>
                <h3
                  className="text-lg mb-4 tracking-wide"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  AMMATILLINEN KASVU
                </h3>
                <p
                  className="text-md"
                  style={{ fontFamily: "var(--font-montreal-mono)" }}
                >
                  Opi uusia menetelmiä ja laajenna osaamistasi eri näkökulmista
                </p>
              </div>

              <div className="text-center p-4">
                <div className=" mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-09.png"
                    alt=""
                    width={80}
                    height={80}
                    className="h-30 w-30"
                  />
                </div>
                <h3
                  className="text-lg lg:mb-11 mb-2 tracking-wide"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  URAETU
                </h3>
                <p
                  className="text-md"
                  style={{ fontFamily: "var(--font-montreal-mono)" }}
                >
                  Erottaudu työmarkkinoilla ja verkostoidu kansainvälisesti
                </p>
              </div>

              <div className="text-center p-4">
                <div className=" mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-13.png"
                    alt=""
                    width={140}
                    height={140}
                    className="h-30 w-30"
                  />
                </div>
                <h3
                  className="text-lg mb-4 tracking-wide"
                  style={{ fontFamily: "var(--font-machina-bold)" }}
                >
                  HENKILÖKOHTAINEN KASVU
                </h3>
                <p
                  className="text-md"
                  style={{ fontFamily: "var(--font-montreal-mono)" }}
                >
                  Vahvista itseluottamusta ja sopeutumiskykyä uusissa
                  tilanteissa
                </p>
              </div>
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
        CHAT
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
