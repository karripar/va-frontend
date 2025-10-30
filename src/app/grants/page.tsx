"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiSearch, FiExternalLink, FiChevronDown } from "react-icons/fi";

export default function GrantsPage() {
  const [program, setProgram] = useState("Erasmus+");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--typography)]">
      <main className="mx-auto max-w-[800px]">
        <section className="px-6 sm:px-10 lg:px-14 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {/* Search destinations */}
            <label className="flex h-12 items-center gap-2 rounded-full border border-[var(--va-border)] bg-white px-4 shadow-sm">
              <FiSearch className="text-[var(--typography)]" />
              <input
                type="text"
                placeholder="Etsi kohteita"
                className="w-full bg-transparent outline-none text-sm"
              />
            </label>

            {/* Program select */}
            <div className="relative">
              <label className="sr-only" htmlFor="program-select">
                Vaihto-ohjelmat
              </label>
              <select
                id="program-select"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full h-12 rounded-full border border-[var(--va-border)] bg-[var(--va-mint-50)] pl-4 pr-10 text-sm font-medium shadow-sm focus-ring appearance-none"
                aria-label="Valitse vaihto-ohjelma"
              >
                <option className="bg-[var(--background)]" value="Erasmus+">
                  Erasmus+
                </option>
                <option className="bg-[var(--background)]" value="Nordplus">
                  Nordplus
                </option>
                <option
                  className="bg-[var(--background)]"
                  value="Bilateral Agreements"
                >
                  Bilateral Agreements
                </option>
                <option
                  className="bg-[var(--background)]"
                  value="Other exchange destinations"
                >
                  Other exchange destinations
                </option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--typography)]" />
            </div>
          </div>

          {/* Grant estimator card */}
          <h2
            className="mt-10 mb-6 text-2xl"
            style={{ fontFamily: "var(--font-machina-regular)" }}
          >
            Arvio apurasta
          </h2>
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[var(--va-border)] bg-white shadow-sm p-6 md:p-8">
              {/* Numbers */}
              <div className="text-center text-2xl font-extrabold">
                540€ / KK
              </div>
              {/* Progress */}
              <div className="mt-5 flex items-center gap-4">
                <div className="relative h-4 flex-1 rounded-full bg-neutral-200">
                  <div
                    className="absolute left-0 top-0 h-4 rounded-full bg-[var(--va-mint)]"
                    style={{ width: "54%" }}
                  />
                </div>
                <div className="text-sm text-[var(--typography)]">1000€</div>
              </div>
              {/* Meta info */}
              <div className="mt-8 grid grid-cols-2 text-md max-w-80 text-[var(--typography)]">
                <div>Kohde</div>
                <div>Italia</div>
                <div>Ohjelma</div>
                <div>{program}</div>
              </div>

              {/* CTA */}
              <div className="mt-12">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--va-orange)] text-white px-10 md:py-3 text-base font-bold shadow hover:brightness-95 focus-ring justify-center py-1"
                >
                  <p
                    className=" uppercase pt-1"
                    style={{ fontFamily: "var(--font-machina-bold)" }}
                  >
                    Hae apurahaa
                  </p>
                  <FiExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Erasmus+ lisätuet */}
          <div className="mt-10 max-w-5xl mx-auto">
            <h3
              className="mb-6 text-xl"
              style={{ fontFamily: "var(--font-machina-regular)" }}
            >
              Erasmus+ lisätuet
            </h3>
            <div className="flex flex-col gap-6">
              <ExtraCard
                title="Erasmus+ matkatuki"
                open={open === "travel"}
                onToggle={() => setOpen(open === "travel" ? null : "travel")}
                kind="travel"
              />
              <ExtraCard
                title="Vihreän matkustamisen tuki"
                open={open === "green"}
                onToggle={() => setOpen(open === "green" ? null : "green")}
                kind="green"
              />
              <ExtraCard
                title="Osallistumistuki"
                open={open === "participation"}
                onToggle={() =>
                  setOpen(open === "participation" ? null : "participation")
                }
                kind="participation"
              />
            </div>
          </div>

          {/* spacing at bottom */}
          <div className="h-8" />
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

type ExtraKind = "travel" | "green" | "participation";

function ExtraCard({
  title,
  open,
  onToggle,
  kind,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  kind: ExtraKind;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);

  // Measure content height for smooth max-height transitions
  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setMeasured(contentRef.current.scrollHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  return (
    <div className="rounded-2xl border border-[var(--va-border)] bg-white shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-3 text-left bg-[var(--va-orange-50)]"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`extra-content-${kind}`}
      >
        <span className="font-semibold">{title}</span>
        <FiChevronDown
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {/* Animated content container */}
      <div
        id={`extra-content-${kind}`}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: open ? measured : 0 }}
        aria-hidden={!open}
      >
        <div
          ref={contentRef}
          className="p-5 text-sm text-[var(--typography)] space-y-3"
        >
          {kind === "travel" && (
            <>
              <p>
                Olet oikeutettu kertaluonteiseen{" "}
                <strong>matka-apurahaan</strong>, joka lasketaan Helsingin ja
                kohdemaan etäisyyden mukaisesti. Tuki on tarkoitettu kattamaan
                koko meno–paluumatkan.
              </p>
              <p>
                Apurahan yhteyteen lisätään yleensä{" "}
                <strong>matkatavapäivä</strong>, jolta maksetaan päivärahan
                suuruinen apuraha. Etäisyyden laskemiseen käytetään Euroopan
                komission työkalua: Distance Calculator | Erasmus+ (europa.eu).
              </p>
              <div className="mt-3">
                <div className="font-semibold mb-1">Matka‑apurahan määrä:</div>
                <ul className="grid grid-cols-1 gap-1 font-mono text-[14px]">
                  <li>10–90 km — 28 €</li>
                  <li>100–499 km — 211 €</li>
                  <li>500–1999 km — 309 €</li>
                  <li>2000–2999 km — 395 €</li>
                  <li>3000–3999 km — 580 €</li>
                  <li>4000–7999 km — 1188 €</li>
                  <li>8000 km → 1735 €</li>
                </ul>
              </div>
            </>
          )}

          {kind === "green" && (
            <>
              <p>
                Olet oikeutettu kertaluonteiseen{" "}
                <strong>matka-apurahaan</strong>, joka lasketaan Helsingin ja
                kohdemaan etäisyyden mukaisesti. Tuki on tarkoitettu kattamaan
                koko meno–paluumatkan.
              </p>
              <p>
                Jos matkustat <strong>vähäpäästöisillä kulkuneuvoilla</strong>{" "}
                (esim. bussi, juna, kimppakyyti), voit saada korotetun
                matka-apurahan sekä <strong>enintään kuusi matkapäivää</strong>,
                joista maksetaan apurahaa. Vihreän matkustamisen avustus
                maksetaan toteutumisen mukaan tositteiden perusteella.
              </p>
              <p>
                Sinun tulee täyttää{" "}
                <strong>vihreän matkustamisen vakuuslomake</strong>.
              </p>
              <div className="mt-3">
                <div className="font-semibold mb-1">
                  Vihreän matkustamisen tuen määrä:
                </div>
                <ul className="grid grid-cols-1 gap-1 font-mono text-[14px]">
                  <li>10–90 km — 56 €</li>
                  <li>100–499 km — 285 €</li>
                  <li>500–1999 km — 417 €</li>
                  <li>2000–2999 km — 535 €</li>
                  <li>3000–3999 km — 785 €</li>
                  <li>4000–7999 km — 1188 €</li>
                  <li>8000 km → 1735 €</li>
                </ul>
              </div>
            </>
          )}

          {kind === "participation" && (
            <>
              <p>
                Osallistumistuki on <strong>lisäapuraha</strong>, joka on
                tarkoitettu opiskelijalle, jolla on muita vähemmän
                mahdollisuuksia lähteä Erasmus+‑vaihtoon.
              </p>
              <p className="font-semibold">
                Voit olla oikeutettu tukeen, jos kuulut johonkin seuraavista
                ryhmistä:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Perheelliset opiskelijat (alakouluikäinen lapsi/lapsia
                  huollettavana) — virkatodistus
                </li>
                <li>
                  Omaishoitajat — kunnan kanssa tehty sopimus omaishoidosta
                </li>
                <li>Opiskelijat, joilla on EU:n vammaiskortti</li>
                <li>
                  Vakavista ja kroonisista terveysongelmista kärsivät (vähintään
                  keskivaikea toimintakykyvaje)
                </li>
                <li>
                  Kansainvälistä suojelua saaneet opiskelijat (pakolaiset,
                  turvapaikanhakijat, oleskelulupa saatu suojeluperustein —
                  oleskelulupa tai pakolaisen matkustusasiakirja)
                </li>
              </ul>
              <p>
                Hae osallistumistukea erillisellä{" "}
                <strong>vakuuslomakkeella</strong>.
              </p>
              <p>
                Todellisiin kuluihin perustuva tuki voi{" "}
                <strong>kattaa jopa 100 % ylimääräisistä kustannuksista</strong>
                , joita vaihto aiheuttaa, kuten: esteettömän asumiseen,
                liikkumiseen, opiskeluun liittyviin erityisjärjestelyihin
                (oppimateriaalit, apuvälineet), avustajien ja valmentajien
                elinkustannuksiin.
              </p>
              <p>
                Lisätietoa esteettömän vaihdon suuntaamisesta löydät
                Opetushallituksen sivuilta ja omalta kv‑asiantuntijaltasi.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
