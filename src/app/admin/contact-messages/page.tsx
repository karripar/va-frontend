"use client";
import React, { use, useEffect, useState } from "react";
import { useContactMessages } from "@/hooks/messageHooks";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";
import { useLanguage } from "@/context/LanguageContext";
import MessageList from "@/components/admin-contact-handler/MessageList";
import MessageDetail from "@/components/admin-contact-handler/MessageDetail";
import { useAdminContactTranslations } from "@/lib/translations/AdminContactHandler";

const AdminContactPage: React.FC = () => {
  const { getMessages, replyToMessage, loading, error } = useContactMessages();
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessageResponse[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [filter, setFilter] = useState("");
  const { language } = useLanguage();
  const t = useAdminContactTranslations(language);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getMessages();
        if (response && "messages" in response) {
          setMessages(response.messages);
          setFilteredMessages(response.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();
  }, []);

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

  const handleReply = async (id: string, reply: string, email: string) => {
    try {
      await replyToMessage(id, reply);
      alert(`${t.replySent} ${email}`);
    } catch {
      alert(t.replyFailed);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-[#FF5000] text-center">
        {t.manageContacts}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <MessageList
          loading={loading}
          error={error}
          filter={filter}
          setFilter={setFilter}
          messages={filteredMessages}
          selectedMessage={selectedMessage}
          onSelectMessage={setSelectedMessage}
          t={t}
        />

        <MessageDetail selectedMessage={selectedMessage} onReply={handleReply} t={t} />
      </div>
    </div>
  );
};

export default AdminContactPage;
