import React from "react";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";
import MessageCard from "./MessageCard";

interface Props {
  loading: boolean;
  error: string | null;
  filter: string;
  setFilter: (value: string) => void;
  messages: ContactMessageResponse[];
  selectedMessage: ContactMessageResponse | null;
  onSelectMessage: (msg: ContactMessageResponse) => void;
  t: Record<string, string>;
}

const MessageList: React.FC<Props> = ({
  loading,
  error,
  filter,
  setFilter,
  messages,
  selectedMessage,
  onSelectMessage,
  t,
}) => (
  <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-[#FF5000]">{t.receivedMessages}</h2>
      <input
        type="text"
        placeholder={t.searchPlaceholder}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
      />
    </div>

    {loading ? (
      <div className="text-center text-gray-500 py-10">{t.loadingMessages}</div>
    ) : error ? (
      <div className="text-center text-red-500 py-10">{error}</div>
    ) : messages.length === 0 ? (
      <div className="text-center text-gray-500 py-10">{t.noMessages}</div>
    ) : (
      <div className="overflow-y-auto h-[60vh] space-y-3 pr-2">
        {messages.map((msg) => (
          <MessageCard
            key={msg._id}
            msg={msg}
            isSelected={selectedMessage?._id === msg._id}
            onClick={() => onSelectMessage(msg)}
            t={t}
          />
        ))}
      </div>
    )}
  </div>
);

export default MessageList;
