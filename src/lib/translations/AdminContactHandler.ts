export const useAdminContactTranslations = (lang: string) => {
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
        response: "Response",
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
        response: "Vastaus",
      },
    };
  
    return translations[lang] || translations.en;
  };
  