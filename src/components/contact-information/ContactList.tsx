import React from "react";
import ContactItem from "./ContactItem";

interface ContactListProps {
  contacts: { _id: string; name: string; title: string; email: string }[];
  isAdmin: boolean;
  onRemove: (id: string) => void;
  t: Record<string, string>;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, isAdmin, onRemove, t }) => {
  return (
    <ul className="space-y-4 mb-8">
      {contacts.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          isAdmin={isAdmin}
          onRemove={onRemove}
          t={t}
        />
      ))}
    </ul>
  );
};

export default ContactList;
