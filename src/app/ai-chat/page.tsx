'use client';
import { useEffect, useRef, useState } from 'react';
import { FiSend, FiChevronRight } from 'react-icons/fi';
import {
  sendChatMessage,
  ChatMessage as APIChatMessage,
} from '@/lib/aiChatApi';

type Role = 'bot' | 'user';
type ChatMessage = { id: string; role: Role; text: string };

export default function AIChatPage() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'bot',
      text: 'Hei! Minulta voit kysyä opiskelijavaihtoon liittyviä kysymyksiä.',
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const text = msg.trim();
    if (!text || typing) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setMsg('');
    setTyping(true);
    setError(null);

    // Convert messages to API format
    const apiMessages: APIChatMessage[] = messages.map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));

    // Add the new user message
    apiMessages.push({ role: 'user', content: text });

    let botResponse = '';
    const botMsgId = crypto.randomUUID();

    try {
      await sendChatMessage(
        apiMessages,
        (chunk) => {
          if (chunk.type === 'text' && chunk.content) {
            botResponse += chunk.content;
            setMessages((prev) => {
              const filtered = prev.filter((m) => m.id !== botMsgId);
              return [
                ...filtered,
                {
                  id: botMsgId,
                  role: 'bot' as Role,
                  text: botResponse,
                },
              ];
            });
          } else if (chunk.type === 'error') {
            setError(chunk.error || 'Tapahtui virhe');
          }
        },
        () => {
          setTyping(false);
        },
        (err) => {
          console.error('Chat error:', err);
          setError(err.message || 'Yhteysvirhe. Yritä uudelleen.');
          setTyping(false);
        }
      );
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Tapahtui odottamaton virhe. Yritä uudelleen.');
      setTyping(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-6 space-y-6 my-4">
        {/* Chat card */}
        <div
          className="rounded-lg border border-[var(--va-grey)] shadow-md pb-4 px-4 flex flex-col min-h-[45vh] sm:min-h-[55vh] lg:min-h-[65vh] xl:min-h-[70vh]"
          style={{ backgroundColor: 'var(--va-card)' }}
        >
          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto pr-1 md:text-md text-sm"
          >
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
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
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
              disabled={typing}
            />
            <button
              type="submit"
              aria-label="Lähetä"
              className="disabled:opacity-40"
              style={{ color: 'var(--typography)' }}
              disabled={!msg.trim() || typing}
            >
              <FiSend />
            </button>
          </form>
        </div>

        {/* FAQ heading */}
        <div className="mb-6 mt-12">
          <h2
            className="text-lg"
            style={{ fontFamily: 'var(--font-machina-regular)' }}
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
        backgroundColor: 'var(--va-orange-50)',
        color: 'var(--typography)',
      }}
    >
      <span className="font-medium">{title}</span>
      <FiChevronRight />
    </button>
  );
}

function MessageBubble({ role, text }: { role: Role; text: string }) {
  const base =
    'w-fit max-w-[96%] sm:max-w-[88%] lg:max-w-[72ch] px-3 py-2 rounded-lg whitespace-pre-wrap break-words leading-snug';
  if (role === 'user') {
    return (
      <div className="ml-auto flex justify-end">
        <div
          className={`${base}`}
          style={{
            backgroundColor: 'var(--va-grey-50)',
            color: 'var(--typography)',
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
        backgroundColor: 'var(--va-dark-grey)',
        color: 'var(--background)',
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
        backgroundColor: 'var(--va-grey-50)',
        color: 'var(--typography)',
        borderColor: 'var(--va-grey)',
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

function Dot({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full animate-bounce ${className}`}
      style={{ backgroundColor: 'var(--va-dark-grey)' }}
      aria-hidden
    />
  );
}
