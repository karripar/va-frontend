"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiSend, FiChevronRight } from "react-icons/fi";

type Role = "bot" | "user";
type ChatMessage = { id: string; role: Role; text: string };

export default function AIChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "bot",
      text: "Hei! Minulta voit kysyä opiskelijavaihtoon liittyviä kysymyksiä.",
    },
    {
      id: "m2",
      role: "user",
      text: "Missä voin asua vaihdon aikana?",
    },
    {
      id: "m3",
      role: "bot",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do…",
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
    const newMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, newMsg]);
    setMsg("");

    // Mock bot reply for demo/testing
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "Kiitos kysymyksestä! Tämä on demovastaus. (Kytketään myöhemmin backendiin.)",
        },
      ]);
      setTyping(false);
    }, 700);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 space-y-6">
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
        <div
          className="rounded-lg border border-[var(--va-grey)] shadow-md pb-4 px-4 flex flex-col min-h-[45vh] sm:min-h-[55vh] lg:min-h-[65vh] xl:min-h-[70vh]"
          style={{ backgroundColor: "var(--va-card)" }}
        >
          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto pr-1 md:text-md text-sm">
            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const groupStart = !prev || prev.role !== m.role;
              return (
                <div key={m.id} className={groupStart ? "mt-6" : "mt-2"}>
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
            className="mt-4 flex items-center gap-2 rounded-full border border-[var(--va-grey)] px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-[var(--typography)]"
              placeholder="Kysy kysymys..."
              aria-label="Kirjoita viesti"
            />
            <button
              type="submit"
              aria-label="Lähetä"
              className="disabled:opacity-40"
              style={{ color: "var(--typography)" }}
              disabled={!msg.trim()}
            >
              <FiSend />
            </button>
          </form>
        </div>

        {/* FAQ heading */}
        <div className="mb-6 mt-12">
          <h2
            className="text-lg"
            style={{ fontFamily: "var(--font-machina-regular)" }}
          >
            Usein kysyttyjä kysymyksiä ja vastauksia
          </h2>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          <FAQItem title="Miten haen apurahaa?" />
          <FAQItem title="Eri vaihto-ohjelmat?" />
        </div>
      </main>
    </div>
  );
}

function FAQItem({ title }: { title: string }) {
  return (
    <button
      className="w-full text-left rounded-lg px-4 py-3 shadow-sm hover:shadow transition flex items-center justify-between"
      style={{
        backgroundColor: "var(--va-orange-50)",
        color: "var(--typography)",
      }}
    >
      <span className="font-medium">{title}</span>
      <FiChevronRight />
    </button>
  );
}

function MessageBubble({ role, text }: { role: Role; text: string }) {
  const base =
    "w-fit max-w-[96%] sm:max-w-[88%] lg:max-w-[72ch] px-3 py-2 rounded-lg whitespace-pre-wrap break-words leading-snug";
  if (role === "user") {
    return (
      <div className="ml-auto flex justify-end">
        <div
          className={`${base}`}
          style={{
            backgroundColor: "var(--va-grey-50)",
            color: "var(--typography)",
          }}
        >
          {text}
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${base}`}
      style={{
        backgroundColor: "var(--va-dark-grey)",
        color: "var(--background)",
      }}
    >
      {text}
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      className="w-fit max-w-[70%] px-3 py-2 rounded-lg shadow-sm border"
      style={{
        backgroundColor: "var(--va-grey-50)",
        color: "var(--typography)",
        borderColor: "var(--va-grey)",
      }}
    >
      <span className="inline-flex items-center gap-1 align-middle">
        <span className="sr-only">Botti kirjoittaa</span>
        <Dot />
        <Dot className="[animation-delay:150ms]" />
        <Dot className="[animation-delay:300ms]" />
      </span>
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full animate-bounce ${className}`}
      style={{ backgroundColor: "var(--va-dark-grey)" }}
      aria-hidden
    />
  );
}
