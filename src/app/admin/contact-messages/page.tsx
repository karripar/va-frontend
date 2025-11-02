"use client";
import React, { useEffect, useState } from "react";
import { useContactMessages } from "@/hooks/messageHooks";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";
import { useLanguage } from "@/context/LanguageContext";

const AdminContactPage: React.FC = () => {
  const { getMessages, replyToMessage, loading, error } = useContactMessages();
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessageResponse[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("");
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    en: {
      manageContacts: "Manage Contact Messages",
      receivedMessages: "Received Messages",
      searchPlaceholder: "Search by name, email, or subject...",
      loadingMessages: "Loading messages...",
      noMessages: "No messages found.",
      viewMessage: "View Message",
      writeReply: "Write a Reply",
      sendReply: "Send Reply",
      replySent: "Reply sent to",
      replyFailed: "Failed to send reply",
      selectMessage: "Select a message from the left to view its content and reply.",
      fromSender: "From",
      newStatus: "NEW",
      repliedStatus: "REPLIED",
      previousResponses: "Previous Responses",
    },
    fi: {
      manageContacts: "Yhteydenottojen hallinta",
      receivedMessages: "Saapuneet viestit",
      searchPlaceholder: "Hae nimen, sähköpostin tai aiheen perusteella...",
      loadingMessages: "Ladataan viestejä...",
      noMessages: "Ei viestejä.",
      viewMessage: "Tarkastele viestiä",
      writeReply: "Kirjoita vastaus",
      sendReply: "Lähetä vastaus",
      replySent: "Vastaus lähetetty osoitteeseen",
      replyFailed: "Viestin lähetys epäonnistui",
      selectMessage: "Valitse viesti vasemmalta nähdäksesi sen sisällön ja vastataksesi.",
      fromSender: "Lähettäjä",
      newStatus: "UUSI",
      repliedStatus: "VASTATTU",
      previousResponses: "Aiemmat vastaukset",

    },
  };

  // Fetch messages from backend
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages();
        if (response && "messages" in response) {
          console.log("Loaded messages:", response);
          setMessages(response.messages);
          setFilteredMessages(response.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, []);

  // Handle filtering
  useEffect(() => {
    const lower = filter.toLowerCase();
    setFilteredMessages(
      messages.filter(
        (msg) =>
          msg.name.toLowerCase().includes(lower) ||
          msg.email.toLowerCase().includes(lower) ||
          msg.subject.toLowerCase().includes(lower)
      )
    );
  }, [filter, messages]);

  // ✅ Handle reply
  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      await replyToMessage(selectedMessage._id, reply);
      alert(`Vastaus lähetetty ${selectedMessage.email} osoitteeseen`);
      setReply("");
    } catch {
      alert("Viestin lähetys epäonnistui");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-[#FF5000] text-center">
        {translations[language]?.manageContacts || "Manage Contact Messages"}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: message list */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#FF5000]">
              {translations[language]?.receivedMessages || "Incoming Messages"}
            </h2>
            <input
              type="text"
              placeholder={translations[language]?.searchPlaceholder || "Search by name, email, or subject..."}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-10">{translations[language].loadingMessages}</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Ei viestejä.</div>
          ) : (
            <div className="overflow-y-auto h-[60vh] space-y-3 pr-2">
  {filteredMessages.map((msg) => (
    <div
      key={msg._id}
      onClick={() => setSelectedMessage(msg)}
      className={`relative p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
        selectedMessage?._id === msg._id
          ? "border-[#FF5000] bg-orange-50"
          : msg.status === "new"
          ? "border-green-400 bg-green-50" // highlight new messages
          : "border-gray-200 bg-white"
      }`}
    >
      {/* NEW badge for new messages */}
      {msg.status === "new" && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {translations[language]?.newStatus || "NEW"}
        </span>
      )}

      <div className="flex justify-between items-center my-3">
        <h3
          className={`font-semibold ${
            msg.status === "new" ? "text-green-600" : "text-[#FF5000]"
          }`}
        >
          {msg.subject}
        </h3>
        <span className="text-xs text-gray-400">
          {new Date(msg.createdAt).toLocaleString("fi-FI")}
        </span>
      </div>

      <p
        className={`text-sm line-clamp-2 ${
          msg.status === "new" ? "text-gray-800 font-medium" : "text-gray-700"
        }`}
      >
        {msg.message}
      </p>
      <p className="text-xs text-gray-500">
        {msg.name} — {msg.status === "new" ? `🟢 ${translations[language].newStatus}` : `📨 ${translations[language].repliedStatus}`}
      </p>
    </div>
  ))}
</div>

          )}
        </div>

        {/* Right column: message details + reply panel */}
<div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
  <h2 className="text-xl font-semibold mb-4 text-[#FF5000]">
    {translations[language]?.viewMessage || "View Message"}
  </h2>

  {selectedMessage ? (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-1">
        <div>
          <p className="font-semibold text-lg text-[#FF5000]">{selectedMessage.subject}</p>
          <p className="text-sm text-gray-500">
            {translations[language].fromSender}: {selectedMessage.name} ({selectedMessage.email})
          </p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
        </div>

        {/* Show previous responses if available */}
        {selectedMessage.responses && selectedMessage.responses.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-3">
            <h3 className="font-semibold text-gray-700 mb-2">
              {translations[language]?.previousResponses || "Previous Responses"}
            </h3>
            <div className="space-y-2">
              {selectedMessage.responses.map((res, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800"
                >
                  <p className="font-medium text-[#FF5000] mb-1">
                    {language === "fi" ? "Vastaus" : "Response"} #{index + 1}
                  </p>
                  <p className="whitespace-pre-line">{res.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(res.sentAt).toLocaleString("fi-FI")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply form */}
      <form onSubmit={handleReply} className="mt-4 space-y-3">
        <label htmlFor="reply" className="block font-semibold">
          {translations[language]?.writeReply || "Write a Reply"}
        </label>
        <textarea
          id="reply"
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
          placeholder={translations[language]?.writeReply || "Write your reply here..."}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition"
        >
          {translations[language]?.sendReply || "Send Reply"}
        </button>
      </form>
    </div>
  ) : (
    <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
      {translations[language]?.selectMessage ||
        "Select a message from the left to view its content and reply."}
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default AdminContactPage;
