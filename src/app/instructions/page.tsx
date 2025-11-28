"use client";
import { Stepper, Step } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useInstructionSteps } from "@/hooks/instructionHooks";

// translations for instructions page
const translations: Record<string, Record<string, string>> = {
  fi: {
    heroTitle: "Valmiina seikkailuun?",
    heroIntro:
      "Vaihto-opiskelu avaa ovet uusiin kulttuureihin, ystävyyksiin ja ammatillisiin oivalluksiin.",
    footerIntro:
      "Tämä sivu on opiskelijoiden tekemä yhteenveto Metropolian vaihtoonhakuprosessista. Tarkista ajantasaiset tiedot Metropolian opiskelijan tietopankista:",
  },
  en: {
    heroTitle: "Ready for an adventure?",
    heroIntro:
      "Exchange studies open doors to new cultures, friendships and professional insights.",
    footerIntro:
      "This page is a student-created summary of the Metropolia exchange application process. Check the official student information service for up-to-date details:",
  },
};

export default function Instructions() {
  const { language } = useLanguage();
  const { steps: rawSteps } = useInstructionSteps();
  const steps: Step[] = rawSteps.map((s) => ({
    title: s.title,
    text: (
      <>
        {s.text.split("\n\n").map((p: string, i: number) => (
          <p
            key={i}
            className="mb-4"
            style={{ fontFamily: "var(--font-montreal-mono)" }}
          >
            {p}
          </p>
        ))}
      </>
    ),
  }));

  const buttons = [
    {
      href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu",
      labelFi: "Vaihto-opiskelu",
      labelEn: "Exchange studies",
    },
    {
      href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/opiskelijavaihto/hakeminen",
      labelFi: "Hae vaihtoon",
      labelEn: "Apply for exchange",
    },
    {
      href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/vaihto-opiskelu/lahtevan-muistilista",
      labelFi: "Muistilista",
      labelEn: "Checklist",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1
          className="sm:text-3xl text-2xl tracking-wide text-[var(--va-orange)]"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          {translations[language].heroTitle}
        </h1>
        <p
          className="sm:text-lg text-md text-[var(--typography)] px-4 pt-4 pb-2"
          style={{ fontFamily: "var(--font-montreal-mono)" }}
        >
          {translations[language].heroIntro}
        </p>
        <Image
          src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png"
          alt=""
          width={140}
          height={120}
          className="mx-auto my-4 sm:w-40 sm:h-35 w-30 h-25 z-100"
        />

        <div className="bg-[var(--va-grey-50)] lg:max-w-3xl mb-10 rounded-md p-4 md:p-6 mx-auto">
          <section>
            <Stepper steps={steps} />
          </section>
        </div>

        <div className="bg-[var(--va-grey-50)] rounded-md px-4 py-2">
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png"
            alt=""
            width={140}
            height={140}
            className="w-40 h-40 lg:w-50 lg:h-50 hover:animate-spin mx-auto"
          />
          <section className="text-center text-md text-[var(--typography)] m-auto">
            <p
              className="mb-6 leading-7 py-2 px-4"
              style={{ fontFamily: "var(--font-montreal-mono-medium)" }}
            >
              {translations[language].footerIntro}
            </p>
          </section>
          <div className="flex flex-col w-full justify-center gap-3 my-8 items-center mx-auto sm:px-10 px-4">
            {buttons.map((b) => (
              <Button
                key={b.href}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {language === "en" ? b.labelEn : b.labelFi}{" "}
                <FiExternalLink size={20} className="pb-1 font-bold" />
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
