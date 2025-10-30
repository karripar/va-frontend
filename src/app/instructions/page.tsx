"use client";

import React from "react";
import { Stepper, Step } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FiExternalLink } from "react-icons/fi";
import Image from "next/image";

export default function Instructions() {
  const steps: Step[] = [
    {
      title: "Etsi tietoa",
      text: (
        <>
          Tutustu tutkintoosi soveltuviin vaihtokohteisiin ja kohdekoulujen
          kurssitarjontaan.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Lue aiempien vaihto-opiskelijoiden kokemuksia ja vinkkejä
          raporttiportaalista.
        </>
      ),
      links: [
        { href: "/destinations", label: "Vaihtokohteet" },
        { href: "/tips", label: "Kokemukset ja vinkit" },
        {
          href: "https://www.service4mobility.com/europe/MobilitySearchServlet?identifier=HELSINK41&kz_bew_pers=S&kz_bew_art=OUT&sprache=en",
          label: "Raporttiportaali",
        },
      ],
    },
    {
      title: "Hakuinfo",
      text: (
        <>
          Osallistu hakuaikoina järjestettäviin alakohtaisiin infotilaisuuksiin
          kampuksella tai verkossa.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Tarkat hakuaikojen ja infotilaisuuksien päivämäärät näet opiskelijan
          omasta portaalista.
        </>
      ),
      links: [
        {
          href: "https://opiskelija.oma.metropolia.fi/group/pakki/kv-etusivu?_gl=1*16lq0qt*_ga*MTM4OTczNDkwMy4xNzU4ODc3NTM2*_ga_FK7DBZXP5K*czE3NjEyOTM2NzQkbzEkZzEkdDE3NjEyOTY5NDkkajU4JGwwJGgw",
          label: "Oma portaali",
        },
      ],
    },
    {
      title: "Ennen hakua",
      text: (
        <>
          <b>
            Lue huolellisesti yksityiskohtaiset vaihdon säännöt ja periaatteet.
          </b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Voit halutessasi keskustella oman tutkinto-ohjelmasi yhteyshenkilön
          kanssa milloin opiskelijavaihtoon kannattaa lähteä ja millaiset
          opinnot sopivat tutkintoosi.
        </>
      ),
      links: [
        {
          href: "https://opiskelija.oma.metropolia.fi/delegate/desktop_web_content_attachment/attachment/10451667",
          label: "Säännöt ja periaatteet",
        },
        { href: "/contact", label: "Ota yhteyttä" },
      ],
    },
    {
      title: "Metropolian sisäinen haku",
      text: (
        <>
          Vaihtoon hakeminen tapahtuu kahdessa osassa.{" "}
          <b>
            Hakemus Metropolian sisäisessä haussa täytetään Mobility Onlinessa
            hakuaikana.
          </b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Hakemukseen riittää, että olet löytänyt sinulle sopivat vaihtokohteet
          ja laatinut suunnitelmaa vaihdon sisällöstä, tavoitteista ja
          tarkistanut että oma tilanteesi mahdollistaa vaihdon.
        </>
      ),
      links: [
        {
          href: "https://www.service4mobility.com/europe/LoginServlet?org_id=28&sprache=en&loginType=S&identifier=HELSINK41",
          label: "Mobility Online",
        },
      ],
    },
    {
      title: "Sisäisen haun tulokset",
      text: (
        <>
          Hakuajan päätyttyä sinulle ilmoitetaan sisäisen haun tulokset. Mikäli
          vaihtosuunnitelmasi hyväksytään{" "}
          <b>
            käy vahvistamassa vaihtopaikka Mobility Onlinessa 7 päivän kuluessa.
          </b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Vaihtopaikan vahvistamisen jälkeen voit aloittaa varsinaisen
          hakuprosessin kohdekouluun.
        </>
      ),
      links: [
        {
          href: "https://www.service4mobility.com/europe/LoginServlet?org_id=28&sprache=en&loginType=S&identifier=HELSINK41",
          label: "Mobility Online",
        },
      ],
    },
    {
      title: "Hae kohdekorkeakouluun",
      text: (
        <>
          Aloita hakemuksen täyttäminen ja tarvittavien liitteiden hankkiminen
          hyvissä ajoin.{" "}
          <b>Vaihto on ehdollinen kohdekoulun hyväksyntään saakka.</b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          <b>Laadi Mobility Onlinessa Learning agreement</b> eli vaihdon
          opintosuunnitelma.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Kohdekoulun kurssivalinnat löytyvät koulujen omilta sivuilta.
          Huomioithan, että kaikki kurssit eivät välttämättä ole
          vaihto-opiskelijoiden valittavissa.
        </>
      ),
      links: [
        {
          href: "https://oma.metropolia.fi/delegate/download_workspace_attachment/10279181/Learning%20Agreement%20instructions.pdf",
          label: "Learning agreement",
        },
      ],
    },
    {
      title: "Hakemuksen täyttäminen",
      text: (
        <>
          Sisällytä hakemukseen tarvittavat liitteet, esim.
          <b>
            opintosuoritusote, vakuutustodistus, kielitodistus, CV,
            motivaatiokirje, tutkintovastaavan suosituskirje.
          </b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Mikäli kohdekoulusi vaatii kielitodistuksen, voit tehdä
          OLS-kielitestin tai pyytää kielen opettajaasi arvioimaan osaamistasi
          ja täyttämään kielitodistus pohjan.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          <b>
            Tarkat ohjeet hakemuksen täyttämiseen ja lähettämiseen löydät
            kohdekoulun sivuilta.
          </b>
        </>
      ),
      links: [
        {
          href: "https://opiskelija.oma.metropolia.fi/fi/group/pakki/hops?p_p_id=PersonalCurriculumStudentPortlet_WAR_personalcurriculumportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&_PersonalCurriculumStudentPortlet_WAR_personalcurriculumportlet_struts.portlet.action=%2Fpersonalcurriculum%2Fdownload_transcript&_PersonalCurriculumStudentPortlet_WAR_personalcurriculumportlet_struts.portlet.mode=view&p_auth=muUAmQ2Y",
          label: "Opintosuoritusote",
        },
        {
          href: "https://oma.metropolia.fi/delegate/download_workspace_attachment/10351445/Insurance_information_in_english_protector_2020_P%C3%A4ivitetty%2015.2.2025.ppt",
          label: "Vakuutustodistus",
        },
        {
          href: "https://oma.metropolia.fi/delegate/download_workspace_attachment/10268773/Language_certificate_template.pdf",
          label: "Kielitodistus pohja",
        },
        {
          href: "https://academy.europa.eu/local/euacademy/pages/course/community-overview.php?title=learn-a-new-language",
          label: "OLS-kielitesti",
        },
      ],
    },
    {
      title: "Hakemuksen lähettäminen ja hyväksyntä",
      text: (
        <>
          <b>Osallistu pakollisiin vaihto-orientaatioihin,</b> joista saat
          täsmätietoa hakemuksen täyttämiseen, lähdön valmisteluun ja vinkkejä
          vaihtoajallesi.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Orientaatio tilaisuuksien ajankohdista sinua tiedotetaan erikseen
          sähköpostilla.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Lähetä hakemus kohdekouluun määräaikaan mennessä. Kysy tarvittaessa
          apua KV-asintuntijaltasi.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          Kun saat kohdekoulun hyväksymiskirjeen,{" "}
          <b>välitä hyväksymistieto kv-asiantuntijallesi</b>, joka varmentaa
          vaihdon viralliset päivämäärät Mobility Online -järjestelmään.
        </>
      ),
      links: [{ href: "/contact", label: "Ota yhteyttä" }],
    },
    {
      title: "Valmistaudu lähtöön",
      text: (
        <>
          <b>Hae apurahaa ennen vaihdon alkamista.</b> Apurahan käsittelyn
          edellytyksenä on hyväksytty Learning Agreement ja kohdekoulun
          varmistama hyväksymiskirje.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          <b>Hae tarvittaessa viisumi tai oleskelulupa.</b>
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          <b>Varaa matkaliput</b> kun tiedät vaihdon ajankohdan. Otathan
          huomioon myös mahdolliset orientaatiopäivät kohdekoulussa.
          <br aria-hidden="true" />
          <br aria-hidden="true" />
          <b>Tee väliaikainen muuttoilmoitus</b> sekä <b>matkustusilmoitus</b>{" "}
          Suomen edustustoon mahdollisia hätätapauksia ja kriisitilanteita
          varten
        </>
      ),
      links: [
        { href: "/grants", label: "Apurahat ja kustannukset" },
        {
          href: "https://www.posti.fi/muuttaminen/muuttoilmoitus",
          label: "Muuttoilmoitus",
        },
        { href: "https://um.fi/matka-ilmoitus", label: "Matkustusilmoitus" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 space-y-12">
      <section className="text-center space-y-4">
        <h1
          className="sm:text-3xl text-2xl tracking-wide text-[var(--va-orange)]"
          style={{ fontFamily: "var(--font-machina-bold)" }}
        >
          Valmiina seikkailuun?
        </h1>
        <p
          className="sm:text-lg text-md text-[var(--typography)] px-4 pt-4 pb-2"
          style={{ fontFamily: "var(--font-montreal-mono)" }}
        >
          Vaihto-opiskelu avaa ovet uusiin kulttuureihin, ystävyyksiin ja
          ammatillisiin oivalluksiin.
        </p>
        <Image
          src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-06.png"
          alt=""
          width={140}
          height={120}
          className="mx-auto my-4 sm:w-40 sm:h-35 w-30 h-25 hover:animate-spin z-100"
        />
        {/* Steps */}
        <div className=" bg-[var(--va-grey-50)] lg:max-w-3xl mb-10 rounded-md p-4 md:p-6 mx-auto">
          <section>
            <Stepper steps={steps} />
          </section>
        </div>

        {/* Footer */}
        <div className="bg-[var(--va-grey-50)] rounded-md px-4 py-2">
          <Image
            src="/images/liito-oravat/21032024_liito-orava_RGB_Metropolia_KV_JO-11.png"
            alt=""
            width={140}
            height={140}
            className="w-40 h-40 lg:w-50 lg:h-50 hover:animate-spin mx-auto"
          />
          <section className="text-center text-md text-[var(--va-typography)] m-auto">
            <p
              className="mb-6 leading-7 py-2 px-4"
              style={{ fontFamily: "var(--font-montreal-mono-medium)" }}
            >
              Tämä sivu on opiskelijoiden tekemä yhteenveto Metropolian
              vaihtoonhakuprosessista. Tarkista ajantasaiset tiedot Metropolian
              opiskelijan tietopankista:
            </p>
          </section>
          <div className="flex flex-col w-full justify-center gap-3 my-8 items-center mx-auto sm:px-10 px-4">
            <Button href="https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu">
              Vaihto-opiskelu
              <FiExternalLink size={20} className="pb-1 font-bold" />
            </Button>
            <Button href="https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/opiskelijavaihto/hakeminen">
              Hae vaihtoon
              <FiExternalLink size={20} className="pb-1 font-bold" />
            </Button>
            <Button href="https://opiskelijan.metropolia.fi/fi/opintojen-suorittaminen/kansainvalistyminen-ja-vaihto-opiskelu/vaihto-opiskelu/lahtevan-muistilista">
              Muistilista
              <FiExternalLink size={20} className="pb-1 font-bold" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
