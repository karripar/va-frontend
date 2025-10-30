"use client";
import React, { useEffect, useState } from "react";
import { useContactMessages } from "@/hooks/messageHooks";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";

const AdminContactPage: React.FC = () => {
  const { getMessages, replyToMessage, loading, error } = useContactMessages();
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessageResponse[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("");

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
        Yhteydenottojen hallinta
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: message list */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#FF5000]">Saapuneet viestit</h2>
            <input
              type="text"
              placeholder="Hae nimen, sähköpostin tai aiheen perusteella..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-10">Ladataan viestejä...</div>
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
                  className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                    selectedMessage?._id === msg._id
                      ? "border-[#FF5000] bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-[#FF5000]">{msg.subject}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleString("fi-FI")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-500">
                    {msg.name} — {msg.status === "new" ? "🟢 Uusi" : "📨 Vastattu"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: message details + reply panel */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-[#FF5000]">
            {selectedMessage ? "Viestin tarkastelu" : "Valitse viesti"}
          </h2>

          {selectedMessage ? (
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-1">
                <div>
                  <p className="font-semibold">{selectedMessage.subject}</p>
                  <p className="text-sm text-gray-500">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <form onSubmit={handleReply} className="mt-4 space-y-3">
                <label htmlFor="reply" className="block font-semibold">
                  Kirjoita vastaus
                </label>
                <textarea
                  id="reply"
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
                  placeholder="Kirjoita vastauksesi tähän..."
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition"
                >
                  Lähetä vastaus
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
              Valitse viesti vasemmalta nähdäksesi sen sisällön ja vastataksesi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactPage;
