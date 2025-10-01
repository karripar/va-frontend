'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FiMenu,
  FiX,
  FiArrowLeft,
  FiSend,
  FiChevronRight,
} from 'react-icons/fi';

const navItems = [
  { label: 'ETUSIVU', href: '/' },
  { label: 'HAKUPROSESSI JA OHJEET', href: '#' },
  { label: 'VAIHTOKOHTEET', href: '#' },
  { label: 'APURAHAT JA KUSTANNUKSET', href: '#' },
  { label: 'KOKEMUKSET JA VINKIT', href: '#' },
  { label: 'AI-CHAT JA FAQ', href: '/ai-chat', active: true },
  { label: 'PROFIILI', href: '#' },
  { label: 'OTA YHTEYTTÄ', href: '#' },
];

type Role = 'bot' | 'user';
type ChatMessage = { id: string; role: Role; text: string };

export default function AIChatPage() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'bot',
      text: 'Hei! Minulta voit kysyä opiskelijavaihtoon liittyviä kysymyksiä.',
    },
    {
      id: 'm2',
      role: 'user',
      text: 'Missä voin asua vaihdon aikana?',
    },
    {
      id: 'm3',
      role: 'bot',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do…',
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState(false);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    const text = msg.trim();
    if (!text) return;
    const newMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
    setMessages((prev) => [...prev, newMsg]);
    setMsg('');

    // Mock bot reply for demo/testing
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: 'Kiitos kysymyksestä! Tämä on demovastaus. (Kytketään myöhemmin backendiin.)',
        },
      ]);
      setTyping(false);
    }, 700);
  }

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
          <div className="font-semibold tracking-wide">AI-Chat</div>
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
          AI-CHAT JA FAQ
        </div>
        <nav className="px-4 py-3 space-y-2 overflow-y-auto h-[calc(100%-6rem)]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-semibold tracking-wide hover:bg-[var(--va-mint-60)] ${
                item.active ? 'bg-[var(--va-mint-80)]' : ''
              }`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
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
      <main className="mx-auto w-full grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Spacer for sidebar on large screens */}
        <div className="hidden lg:block" />
        <section className="px-4 sm:px-6 lg:px-10 py-6 space-y-6 max-w-none">
          {/* Back row */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[var(--va-muted)] hover:opacity-80"
            >
              <FiArrowLeft /> Takaisin
            </Link>
          </div>

          {/* Chat card */}
          <div className="rounded-lg border border-[var(--va-border)] bg-white shadow-sm p-4 sm:p-6 flex flex-col min-h-[45vh] sm:min-h-[55vh] lg:min-h-[65vh] xl:min-h-[70vh]">
            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto pr-1">
              {messages.map((m, i) => {
                const prev = messages[i - 1];
                const groupStart = !prev || prev.role !== m.role;
                return (
                  <div key={m.id} className={groupStart ? 'mt-6' : 'mt-2'}>
                    <MessageBubble role={m.role} text={m.text} />
                  </div>
                );
              })}
              {typing && (
                <div className="mt-6">
                  <TypingBubble />
                </div>
              )}
            </div>
            {/* Input row */}
            <form
              className="mt-4 flex items-center gap-2 rounded-full border border-[var(--va-border)] px-3 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Kysy kysymys..."
                className="flex-1 bg-transparent outline-none text-sm"
                aria-label="Kirjoita viesti"
              />
              <button
                type="submit"
                aria-label="Lähetä"
                className="text-neutral-700 hover:text-black disabled:opacity-40"
                disabled={!msg.trim()}
              >
                <FiSend />
              </button>
            </form>
          </div>

          {/* FAQ heading */}
          <div>
            <h2 className="font-semibold text-lg">
              Usein kysyttyjä kysymyksiä ja vastauksia
            </h2>
          </div>

          {/* FAQ list */}
          <div className="space-y-4">
            <FAQItem title="Miten haen apurahaa?" />
            <FAQItem title="Eri vaihto-ohjelmat?" />
          </div>
        </section>
      </main>
    </div>
  );
}

function FAQItem({ title }: { title: string }) {
  return (
    <button className="w-full text-left rounded-lg border border-[var(--va-border)] bg-[color-mix(in_oklab,var(--va-orange)_15%,white)] px-4 py-3 shadow-sm hover:shadow transition flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <FiChevronRight />
    </button>
  );
}

function MessageBubble({ role, text }: { role: Role; text: string }) {
  const base =
    'w-fit max-w-[96%] sm:max-w-[88%] lg:max-w-[72ch] px-3 py-2 rounded-lg shadow-sm whitespace-pre-wrap break-words leading-snug';
  if (role === 'user') {
    return (
      <div className="ml-auto flex justify-end">
        <div
          className={`${base} bg-neutral-100 text-neutral-700 border border-neutral-200`}
        >
          {text}
        </div>
      </div>
    );
  }
  return <div className={`${base} bg-neutral-700/95 text-white`}>{text}</div>;
}

function TypingBubble() {
  return (
    <div className="w-fit max-w-[70%] px-3 py-2 rounded-lg shadow-sm bg-neutral-200 text-neutral-700 border border-neutral-200">
      <span className="inline-flex items-center gap-1 align-middle">
        <span className="sr-only">Botti kirjoittaa</span>
        <Dot />
        <Dot className="[animation-delay:150ms]" />
        <Dot className="[animation-delay:300ms]" />
      </span>
    </div>
  );
}

function Dot({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full bg-neutral-500 animate-bounce ${className}`}
      aria-hidden
    />
  );
}
