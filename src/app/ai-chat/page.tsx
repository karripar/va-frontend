'use client';
import { useEffect, useRef, useState } from 'react';
import { FiSend, FiChevronDown, FiChevronUp, FiBook } from 'react-icons/fi';
import { FaPlane, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { IconType } from 'react-icons';
import {
  sendChatMessage,
  ChatMessage as APIChatMessage,
} from '@/lib/aiChatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/context/LanguageContext';
import { faqTranslations } from '@/lib/translations/aiChatFAQ';

type Role = 'bot' | 'user';
type ChatMessage = { id: string; role: Role; text: string };

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  links?: Array<{ title: string; url: string }>;
}

const categoryIcons: Record<string, IconType> = {
  Yleistä: FiBook,
  General: FiBook,
  Hakeminen: FaFileAlt,
  Applying: FaFileAlt,
  Apurahat: FaMoneyBillWave,
  Grants: FaMoneyBillWave,
  Dokumentit: FaFileAlt,
  Documents: FaFileAlt,
  Matkustaminen: FaPlane,
  Traveling: FaPlane,
};

export default function AIChatPage() {
  const [msg, setMsg] = useState('');
  const { language } = useLanguage();
  const faqData: FAQItem[] = faqTranslations[language] || faqTranslations['fi'];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'bot',
      text: 'Hi! You can ask me questions about student exchange.',
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Kaikki');

  const categories = [
    'Kaikki',
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];

  const filteredFAQs = faqData.filter((item) => {
    return selectedCategory === 'Kaikki' || item.category === selectedCategory;
  });

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
            setError(chunk.error || 'Virhe tapahtui. Yritä uudelleen.');
          }
        },
        () => {
          setTyping(false);
        },
        (err) => {
          console.error('Chat error:', err);
          setError(err.message || 'Virhe tapahtui. Yritä uudelleen.');
          setTyping(false);
        }
      );
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Virhe tapahtui. Yritä uudelleen.');
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
              placeholder="Kirjoita kysymyksesi tähän..."
              aria-label="Kirjoita viesti"
              disabled={typing}
            />
            <button
              type="submit"
              aria-label="Lähetä viesti"
              className="disabled:opacity-40"
              style={{ color: 'var(--typography)' }}
              disabled={!msg.trim() || typing}
            >
              <FiSend />
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2
            className="text-2xl mb-6"
            style={{
              fontFamily: 'var(--font-machina-bold)',
              color: 'var(--va-orange)',
            }}
          >
            {language === 'fi' ? 'Usein kysytyt kysymykset' : 'Frequently Asked Questions'}
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors text-sm ${
                  selectedCategory === category
                    ? 'bg-[var(--va-orange)] text-white'
                    : 'bg-white text-[var(--typography)] border border-[var(--va-border)] hover:border-[var(--va-orange)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.map((item) => {
              const Icon = categoryIcons[item.category];
              const isExpanded = expandedFaqId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-[var(--va-border)] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedFaqId(isExpanded ? null : item.id)
                    }
                    className="w-full px-6 py-4 flex items-start gap-4"
                  >
                    <Icon className="text-[var(--va-orange)] mt-1 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-[var(--typography)] mb-1">
                        {item.question}
                      </h3>
                      <span className="text-xs text-[var(--typography)]">
                        {item.category}
                      </span>
                    </div>
                    {isExpanded ? (
                      <FiChevronUp className="text-[var(--typography)] mt-1 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="text-[var(--typography)] mt-1 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-4 pt-4 border-t">
                      <p className="text-[var(--typography)] whitespace-pre-line mb-3">
                        {item.answer}
                      </p>
                      {item.links && item.links.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold text-[var(--typography)] mb-2">
                            {language === 'fi' ? 'Hyödyllisiä linkkejä:' : 'Useful links:'}
                          </p>
                          <div className="space-y-1">
                            {item.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-[var(--va-orange)] hover:underline"
                              >
                                → {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <h3 className="font-bold text-[var(--typography)] mb-2">
            {language === 'fi' ? 'Etkö löytänyt vastausta?' : 'Didn\'t find an answer?'}
          </h3>
          <p className="text-[var(--typography)] mb-4">
            {language === 'fi' 
              ? 'Kysy kysymyksesi AI-chatilta ylhäällä tai ota yhteyttä kansainvälisiin palveluihin.' 
              : 'Ask your question to the AI chat above or contact international services.'}
          </p>
          <a
            href="/contact"
            className="inline-block px-4 py-2 bg-white text-[var(--typography)] rounded-lg border hover:bg-gray-50"
          >
            {language === 'fi' ? 'Ota yhteyttä' : 'Contact us'}
          </a>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ role, text }: { role: Role; text: string }) {
  const base =
    'w-fit max-w-[100%] px-4 py-3 rounded-2xl break-words leading-relaxed shadow-sm';

  // Split text if it contains "Lähteet:"
  let content = text;
  let sources = '';
  // Case insensitive search for "Lähteet:" or "Sources:"
  const sourcesMatch = text.match(/(?:\n|^)(?:Lähteet|Sources):/i);

  if (sourcesMatch && sourcesMatch.index !== undefined) {
    content = text.substring(0, sourcesMatch.index).trim();
    sources = text
      .substring(sourcesMatch.index + sourcesMatch[0].length)
      .trim();
  }

  if (role === 'user') {
    return (
      <div className="ml-auto flex justify-end pl-10">
        <div
          className={`${base} bg-[var(--va-grey-50)] text-[var(--typography)] border border-[var(--va-border)] rounded-br-sm`}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 pr-4">
      {/* Bot Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--va-orange)] flex items-center justify-center text-white font-bold text-xs mt-1 shadow-sm">
        AI
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[90%]">
        <div
          className={`${base} bg-white text-[var(--typography)] border border-[var(--va-border)] rounded-bl-sm`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ul: ({ ...props }) => (
                <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              p: ({ ...props }) => <p className="my-2 last:mb-0" {...props} />,
              strong: ({ ...props }) => (
                <strong className="font-bold" {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className="text-[var(--va-orange)] hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              h1: ({ ...props }) => (
                <h1 className="text-lg font-bold my-2" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-base font-bold my-2" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-sm font-bold my-1" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {sources && (
          <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-sm animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="font-bold text-[var(--va-orange)] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
              <FiBook className="w-3 h-3" /> Lähteet
            </p>
            <div className="prose prose-sm max-w-none prose-ul:my-1 prose-li:my-0 text-gray-600">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ ...props }) => (
                    <ul className="list-none space-y-2 pl-0" {...props} />
                  ),
                  li: ({ ...props }) => (
                    <li
                      className="flex items-start gap-2 bg-white p-2 rounded border border-orange-100 shadow-sm"
                      {...props}
                    >
                      <span className="text-[var(--va-orange)] mt-1 text-xs">
                        📄
                      </span>
                      <span className="flex-1">{props.children}</span>
                    </li>
                  ),
                  a: ({ ...props }) => (
                    <a
                      className="text-[var(--va-orange)] hover:underline font-medium break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                }}
              >
                {sources}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
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
