"use client";

import React, { useEffect, useState } from "react";
import { useDestinationUrls } from "@/hooks/destinationUrlHooks";
import { useLanguage } from "@/context/LanguageContext";

interface DestinationAdminPanelProps {
  fetchError?: string | null;
}

const DestinationAdminPanel: React.FC<DestinationAdminPanelProps> = ({
  fetchError,
}) => {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations: Record<string, Record<string, string>> = {
    fi: {
      adminPanel: "Ylläpitäjä: Hallinnoi kohteiden URL-osoitteita",
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
      notice:
        "Kohteiden tietolähteet päivittyvät, kun lisäät tai muokkaat URL-osoitetta. Tarkista tiedot huolellisesti ennen tallentamista — virheellinen osoite voi aiheuttaa sen, että kohteet katoavat tai näkyvät virheellisesti.",
      howToUpdate:
        "Päivittääksesi olemassa olevan URL-osoitteen, valitse sama koulutusala ja kieli, syötä uusi osoite ja klikkaa Tallenna. Järjestelmä korvaa vanhan osoitteen automaattisesti uudella. Jos haluat asettaa esimerkiksi tekniikan kohteiden URL-osoitteen suomeksi, valitse 'Tekniikka' ja 'Suomi', syötä uusi osoite ja tallenna.",
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
      notice:
        "Changing or adding a destination URL will update the data source used for destinations. Please double-check the information before saving — incorrect URLs may cause destinations to disappear or display incorrectly.",
      howToUpdate:
        "To update an existing URL, enter the same field and language with the new URL, then click Save. The existing entry will be automatically replaced with the updated one. For example, to set the URL for technical field destinations in Finnish, select 'Tech' and 'Finnish', enter the new URL, and save.",
    },
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getDestinationUrls();
        if (data?.urls) setUrls(data.urls);
      } catch (err) {
        console.error("Failed to load URLs:", err);
        setErrorMessage("Failed to load URLs");
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
    if (!confirm(translations[language].confirmDelete)) return;
    try {
      await deleteDestinationUrl(id);
      setUrls((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting destination URL:", err);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-10 shadow-md">
      {fetchError && <p className="text-red-500 mb-3">{fetchError}</p>}

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

      {/* FORM SECTION — responsive */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
        <select
          data-testid="destination-field-select"
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border rounded px-2 py-1 w-full sm:w-auto"
        >
          <option value="tech">{translations[language].tech}</option>
          <option value="health">{translations[language].health}</option>
          <option value="culture">{translations[language].culture}</option>
          <option value="business">{translations[language].business}</option>
        </select>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="border rounded px-2 py-1 w-full sm:w-auto"
        >
          <option value="en">{translations[language].english}</option>
          <option value="fi">{translations[language].finnish}</option>
        </select>

        <input
          type="text"
          placeholder={translations[language].url}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-3 py-1 flex-1 w-full sm:w-auto"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#FF5000] text-white rounded px-4 py-1 hover:bg-[#e04500] w-full sm:w-auto"
        >
          {loading
            ? translations[language].saving
            : translations[language].save}
        </button>
      </div>

      {/* TABLE SECTION  */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-300">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">{translations[language].field}</th>
              <th className="p-2">{translations[language].lang}</th>
              <th className="p-2">{translations[language].url}</th>
              <th className="p-2">{translations[language].actions}</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((entry) => (
              <tr key={entry._id} className="border-t">
                <td className="p-2">{entry.field}</td>
                <td className="p-2">{entry.lang}</td>
                <td className="p-2 truncate max-w-[200px]">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {entry.url}
                  </a>
                </td>
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
                  {errorMessage ||
                    "No destination URLs found. Add a new URL above."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DestinationAdminPanel;
