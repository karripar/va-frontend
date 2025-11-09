"use client";

import React, { useEffect, useState } from "react";
import { useDestinationUrls } from "@/hooks/destinationUrlHooks";
import { useLanguage } from "@/context/LanguageContext";

const DestinationAdminPanel = () => {
  const {
    getDestinationUrls,
    updateDestinationUrl,
    deleteDestinationUrl,
    loading,
    error,
  } = useDestinationUrls();

  interface DestinationUrl {
    _id: string;
    field: string;
    lang: string;
    url: string;
  }

  const [urls, setUrls] = useState<DestinationUrl[]>([]);
  const [field, setField] = useState("tech");
  const [lang, setLang] = useState("en");
  const [url, setUrl] = useState("");
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    fi: {
      adminPanel: "Admin: Hallinnoi kohteiden URL-osoitteita",
      field: "Koulutusala",
      lang: "Kieli",
      url: "URL-osoite",
      actions: "Toiminnot",
      save: "Tallenna",
      delete: "Poista",
      confirmDelete: "Haluatko varmasti poistaa tämän merkinnän?",
      tech: "Tekniikka",
      health: "Sosiaali- ja terveysala",
      culture: "Kulttuuri",
      business: "Liiketalous",
      english: "Englanti",
      finnish: "Suomi",
      saving: "Tallennetaan...",
      notice: "Uuden URL-osoitteen lisääminen tai muokkaaminen vaikuttaa kohteiden tietolähteisiin. Varmista, että syötät oikeat tiedot ennen tallentamista. Virheelliset URL-osoitteet voivat johtaa kohteiden katoamiseen tai virheelliseen näyttämiseen.",
      howToUpdate: "Päivittääksesi olemassa olevan URL-osoitteen, syötä sama koulutusala ja kieli uuden URL-osoitteen kanssa ja klikkaa Tallenna.",
    },
    en: {
      adminPanel: "Admin: Manage Destination URLs",
      field: "Field",
      lang: "Lang",
      url: "URL",
      actions: "Actions",
      save: "Save",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this entry?",
      tech: "Tech",
      health: "Health",
      culture: "Culture",
      business: "Business",
      english: "English",
      finnish: "Finnish",
      saving: "Saving...",
      notice: "Adding or modifying a destination URL will affect the data sources for destinations. Ensure you enter the correct information before saving. Incorrect URLs may lead to destinations disappearing or displaying incorrectly.",
      howToUpdate: "To update an existing URL, enter the same field and language with the new URL and click Save.",


    },
  };

  // Fetch existing URLs on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getDestinationUrls();
        if (data?.urls) setUrls(data.urls);
      } catch (err) {
        console.error("Failed to load URLs:", err);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const updated = await updateDestinationUrl({ field, lang, url });
      if (updated?.entry) {
        setUrls((prev) => {
          const existing = prev.filter(
            (item) =>
              !(
                item.field === updated.entry.field &&
                item.lang === updated.entry.lang
              )
          );
          return [...existing, updated.entry];
        });
        setUrl("");
      }
    } catch (err) {
      console.error("Error updating destination URL:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteDestinationUrl(id);
      setUrls((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting destination URL:", err);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-10 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {translations[language].adminPanel}
      </h2>
        <p className="text-sm text-gray-600 mb-4">
        {translations[language].notice}
      </p>
      <p className="text-sm text-gray-600 mb-6">
        {translations[language].howToUpdate}
      </p>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="tech">
            {translations[language].tech}
          </option>
          <option value="health">
            {translations[language].health}
          </option>
          <option value="culture">
            {translations[language].culture}
          </option>
          <option value="business">
            {translations[language].business}
          </option>
        </select>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="en">
            {translations[language].english}
          </option>
          <option value="fi">
            {translations[language].finnish}
          </option>
        </select>

        <input
          type="text"
          placeholder={translations[language].url}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-3 py-1 flex-1"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#FF5000] text-white rounded px-4 py-1 hover:bg-[#e04500]"
        >
          {loading ? translations[language].saving : translations[language].save}
        </button>
      </div>

      <table className="w-full text-sm border-t border-gray-300">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-2">
                {translations[language].field}
            </th>
            <th className="p-2">
                {translations[language].lang}
            </th>
            <th className="p-2">
                {translations[language].url}
            </th>
            <th className="p-2">
                {translations[language].actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {urls.map((entry) => (
            <tr key={entry._id} className="border-t">
              <td className="p-2">{entry.field}</td>
              <td className="p-2">{entry.lang}</td>
              <td className="p-2 truncate max-w-[200px]">{entry.url}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-600 hover:underline"
                >
                {translations[language].delete}
                </button>
              </td>
            </tr>
          ))}
          {urls.length === 0 && !loading && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No destination URLs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DestinationAdminPanel;
