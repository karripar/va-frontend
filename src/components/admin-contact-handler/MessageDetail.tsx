import React, { useState } from "react";
import { ContactMessageResponse } from "va-hybrid-types/contentTypes";
import ReplyForm from "./ReplyForm";

interface Props {
  selectedMessage: ContactMessageResponse | null;
  onReply: (id: string, reply: string, email: string) => void;
  t: Record<string, string>;
}

const MessageDetail: React.FC<Props> = ({ selectedMessage, onReply, t }) => {
  const [reply, setReply] = useState("");

  if (!selectedMessage)
    return (
      <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex items-center justify-center text-gray-500 text-center">
        {t.selectMessage}
      </div>
    );

  return (
    <div className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-[#FF5000]">
        {t.viewMessage}
      </h2>

      <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-1">
        <div>
          <p className="font-semibold text-lg text-[#FF5000]">{selectedMessage.subject}</p>
          <p className="text-sm text-gray-500">
            {t.fromSender}: {selectedMessage.name} ({selectedMessage.email})
          </p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
        </div>

        {(selectedMessage.responses ?? []).length > 0 && Array.isArray(selectedMessage.responses) && (
          <div className="mt-4 border-t border-gray-200 pt-3">
            <h3 className="font-semibold text-gray-700 mb-2">{t.previousResponses}</h3>
            <div className="space-y-2">
              {selectedMessage.responses.map((res, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800">
                  <p className="font-medium text-[#FF5000] mb-1">
                    {t.response} #{i + 1}
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

      <ReplyForm
        reply={reply}
        setReply={setReply}
        onSubmit={() => {
          onReply(selectedMessage._id, reply, selectedMessage.email);
          setReply("");
        }}
        t={t}
      />
    </div>
  );
};

export default MessageDetail;
