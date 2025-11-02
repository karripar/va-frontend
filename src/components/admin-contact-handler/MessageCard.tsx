import React from "react";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";

interface Props {
  msg: ContactMessageResponse;
  isSelected: boolean;
  onClick: () => void;
  t: Record<string, string>;
}

const MessageCard: React.FC<Props> = ({ msg, isSelected, onClick, t }) => (
  <div
    onClick={onClick}
    className={`relative p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
      isSelected
        ? "border-[#FF5000] bg-orange-50"
        : msg.status === "new"
        ? "border-green-400 bg-green-50"
        : "border-gray-200 bg-white"
    }`}
  >
    {msg.status === "new" && (
      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
        {t.newStatus}
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

    <p className="text-sm line-clamp-2">{msg.message}</p>
    <p className="text-xs text-gray-500">
      {msg.name} —{" "}
      {msg.status === "new"
        ? `🟢 ${t.newStatus}`
        : `📨 ${t.repliedStatus}`}
    </p>
  </div>
);

export default MessageCard;
