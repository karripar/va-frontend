"use client";

import React from "react";
import { Stepper, Step } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const getLabel = (language: string, fi: string, en: string) => (language === "en" ? en : fi);

export default function Instructions() {
  const { language } = useLanguage();

  // titles and text content only - links come from backend with isExternal/isFile flags
  const stepsData: {
    titleFi: string;
    titleEn: string;
    textFi: string;
    textEn: string;
  }[] = [
    {
      titleFi: "Etsi tietoa",
      titleEn: "Find information",
      textFi:
        "Tutustu <b>tutkintoosi soveltuviin</b> vaihtokohteisiin ja kohdekoulujen kurssitarjontaan.\n\n<b>Lue aiempien vaihto-opiskelijoiden kokemuksia ja vinkkejä</b> raporttiportaalista.",
      textEn:
        "Explore partner universities and course offerings <b>relevant to your degree</b>.\n\n<b>Read previous students experiences and tips</b> from the Exchange Report portal.",
    },
    {
      titleFi: "Hakuinfo",
      titleEn: "Application info",
      textFi:
        "<b>Osallistu hakuaikoina järjestettäviin alakohtaisiin infotilaisuuksiin</b> kampuksella tai verkossa.\n\nTarkat hakuaikojen ja infotilaisuuksien päivämäärät näet opiskelijan omasta portaalista.",
      textEn:
        "<b>Attend field-specific info sessions during the application period</b> on campus or online.\n\nExact dates are available in student portal.",
    },
    {
      titleFi: "Ennen hakua",
      titleEn: "Before you apply",
      textFi:
        "<b>Lue huolellisesti yksityiskohtaiset vaihdon säännöt ja periaatteet.</b>\n\nVoit halutessasi keskustella oman tutkinto-ohjelmasi yhteyshenkilön kanssa <b>milloin vaihtoon kannattaa lähteä ja millaiset opinnot sopivat tutkintoosi.</b>",
      textEn:
        "<b>Read the exchange rules and guidelines carefully.</b>\n\nYou can discuss with your degree programme contact person about the <b>best timing for your exchange and suitable courses.</b>",
    },
    {
      titleFi: "Metropolian sisäinen haku",
      titleEn: "Metropolia's internal application",
      textFi:
        "Vaihtoon hakeminen tapahtuu kahdessa osassa. <b>Hakemus Metropolian sisäisessä haussa täytetään Mobility Onlinessa hakuaikana.</b>\n\nHakemukseen riittää, että olet löytänyt sinulle sopivat vaihtokohteet ja laatinut suunnitelmaa vaihdon sisällöstä ja tavoitteista.",
      textEn:
        "Applying for an exchange takes place in two parts. <b>The internal application is filled in Mobility Online during the application period.</b>\n\nTo apply, you need to find exchange destinations that suit you and describe your exchange study content and goals.",
    },
    {
      titleFi: "Sisäisen haun tulokset",
      titleEn: "Internal selection results",
      textFi:
        "Hakuajan päätyttyä sinulle ilmoitetaan sisäisen haun tulokset. <b>Mikäli vaihtosuunnitelmasi hyväksytään, käy vahvistamassa vaihtapaikka Mobility Onlinessa 7 päivän kuluessa.</b>\n\nVaihtopaikan vahvistamisen jälkeen voit aloittaa varsinaisen hakuprosessin kohdekouluun.",
      textEn:
        "After the internal selection you will be informed of the results. <b>If your exchange plan is approved, confirm your place in Mobility Online within 7 days.</b>\n\nOnce confirmed, you can start the official application to the host university.",
    },
    {
      titleFi: "Hae kohdekorkeakouluun",
      titleEn: "Apply to the host university",
      textFi:
        "Aloita hakemuksen täyttäminen ja tarvittavien liitteiden hankkiminen hyvissä ajoin. <b>Vaihto on ehdollinen kohdekoulun hyväksyntään saakka.</b>\n\nLaadi Mobility Onlinessa Learning Agreement eli vaihdon opintosuunnitelma.",
      textEn:
        "Start preparing your application and required attachments well in advance. <b>The exchange is conditional until the host university accepts you.</b>\n\nPrepare the Learning Agreement in Mobility Online.",
    },
    {
      titleFi: "Hakemuksen täyttäminen",
      titleEn: "Filling attachments",
      textFi:
        "Sisällytä hakemukseen tarvittavat liitteet, esim. <b>opintosuoritusote, vakuutustodistus, kielitodistus, CV ja motivaatiokirje.</b>\n\nJos kohdekoulu vaatii kielitodistuksen, voit tehdä OLS-kielitestin tai pyytää opettajaa täyttämään kielitodistus pohjan.",
      textEn:
        "Include necessary attachments such as <b>transcript of records, insurance certificate, language certificate, CV and motivation letter.</b>\n\nIf a language certificate is required, you can take the OLS test or ask a language teacher to fill in the language certificate template.",
    },
    {
      titleFi: "Hakemuksen lähettäminen ja hyväksyntä",
      titleEn: "Submitting application & acceptance",
      textFi:
        "<b>Osallistu pakollisiin vaihto-orientaatioihin</b>, joista saat täsmätietoa hakemuksen täyttämiseen ja lähdön valmisteluun.\n\n<b>Kun saat kohdekoulun hyväksymiskirjeen, välitä hyväksymistieto kv-asiantuntijallesi.</b>",
      textEn:
        "<b>Attend mandatory exchange orientation sessions</b> which provide guidance on applying and preparing to depart.\n\n<b>When you receive the acceptance letter from the host university, forward it to the international affairs contact.</b>",
    },
    {
      titleFi: "Valmistaudu lähtöön",
      titleEn: "Prepare for departure",
      textFi:
        "<b>Hae apurahaa ennen vaihdon alkamista.</b> Apurahan käsittelyn edellytyksenä on hyväksytty Learning Agreement ja kohdekoulun vahvistus.\n\n<b>Hae tarvittaessa viisumi tai oleskelulupa ja varaa matkat.</b>",
      textEn:
        "<b>Apply for grants before your exchange starts.</b> A grant requires an approved Learning Agreement and confirmation from the host university.\n\n<b>Apply for a visa or residence permit if needed and book travel.</b>",
    },
  ];

  const steps: Step[] = stepsData.map((s) => ({
    title: getLabel(language, s.titleFi, s.titleEn),
    text: (
      <>
        {getLabel(language, s.textFi, s.textEn)
          .split("\n\n")
          .map((p, i) => (
            <p key={i} className="mb-4" style={{ fontFamily: "var(--font-montreal-mono)" }} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
      </>
    ),
  }));

  const footerIntroFi =
    "Tämä sivu on opiskelijoiden tekemä yhteenveto Metropolian vaihtoonhakuprosessista. Tarkista ajantasaiset tiedot Metropolian opiskelijan tietopankista:";
  const footerIntroEn =
    "This page is a student-created summary of the Metropolia exchange application process. Check the official student information service for up-to-date details:";

  const buttons = [
    { href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu", labelFi: "Vaihto-opiskelu", labelEn: "Exchange studies" },
    { href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/opiskelijavaihto/hakeminen", labelFi: "Hae vaihtoon", labelEn: "Apply for exchange" },
    { href: "https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/vaihto-opiskelu/lahtevan-muistilista", labelFi: "Muistilista", labelEn: "Checklist" },
  ];

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="sm:text-3xl text-2xl tracking-wide text-[var(--va-orange)]" style={{ fontFamily: "var(--font-machina-bold)" }}>
          {getLabel(language, "Valmiina seikkailuun?", "Ready for an adventure?")}
        </h1>
        <p className="sm:text-lg text-md text-[var(--typography)] px-4 pt-4 pb-2" style={{ fontFamily: "var(--font-montreal-mono)" }}>
          {getLabel(
            language,
            "Vaihto-opiskelu avaa ovet uusiin kulttuureihin, ystävyyksiin ja ammatillisiin oivalluksiin.",
            "Exchange studies open doors to new cultures, friendships and professional insights."
          )}
        </p>
        <Image src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png" alt="" width={140} height={120} className="mx-auto my-4 sm:w-40 sm:h-35 w-30 h-25 z-100" />

        <div className="bg-[var(--va-grey-50)] lg:max-w-3xl mb-10 rounded-md p-4 md:p-6 mx-auto">
          <section>
            <Stepper steps={steps} />
          </section>
        </div>

        <div className="bg-[var(--va-grey-50)] rounded-md px-4 py-2">
          <Image src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png" alt="" width={140} height={140} className="w-40 h-40 lg:w-50 lg:h-50 hover:animate-spin mx-auto" />
          <section className="text-center text-md text-[var(--typography)] m-auto">
            <p className="mb-6 leading-7 py-2 px-4" style={{ fontFamily: "var(--font-montreal-mono-medium)" }}>
              {getLabel(language, footerIntroFi, footerIntroEn)}
            </p>
          </section>
          <div className="flex flex-col w-full justify-center gap-3 my-8 items-center mx-auto sm:px-10 px-4">
            {buttons.map((b) => (
              <Button key={b.href} href={b.href} target="_blank" rel="noopener noreferrer">
                {getLabel(language, b.labelFi, b.labelEn)} <FiExternalLink size={20} className="pb-1 font-bold" />
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
