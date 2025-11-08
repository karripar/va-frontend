import React from "react";

interface ContactItemProps {
  contact: { _id: string; name: string; title: string; email: string };
  isAdmin: boolean;
  onRemove: (id: string) => void;
  t: Record<string, string>;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isAdmin, onRemove, t }) => {
  return (
    <li className="flex justify-between items-center border border-gray-300 rounded-xl p-4">
      <div>
        <p className="font-medium">{contact.name}</p>
        <p className="text-sm italic text-gray-500">{contact.title}</p>
        <p className="text-sm text-gray-600">{contact.email}</p>
      </div>
      {isAdmin && (
        <button onClick={() => onRemove(contact._id)} className="text-red-600 hover:underline">
          {t.remove}
        </button>
      )}
    </li>
  );
};

export default ContactItem;
