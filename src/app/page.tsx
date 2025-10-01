'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FiMenu,
  FiX,
  FiMessageSquare,
  FiGlobe,
  FiFileText,
} from 'react-icons/fi';

const navItems = [
  { label: 'ETUSIVU', active: true },
  { label: 'HAKUPROSESSI JA OHJEET' },
  { label: 'VAIHTOKOHTEET' },
  { label: 'APURAHAT JA KUSTANNUKSET' },
  { label: 'KOKEMUKSET JA VINKIT' },
  { label: 'AI-CHAT JA FAQ' },
  { label: 'PROFIILI' },
  { label: 'OTA YHTEYTTÄ' },
];

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[var(--va-orange)] text-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <button
            aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
            className="p-2 -ml-2 rounded-md hover:bg-white/10 focus-ring"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="font-semibold tracking-wide uppercase">Etusivu</div>
          <div className="w-6" />
        </div>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-[280px] bg-white border-r border-[var(--va-border)] shadow-lg transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Sivunavigaatio"
      >
        <div className="h-14 bg-[var(--va-mint-80)] flex items-center px-4 font-semibold tracking-wide">
          ETUSIVU
        </div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-6rem)]">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`block rounded-md px-3 py-2 text-sm font-semibold tracking-wide hover:bg-[var(--va-mint-60)] ${
                item.active ? 'bg-[var(--va-mint-80)]' : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-[var(--va-border)]">
          <button className="w-full rounded-full bg-white border border-[var(--va-border)] px-4 py-2 text-xs font-bold tracking-wide text-[var(--va-orange)] hover:bg-[var(--va-mint-40)] focus-ring">
            KIRJAUDU ULOS
          </button>
          <button
            aria-label="Sulje valikko"
            onClick={() => setOpen(false)}
            className="absolute -right-6 bottom-4 bg-white rounded-full p-2 border border-[var(--va-border)] shadow"
          >
            <FiX />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block" />
        <section className="px-4 sm:px-6 lg:px-10 py-6">
          <div className="mt-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
              Tervetuloa Metropolian vaihto­sovellukseen!
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--va-muted)]">
              Löydä kohdemaat, apurahat ja vinkit yhdestä paikasta.
            </p>
          </div>

          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              icon={
                <FiFileText className="text-[var(--va-orange)]" size={26} />
              }
              title="VAIHTOON HAKEMINEN"
            />
            <Card icon={<CoinIcon />} title="APURAHAT" />
            <Card
              icon={<FiGlobe className="text-[var(--va-orange)]" size={26} />}
              title="KOHDEMAAT"
            />
            <Link href="/ai-chat" className="block">
              <Card
                icon={
                  <FiMessageSquare
                    className="text-[var(--va-orange)]"
                    size={26}
                  />
                }
                title="AI–CHAT JA FAQ"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* Vertical chat tab */}
      <a
        href="#"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 origin-right rotate-90 bg-[var(--va-orange)] text-white px-3 py-2 rounded-t-md shadow hover:brightness-95"
      >
        CHAT
      </a>
    </div>
  );
}

function Card({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--va-border)] bg-[var(--va-card)] p-5 shadow-sm transition hover:shadow-md">
      <div className="grid h-12 w-12 place-items-center rounded-md border-2 border-[var(--va-orange)] text-[var(--va-orange)]">
        {icon}
      </div>
      <div className="font-extrabold text-sm tracking-wide">{title}</div>
    </div>
  );
}

function CoinIcon() {
  return (
    <div className="text-[var(--va-orange)]" aria-hidden>
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 6v12M8.5 9.5h5a2.5 2.5 0 1 1 0 5h-5" />
      </svg>
    </div>
  );
}
