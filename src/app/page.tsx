"use client";
import Link from "next/link";
import Image from "next/image";
import { FiMessageSquare, FiGlobe, FiFileText } from "react-icons/fi";
import { RiMoneyEuroCircleLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--va-orange-50)] pt-16 pb-10 md:mb-16 mb-12 shadow-lg">
        {/* Liito-orava images */}
        <div className="absolute inset-0 max-w-400">
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-03.png"
            alt=""
            width={140}
            height={140}
            className="absolute md:top-2 lg:right-10 top-1 right-0 w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 hover:animate-spin"
          />
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-07.png"
            alt=""
            width={140}
            height={140}
            className="absolute lg:left-30 -bottom-2 left-16 w-28 h-28 lg:w-36 lg:h-36 md:w-32 md:h-32 hover:animate-spin"
          />
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png"
            alt=""
            width={100}
            height={100}
            className="absolute md:bottom-6 lg:left-10 left-0 bottom-4 w-24 h-24 md:w-24 md:h-24 lg:w-30 lg:h-30 hover:animate-bounce"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10 text-center py-12 mt-6 mb-6">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl tracking-wider text-[var(--typography)] mb-6 uppercase text-shadow-sm"
            style={{ fontFamily: "var(--font-machina-bold)" }}
          >
            Tervetuloa Metropolian vaihto­sovellukseen!
          </h1>
          <p
            className="text-lg md:text-xl text-[var(--typography)] opacity-90 max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200"
            style={{
              fontFamily: "var(--font-montreal-mono-medium)",
            }}
          >
            Löydä hakuohjeet, kohdemaat, apurahat ja vinkit yhdestä paikasta.
          </p>
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
                  AKATEEMINEN KASVU
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
        className="fixed -right-6 top-3/4 -translate-y-1/2 z-40 origin-center -rotate-90 bg-[var(--va-orange)] text-[var(--background)] px-4 py-3 rounded-t-md shadow hover:brightness-95 text-sm tracking-wider"
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
