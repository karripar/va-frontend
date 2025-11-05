import React from "react";

interface Props {
  reply: string;
  setReply: (value: string) => void;
  onSubmit: () => void;
  t: Record<string, string>;
}

const ReplyForm: React.FC<Props> = ({ reply, setReply, onSubmit, t }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="mt-4 space-y-3"
  >
    <label htmlFor="reply" className="block font-semibold">
      {t.writeReply}
    </label>
    <textarea
      id="reply"
      rows={4}
      value={reply}
      onChange={(e) => setReply(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
      placeholder={t.writeReply}
      required
    />
    <button
      type="submit"
      className="w-full bg-[#FF5000] text-white font-semibold py-3 rounded-lg shadow hover:bg-[#e04e00] transition"
    >
      {t.sendReply}
    </button>
  </form>
);

export default ReplyForm;
