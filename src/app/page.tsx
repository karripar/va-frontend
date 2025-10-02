'use client';
import Link from 'next/link';
import {
  FiMessageSquare,
  FiGlobe,
  FiFileText,
} from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 lg:px-10 py-6">
        <div className="md:mt-8 mt-6 md:mb-14 mb-10 flex justify-center flex-col items-center text-center">
          <h1 className="text-xl md:text-2xl tracking-wide" style={{ fontFamily: "var(--font-machina-bold)" }}>
            Tervetuloa Metropolian vaihto­sovellukseen!
          </h1>
          <p className="mt-3 max-w-2xl text-md" style={{
                fontFamily: "var(--font-montreal-mono-medium)"}}>
            Löydä kohdemaat, apurahat ja vinkit yhdestä paikasta.
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 uppercase" style={{ fontFamily: "var(--font-machina-bold)" }}>
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
      </main>

      {/* Vertical chat tab */}
      <a
        href="/ai-chat"
        className="fixed -right-6 top-1/2 -translate-y-1/2 z-40 origin-center -rotate-90 bg-[var(--va-orange)] text-[var(--background)] px-4 py-3 rounded-t-md shadow hover:brightness-95 text-sm tracking-wider"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        CHAT
      </a>
    </div>
  );
}

function Card({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--va-grey-50)] p-5 shadow-sm transition hover:shadow-md cursor-pointer">
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
