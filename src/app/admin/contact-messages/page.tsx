"use client";
import React, { useState, useEffect } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
}

const AdminContactPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    []
  );
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    const fetchMessages = async () => {
      setLoading(true);
      const mock: ContactMessage[] = [
        {
          id: 1,
          name: "Matti Meikäläinen",
          email: "matti@example.com",
          topic: "Vaihto-ohjelman hakeminen",
          message: "Hei, haluaisin tietää lisää hakuprosessista.",
          created_at: "2025-10-06 14:32",
        },
        {
          id: 2,
          name: "Anna Virtanen",
          email: "anna@example.com",
          topic: "Sivuston toiminta",
          message: "Lomakkeen lähetys ei toiminut eilen.",
          created_at: "2025-10-06 09:18",
        },
        {
          id: 3,
          name: "John Doe",
          email: "john@metropolia.fi",
          topic: "General question",
          message: "Hi, is the exchange available for spring 2026sefsefs?",
          created_at: "2025-10-05 18:45",
        },
        {
          id: 4,
          name: "John Doe",
          email: "john@metropolia.fi",
          topic: "General question",
          message: "Hi, is the exchange available for spring 2026sefsef?",
          created_at: "2025-10-05 18:45",
        },
        {
          id: 5,
          name: "John Doe",
          email: "john@metropolia.fi",
          topic: "General question",
          message: "Hi, is the exchange available for spring 2026 dgdsrgrg?",
          created_at: "2025-10-05 18:45",
        },
        {
          id: 6,
          name: "John Doe",
          email: "john@metropolia.fi",
          topic: "General question",
          message: "Hi, is the exchange available for spring 2026wadawda?",
          created_at: "2025-10-05 18:45",
        },
        {
          id: 7,
          name: "John Doe",
          email: "john@metropolia.fi",
          topic: "General question",
          message: "Hi, is the exchange available for spring 2026grggesfd?",
          created_at: "2025-10-05 18:45",
        },
      ];
      setTimeout(() => {
        setMessages(mock);
        setFilteredMessages(mock);
        setLoading(false);
      }, 500);
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const lowerFilter = filter.toLowerCase();
    setFilteredMessages(
      messages.filter(
        (msg) =>
          msg.name.toLowerCase().includes(lowerFilter) ||
          msg.email.toLowerCase().includes(lowerFilter) ||
          msg.topic.toLowerCase().includes(lowerFilter)
      )
    );
  }, [filter, messages]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    alert(`Reply sent to ${selectedMessage.email}: ${reply}`);
    setReply("");
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
            <h2 className="text-xl font-semibold text-[#FF5000]">
              Saapuneet viestit
            </h2>
            <input
              type="text"
              placeholder="Hae nimen, sähköpostin tai aiheen perusteella..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
            />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-10">
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No matching messages.
            </div>
          ) : (
            <div className="overflow-y-auto h-[60vh] space-y-3 pr-2">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                    selectedMessage?.id === msg.id
                      ? "border-[#FF5000] bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-[#FF5000]">
                      {msg.topic}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {msg.created_at}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {msg.message}
                  </p>
                  <p className="text-xs text-gray-500">{msg.name}</p>
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
                  <p className="font-semibold">{selectedMessage.topic}</p>
                  <p className="text-sm text-gray-500">
                    From: {selectedMessage.name} ({selectedMessage.email})
                  </p>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <form onSubmit={handleReply} className="mt-4 space-y-3">
                <label htmlFor="reply" className="block font-semibold">Kirjoita vastaus</label>
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
              Valitse viesti klikkaamalla ja näet sen tarkemmat tiedot sekä voit
              vastata siihen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactPage;
