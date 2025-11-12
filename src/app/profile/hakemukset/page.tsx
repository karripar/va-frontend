/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
<<<<<<< HEAD
import { useProfileData, useApplicationsData, useApplicationDocuments } from "@/hooks/apiHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaFileAlt, 
  FaTrash, 
  FaDownload, 
  FaUpload, 
  FaArrowLeft, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaPlus,
  FaEye,
  FaExternalLinkAlt
} from "react-icons/fa";
import Link from "next/link";

// Application status types
type ApplicationPhase = "esihaku" | "nomination" | "apurahat" | "vaihdon_jalkeen";
type ApplicationStatus = "not_started" | "in_progress" | "completed" | "pending_review";

interface ApplicationStage {
  id: string;
  phase: ApplicationPhase;
  title: string;
  description: string;
  status: ApplicationStatus;
  requiredDocuments: string[];
  optionalDocuments?: string[];
  externalLinks?: { title: string; url: string; description: string }[];
  deadline?: string;
  completedAt?: string;
}

export default function HakemuksetPage() {
  const { profileData: profile, loading: profileLoading, error: profileError } = useProfileData();
  const { applications, loading: appsLoading, error: appsError } = useApplicationsData();
  const { documents, uploadDocument, deleteDocument } = useApplicationDocuments();
  const router = useRouter();
  
  const [activePhase, setActivePhase] = useState<ApplicationPhase>("esihaku");
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Mock application stages data - this would come from your backend
  const applicationStages: ApplicationStage[] = [
    {
      id: "esihaku-1",
      phase: "esihaku",
      title: "Sisäinen esihaku",
      description: "Hae oman korkeakoulun sisällä vaihto-ohjelmaan",
      status: applications?.esihaku?.status || "not_started",
      requiredDocuments: [
        "Vapaamuotoinen hakemus",
        "Motivaatiokirje", 
        "Opintosuoritusote",
        "Kielitaitotodistus"
      ],
      deadline: "2025-12-28",
      completedAt: applications?.esihaku?.completedAt
    },
    {
      id: "nomination-1", 
      phase: "nomination",
      title: "Nomination partneriyliopistoon",
      description: "Kotikorkeakoulu ilmoittaa sinut kohdeyliopistoon",
      status: applications?.nomination?.status || "not_started",
      requiredDocuments: [
        "Passikopio",
        "Virallinen opintosuoritusote (englanniksi)",
        "Final Learning Agreement"
      ],
      optionalDocuments: [
        "Asumishakemus",
        "Vakuutustodistus"
      ]
    },
    {
      id: "apurahat-1",
      phase: "apurahat", 
      title: "Erasmus+ apuraha",
      description: "Hae Erasmus+ -apurahaa vaihtoon",
      status: applications?.grants?.erasmus?.status || "not_started",
      requiredDocuments: [
        "Erasmus+ Grant Agreement",
        "Learning Agreement"
      ],
      externalLinks: [
        {
          title: "Erasmus+ hakuportaali",
          url: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/studying-abroad?pk_source=website&pk_medium=link&pk_campaign=self&pk_content=self-student-exchange",
          description: "Virallinen Erasmus+ hakuportaali"
        }
      ]
    },
    {
      id: "apurahat-2",
      phase: "apurahat",
      title: "Kela-tuki",
      description: "Hae opintotukea ulkomaille Kelasta", 
      status: applications?.grants?.kela?.status || "not_started",
      requiredDocuments: [
        "Todistus opiskelusta ulkomailla",
        "Kela-hakemus"
      ],
      externalLinks: [
        {
          title: "Kela",
          url: "https://www.kela.fi/henkiloasiakkaat",
          description: "Hae opintotukea ulkomaille"
        }
      ]
    },
    {
      id: "vaihdon-jalkeen-1",
      phase: "vaihdon_jalkeen",
      title: "Opintojen hyväksiluku",
      description: "Suorita vaihdon jälkeiset tehtävät",
      status: applications?.postExchange?.status || "not_started", 
      requiredDocuments: [
        "Transcript of Records (virallinen)",
        "Vaihdon loppuraportti",
        "Hyväksilukuhakemus"
      ]
    }
  ];

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "completed":
        return <FaCheck className="text-green-500" />;
      case "in_progress":
        return <FaClock className="text-yellow-500" />;
      case "pending_review":
        return <FaExclamationTriangle className="text-orange-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case "completed":
        return "Valmis";
      case "in_progress": 
        return "Käynnissä";
      case "pending_review":
        return "Odottaa tarkistusta";
      default:
        return "Ei aloitettu";
    }
  };

  const getPhaseTitle = (phase: ApplicationPhase) => {
    switch (phase) {
      case "esihaku":
        return "1. Esihaku";
      case "nomination":
        return "2. Nomination";
      case "apurahat":
        return "3. Apurahat ja tuet";
      case "vaihdon_jalkeen":
        return "4. Vaihdon jälkeiset tehtävät";
    }
  };

  const filteredStages = applicationStages.filter(stage => stage.phase === activePhase);

  if (profileLoading || appsLoading) {
=======
import { useApplicationDocuments } from "@/hooks/documentsHooks";
import { useApplicationsData, useApplicationStages } from "@/hooks/applicationsHooks";
import { useProfileData } from "@/hooks/apiHooks";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StageCard from "@/components/applications/StageCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { 
  ApplicationDocument, 
  ApplicationPhase, 
  ApplicationStageStatus 
} from "va-hybrid-types";

// Compact inline document link form component
interface QuickDocumentLinkFormProps {
  documentType: string;
  phase: string;
  onDocumentAdded: (doc: ApplicationDocument) => void;
  onCancel: () => void;
}

const QuickDocumentLinkForm = ({ documentType, phase, onDocumentAdded, onCancel }: QuickDocumentLinkFormProps) => {
  const [documentUrl, setDocumentUrl] = useState("");
  const [sourceType, setSourceType] = useState("google_drive");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!documentUrl.trim()) {
      alert('Liitä dokumenttilinkki');
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) throw new Error("API URL not configured");

      const response = await fetch(`${apiUrl}/profile/applications/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          documentType,
          fileName: documentType,
          fileUrl: documentUrl,
          sourceType,
        }),
      });

      if (!response.ok) throw new Error('Failed to add document');

      const newDoc = await response.json();
      onDocumentAdded(newDoc);
      setDocumentUrl("");
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Dokumentin lisääminen epäonnistui");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="space-y-2">
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          <option value="google_drive">Google Drive</option>
          <option value="onedrive">OneDrive</option>
          <option value="dropbox">Dropbox</option>
          <option value="icloud">iCloud</option>
          <option value="other_url">Muu URL</option>
        </select>
        
        <input
          type="url"
          placeholder="Liitä jaettava linkki tähän"
          value={documentUrl}
          onChange={(e) => setDocumentUrl(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? <FaSpinner className="animate-spin mx-auto" /> : 'Lisää'}
          </button>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Peruuta
          </button>
        </div>
      </div>
    </div>
  );
};

const getPhaseTitle = (phase: ApplicationPhase) => {
  switch (phase) {
    case "esihaku":
      return "1. Ennen hakemista ja haku";
    case "nomination":
      return "2. Nomination";
    case "apurahat":
      return "3. Apurahat ja kustannusarviointi";
    case "vaihdon_jalkeen":
      return "4. Vaihdon aikana ja jälkeen";
  }
};

export default function HakemuksetPage() {
  const { profileData: profile, loading: profileLoading, error: profileError } = useProfileData();
  const { applications, loading: appsLoading, error: appsError } = useApplicationsData();
  const { stages: applicationStages, loading: stagesLoading, error: stagesError } = useApplicationStages();
  const { documents, addDocumentLink, deleteDocument } = useApplicationDocuments();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activePhase, setActivePhase] = useState<ApplicationPhase>("esihaku");
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [activeBudgetTab, setActiveBudgetTab] = useState<"stages" | "budget">("stages");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    matkakulut: 0,
    vakuutukset: 0,
    asuminen: 0,
    "ruoka ja arki": 0,
    opintovalineet: 0
  });
  const [categoryNotes, setCategoryNotes] = useState<Record<string, string>>({});

  const [activeDocumentForm, setActiveDocumentForm] = useState<{ stageId: string; docIndex: number } | null>(null);
  const [stageDocuments, setStageDocuments] = useState<Record<string, ApplicationDocument[]>>({});

  // Handle URL parameters for direct navigation from navbar
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'budget') {
      setActivePhase("apurahat");
      setActiveBudgetTab("budget");
    }
  }, [searchParams]);

  const filteredStages = applicationStages.filter(stage => stage.phase === activePhase);

  // Update stage status (mark as completed)
  const updateStageStatus = async (stageId: string, status: ApplicationStageStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AUTH_API;
      if (!apiUrl) throw new Error("API URL not configured");

      const response = await fetch(`${apiUrl}/profile/applications/stages/${stageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update stage status');

      // Refresh stages data to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error updating stage status:", error);
      throw error;
    }
  };

  if (profileLoading || appsLoading || stagesLoading) {
>>>>>>> dev-test
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan hakemuksia...</p>
      </div>
    );
  }

<<<<<<< HEAD
  if (profileError || appsError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {profileError || appsError}</p>
=======
  if (profileError || appsError || stagesError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {profileError || appsError || stagesError}</p>
>>>>>>> dev-test
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Yritä uudelleen
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
<<<<<<< HEAD
      {/* Orange Header */}
      <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Takaisin"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Hakemusten hallinta</h1>
      </div>
=======
      <ProfileHeader title="Hakemusten hallinta" showBack />
>>>>>>> dev-test

      {/* Description */}
      <div className="bg-white p-6 border-b">
        <div className="max-w-4xl mx-auto">
<<<<<<< HEAD
          <p className="text-gray-700 text-center">
            Seuraa vaihtohaun etenemistä eri vaiheissa ja hallitse tarvittavia dokumentteja.
          </p>
=======
          <p className="text-gray-700 text-center mb-3">
            Seuraa Metropolian vaihtohaun etenemistä eri vaiheissa ja hallitse tarvittavia dokumentteja.
          </p>
          <div className="text-sm text-gray-600 space-y-1 max-w-2xl mx-auto">
            <p>• Vaihto-opiskelu vaatii vähintään 60 op suoritettuna ennen lähtöä</p>
            <p>• Vaihdossa suoritetaan 30 op/lukukausi tai 60 op/lukuvuosi</p>
            <p>• Osallistu pakollisiin orientaatioihin ja hakuinfoihin</p>
            <p>• Vahvista vaihtopaikka 7 päivän sisällä hyväksynnästä</p>
          </div>
>>>>>>> dev-test
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex overflow-x-auto space-x-1">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activePhase === phase
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {getPhaseTitle(phase)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
<<<<<<< HEAD
        <div className="space-y-6">
          {filteredStages.map((stage) => (
            <div key={stage.id} className="bg-white rounded-lg shadow-sm border">
              {/* Stage Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(stage.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{stage.title}</h3>
                      <p className="text-gray-600">{stage.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      stage.status === "completed" 
                        ? "bg-green-100 text-green-800"
                        : stage.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {getStatusText(stage.status)}
                    </span>
                    <FaEye className="text-gray-400" />
                  </div>
                </div>
                
                {stage.deadline && (
                  <div className="mt-3 text-sm text-gray-500">
                    Määräaika: {new Date(stage.deadline).toLocaleDateString("fi-FI")}
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {expandedStage === stage.id && (
                <div className="border-t px-6 py-4">
                  {/* Required Documents */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Pakolliset dokumentit</h4>
                    <div className="space-y-2">
                      {stage.requiredDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FaFileAlt className="text-gray-400" />
                            <span className="text-gray-700">{doc}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <FaUpload size={14} />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                              <FaDownload size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Documents */}
                  {stage.optionalDocuments && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Valinnaiset dokumentit</h4>
                      <div className="space-y-2">
                        {stage.optionalDocuments.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FaFileAlt className="text-blue-400" />
                              <span className="text-gray-700">{doc}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                                <FaUpload size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  {stage.externalLinks && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Ulkoiset palvelut</h4>
                      <div className="space-y-2">
                        {stage.externalLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <div>
                              <div className="flex items-center space-x-3">
                                <FaExternalLinkAlt className="text-green-600" />
                                <span className="font-medium text-gray-900">{link.title}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Tallenna luonnos
                    </button>
                    <button className="px-4 py-2 bg-[#FF5722] text-white rounded-md hover:bg-[#E64A19] transition-colors">
                      Merkitse valmiiksi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

=======
        {activePhase === "apurahat" ? (
          <div>
            {/* Tabs for grants and budget calculator */}
            <div className="flex space-x-2 mb-6">
              <button
                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${activeBudgetTab === "stages" ? "border-[#FF5722] text-[#FF5722] bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
                onClick={() => setActiveBudgetTab("stages")}
              >
                Apurahat
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${activeBudgetTab === "budget" ? "border-[#FF5722] text-[#FF5722] bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
                onClick={() => setActiveBudgetTab("budget")}
              >
                Kustannusarviointi
              </button>
            </div>

            {activeBudgetTab === "stages" && (
              <div className="space-y-6">
                <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                  <h4 className="font-semibold text-[#FF5722] mb-2">Apurahat</h4>
                  <p className="text-sm text-gray-700">
                    Tässä vaiheessa hoidat käytännön asiat: matka- ja asumisjärjestelyt, vakuutukset, 
                    terveyteen liittyvät asiat, Learning Agreement, sekä apurahahakemuksen. Muista osallistua 
                    pakollisiin orientaatioihin!
                  </p>
                </div>
                {filteredStages.map((stage) => (
                  <StageCard
                    key={stage.id}
                    stage={stage}
                    isExpanded={expandedStage === stage.id}
                    onToggleExpand={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                    activeDocumentForm={activeDocumentForm}
                    setActiveDocumentForm={setActiveDocumentForm}
                    stageDocuments={stageDocuments}
                    setStageDocuments={setStageDocuments}
                    QuickDocumentLinkForm={QuickDocumentLinkForm}
                    onUpdateStatus={updateStageStatus}
                  />
                ))}
              </div>
            )}

            {activeBudgetTab === "budget" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[#FF5722] mb-2">Kustannusarviointi</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Tee realistinen kustannusarvio vaihtojaksolle. Huomaa että Erasmus+-apuraha ja Metropolian 
                  apuraha eivät kata kaikkia kuluja - varaudu omavastuuosuuteen. Voit hakea lisää apurahoja 
                  erilaisista säätiöistä.
                </p>

                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-[#FF5722]">
                  <h4 className="text-sm font-semibold text-[#FF5722] mb-2">Erasmus+ apurahan määrä kohdemaan mukaan:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li><strong>Korkeat elinkustannukset</strong> (Tanska, Norja, Ranska): ~540 € / kk</li>
                    <li><strong>Keskimääräiset elinkustannukset</strong> (Saksa, Espanja, Italia): ~490 € / kk</li>
                    <li><strong>Matalammat elinkustannukset</strong> (Bulgaria, Romania): ~450 € / kk</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2">
                    Lisäksi voi hakea vihreän matkustamisen tukea ja osallisuustukea, jos täyttää ehdot.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Kustannuskategoriat</h4>
                  <div className="space-y-3">
                    {[
                      { key: "matkakulut", label: "Matkakulut" },
                      { key: "vakuutukset", label: "Vakuutukset" },
                      { key: "asuminen", label: "Asuminen" },
                      { key: "ruoka ja arki", label: "Ruoka ja arki" },
                      { key: "opintovalineet", label: "Opintovälineet" }
                    ].map(cat => (
                      <div key={cat.key} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-gray-900">{cat.label}</span>
                          <span className="text-lg font-bold text-[#FF5722]">{categoryBudgets[cat.key]}€</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => setCategoryBudgets(prev => ({ ...prev, [cat.key]: Math.max(0, prev[cat.key] - 50) }))}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-gray-700 font-bold"
                          >
                            -50
                          </button>
                          <input
                            type="number"
                            value={categoryBudgets[cat.key]}
                            onChange={(e) => setCategoryBudgets(prev => ({ ...prev, [cat.key]: Math.max(0, Number(e.target.value)) }))}
                            className="flex-1 px-3 py-1 border rounded text-center"
                            min="0"
                          />
                          <button
                            onClick={() => setCategoryBudgets(prev => ({ ...prev, [cat.key]: prev[cat.key] + 50 }))}
                            className="px-3 py-1 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded font-bold"
                          >
                            +50
                          </button>
                        </div>
                        
                        <textarea
                          value={categoryNotes[cat.key] || ''}
                          onChange={(e) => setCategoryNotes(prev => ({ ...prev, [cat.key]: e.target.value }))}
                          placeholder="Muistiinpanot..."
                          className="w-full px-3 py-2 text-sm border rounded resize-none"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {activePhase === "esihaku" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">Ennen hakemista ja haku</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Tutustu vaihtokohteisiin, osallistu alakohtaisiin hakuinfoihin ja täytä Metropolian sisäinen hakemus. 
                  Varmista että täytät kriteerit: vähintään 60 op suoritettu, opinnot etenevät normaalisti.
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>Hakuajat: Päähaku 1.12-31.1 (syksy/kevät), Lisähaku 1.9-15.9 (kevät)</li>
                  <li>Valinnassa painotetaan: opintomenestys, motivaatio, kielitaito, kv-aktiivisuus</li>
                  <li>Lue vaihtoraportit OMASta ja tutustu U!REKA-allianssin mahdollisuuksiin</li>
                </ul>
              </div>
            )}
            {activePhase === "nomination" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">Nomination ja kohdekoulun haku</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Kun saat hyväksynnän Metropolian sisäisestä hausta, vahvista paikka 7 päivän sisällä. 
                  Selvitä kohdekoulun hakuprosessi ja aikataulu - ole oma-aktiivinen!
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>Tarvittavat liitteet: opintosuoritusote, CV, motivaatiokirje, vakuutustodistus</li>
                  <li>Kielitodistus: voit tehdä OLS-kielitestin (linkki orientaatiossa)</li>
                  <li>Osallistu pakollisiin vaihto-orientaatioihin</li>
                  <li>Kun saat hyväksymiskirjeen, välitä se kv-asiantuntijallesi</li>
                </ul>
              </div>
            )}
            {activePhase === "vaihdon_jalkeen" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">Vaihdon aikana ja jälkeen</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Vaihdon aikana:</strong> Tee kurssimuutokset Learning Agreementiin kuukauden sisällä. 
                  Seuraa Metropolian sähköpostia. EU-maassa: tee EU-kansalaisen rekisteröityminen.
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Vaihdon jälkeen:</strong> Pyydä Letter of Confirmation (21 pv ennen vaihdon päättymistä), 
                  lataa Transcript of Records, hae hyväksiluku eAhotista, täytä vaihtoraportti ja Erasmus+ kysely.
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>Määräajat: Syyslukukausi 30.4., kevätlukukausi 30.9. mennessä</li>
                  <li>Hae Global Talent Open Badge vaihdon jälkeen</li>
                  <li>Jaa kokemuksesi: kv-infot, Exchange-blogi, Instagram</li>
                </ul>
              </div>
            )}
            {filteredStages.map((stage) => (
              <StageCard
                key={stage.id}
                stage={stage}
                isExpanded={expandedStage === stage.id}
                onToggleExpand={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                activeDocumentForm={activeDocumentForm}
                setActiveDocumentForm={setActiveDocumentForm}
                stageDocuments={stageDocuments}
                setStageDocuments={setStageDocuments}
                QuickDocumentLinkForm={QuickDocumentLinkForm}
                onUpdateStatus={updateStageStatus}
                uniquePrefix="2"
              />
            ))}
          </div>
        )}
>>>>>>> dev-test
        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaihdon eteneminen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => {
              const phaseStages = applicationStages.filter(s => s.phase === phase);
              const completedStages = phaseStages.filter(s => s.status === "completed");
              const progress = phaseStages.length > 0 ? (completedStages.length / phaseStages.length) * 100 : 0;
<<<<<<< HEAD
              
              return (
                <div key={phase} className="text-center">
                  <div className="mb-2">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
=======
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={`text-center p-4 rounded-lg transition-all hover:shadow-md ${
                    activePhase === phase ? "ring-2 ring-[#FF5722] bg-orange-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="mb-2">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
>>>>>>> dev-test
                      progress === 100 ? "bg-green-100" : progress > 0 ? "bg-yellow-100" : "bg-gray-100"
                    }`}>
                      <span className={`text-2xl font-bold ${
                        progress === 100 ? "text-green-600" : progress > 0 ? "text-yellow-600" : "text-gray-400"
                      }`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {getPhaseTitle(phase)}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {completedStages.length}/{phaseStages.length} valmis
                  </p>
<<<<<<< HEAD
                </div>
=======
                </button>
>>>>>>> dev-test
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======


>>>>>>> dev-test
