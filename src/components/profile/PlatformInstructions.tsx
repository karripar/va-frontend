import { FaInfoCircle } from "react-icons/fa";

const PLATFORM_INSTRUCTIONS: Record<string, { title: string; steps: string[] }> = {
  google_drive: {
    title: "Google Drive",
    steps: [
      "1. Avaa tiedostosi Google Drivessa",
      "2. Klikkaa 'Jaa' -painiketta",
      "3. Vaihda pääsy: 'Kuka tahansa linkillä'",
      "4. Klikkaa 'Kopioi linkki'",
      "5. Liitä linkki alle"
    ]
  },
  onedrive: {
    title: "OneDrive",
    steps: [
      "1. Klikkaa tiedostoa hiiren oikealla OneDrivessa",
      "2. Valitse 'Jaa'",
      "3. Klikkaa 'Kopioi linkki'",
      "4. Varmista: 'Kuka tahansa linkillä voi katsella'",
      "5. Liitä linkki alle"
    ]
  },
  dropbox: {
    title: "Dropbox",
    steps: [
      "1. Klikkaa tiedostoa hiiren oikealla Dropboxissa",
      "2. Valitse 'Jaa'",
      "3. Klikkaa 'Luo linkki'",
      "4. Klikkaa 'Kopioi linkki'",
      "5. Liitä linkki alle"
    ]
  },
  icloud: {
    title: "iCloud",
    steps: [
      "1. Valitse tiedostosi iCloudissa",
      "2. Klikkaa jakamiskuvaketta",
      "3. Klikkaa 'Kopioi linkki'",
      "4. Liitä linkki alle"
    ]
  },
  other_url: {
    title: "Muu URL",
    steps: [
      "Varmista, että URL:",
      "- On julkisesti saavutettavissa",
      "- On suora linkki dokumenttiin",
      "- On luotettavasta lähteestä"
    ]
  }
};

export default function PlatformInstructions({ platform }: { platform: string }) {
  const info = PLATFORM_INSTRUCTIONS[platform];
  if (!info) return null;

  return (
    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
        <div className="text-sm">
          <h4 className="font-medium text-blue-900 mb-2">
            Kuinka saada jaettava linkki {info.title}:stä:
          </h4>
          <ol className="text-blue-800 space-y-1">
            {info.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
