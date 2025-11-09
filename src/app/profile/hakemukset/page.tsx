/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useApplicationDocuments } from "@/hooks/documentsHooks";
import{ useApplicationsData} from "@/hooks/applicationsHooks";
import { useProfileData } from "@/hooks/apiHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaFileAlt, 
  FaTrash, 
  FaDownload, 
  FaLink, 
  FaArrowLeft, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaPlus,
  FaEye,
  FaExternalLinkAlt,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import Link from "next/link";
import { ApplicationDocument } from "va-hybrid-types";

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

export default function HakemuksetPage() {
  const { profileData: profile, loading: profileLoading, error: profileError } = useProfileData();
  const { applications, loading: appsLoading, error: appsError } = useApplicationsData();
  const { documents, addDocumentLink, deleteDocument } = useApplicationDocuments();
  const router = useRouter();
  
  const [activePhase, setActivePhase] = useState<ApplicationPhase>("esihaku");
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [activeBudgetTab, setActiveBudgetTab] = useState<"stages" | "budget">("stages");
  // For calculator demo
  const [budgetAmount, setBudgetAmount] = useState(540);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // State for managing which document is being added
  const [activeDocumentForm, setActiveDocumentForm] = useState<{ stageId: string; docIndex: number } | null>(null);
  const [stageDocuments, setStageDocuments] = useState<Record<string, ApplicationDocument[]>>({});

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
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan hakemuksia...</p>
      </div>
    );
  }

  if (profileError || appsError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {profileError || appsError}</p>
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

      {/* Description */}
      <div className="bg-white p-6 border-b">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-700 text-center">
            Seuraa vaihtohaun etenemistä eri vaiheissa ja hallitse tarvittavia dokumentteja.
          </p>
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
        {activePhase === "apurahat" ? (
          <div>
            {/* Tabs for grants and budget calculator */}
            <div className="flex space-x-2 mb-6">
              <button
                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${activeBudgetTab === "stages" ? "border-[#FF5722] text-[#FF5722] bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
                onClick={() => setActiveBudgetTab("stages")}
              >
                Apurahat ja tuet
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${activeBudgetTab === "budget" ? "border-[#FF5722] text-[#FF5722] bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
                onClick={() => setActiveBudgetTab("budget")}
              >
                Kustannukset ja kustannusarviointi
              </button>
            </div>

            {activeBudgetTab === "stages" && (
              <div className="space-y-6">
                {filteredStages.map((stage) => (
                  <div key={stage.id} className="bg-white rounded-lg shadow-sm border">
                    {/*  stage rendering placeholder */}
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
                    {expandedStage === stage.id && (
                      <div className="border-t px-6 py-4">
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Pakolliset dokumentit</h4>
                          <div className="space-y-3">
                            {stage.requiredDocuments.map((doc, index) => {
                              const docKey = `${stage.id}-req-${index}`;
                              const isFormActive = activeDocumentForm?.stageId === stage.id && activeDocumentForm?.docIndex === index;
                              const existingDocs = stageDocuments[docKey] || [];
                              
                              return (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <FaFileAlt className="text-gray-400" />
                                      <span className="text-gray-700">{doc}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button 
                                        onClick={() => setActiveDocumentForm({ stageId: stage.id, docIndex: index })}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Lisää dokumenttilinkki"
                                      >
                                        <FaLink size={14} />
                                      </button>
                                      {existingDocs.length > 0 && (
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                          <FaEye size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {isFormActive && (
                                    <QuickDocumentLinkForm
                                      documentType={doc}
                                      phase={stage.phase}
                                      onDocumentAdded={(newDoc) => {
                                        setStageDocuments(prev => ({
                                          ...prev,
                                          [docKey]: [...(prev[docKey] || []), newDoc]
                                        }));
                                        setActiveDocumentForm(null);
                                      }}
                                      onCancel={() => setActiveDocumentForm(null)}
                                    />
                                  )}
                                  {existingDocs.length > 0 && (
                                    <div className="ml-8 space-y-1">
                                      {existingDocs.map((linkDoc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                                          <a href={linkDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                            <FaExternalLinkAlt size={10} />
                                            {linkDoc.sourceType === 'google_drive' ? 'Google Drive' : 
                                             linkDoc.sourceType === 'onedrive' ? 'OneDrive' :
                                             linkDoc.sourceType === 'dropbox' ? 'Dropbox' :
                                             linkDoc.sourceType === 'icloud' ? 'iCloud' : 'Linkki'}
                                          </a>
                                          <button 
                                            onClick={() => {
                                              setStageDocuments(prev => ({
                                                ...prev,
                                                [docKey]: prev[docKey].filter((_, i) => i !== idx)
                                              }));
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <FaTrash size={12} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {/*  Documents */}
                        {stage.optionalDocuments && (
                          <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-900 mb-3">Valinnaiset dokumentit</h4>
                            <div className="space-y-3">
                              {stage.optionalDocuments.map((doc, index) => {
                                const docKey = `${stage.id}-opt-${index}`;
                                const isFormActive = activeDocumentForm?.stageId === stage.id && activeDocumentForm?.docIndex === -(index + 1); // Negative for optional
                                const existingDocs = stageDocuments[docKey] || [];
                                
                                return (
                                  <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <FaFileAlt className="text-blue-400" />
                                        <span className="text-gray-700">{doc}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button 
                                          onClick={() => setActiveDocumentForm({ stageId: stage.id, docIndex: -(index + 1) })}
                                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                          title="Lisää dokumenttilinkki"
                                        >
                                          <FaLink size={14} />
                                        </button>
                                        {existingDocs.length > 0 && (
                                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                            <FaEye size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    {isFormActive && (
                                      <QuickDocumentLinkForm
                                        documentType={doc}
                                        phase={stage.phase}
                                        onDocumentAdded={(newDoc) => {
                                          setStageDocuments(prev => ({
                                            ...prev,
                                            [docKey]: [...(prev[docKey] || []), newDoc]
                                          }));
                                          setActiveDocumentForm(null);
                                        }}
                                        onCancel={() => setActiveDocumentForm(null)}
                                      />
                                    )}
                                    {existingDocs.length > 0 && (
                                      <div className="ml-8 space-y-1">
                                        {existingDocs.map((linkDoc, idx) => (
                                          <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                                            <a href={linkDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                              <FaExternalLinkAlt size={10} />
                                              {linkDoc.sourceType === 'google_drive' ? 'Google Drive' : 
                                               linkDoc.sourceType === 'onedrive' ? 'OneDrive' :
                                               linkDoc.sourceType === 'dropbox' ? 'Dropbox' :
                                               linkDoc.sourceType === 'icloud' ? 'iCloud' : 'Linkki'}
                                            </a>
                                            <button 
                                              onClick={() => {
                                                setStageDocuments(prev => ({
                                                  ...prev,
                                                  [docKey]: prev[docKey].filter((_, i) => i !== idx)
                                                }));
                                              }}
                                              className="text-red-500 hover:text-red-700"
                                            >
                                              <FaTrash size={12} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
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
            )}

            {activeBudgetTab === "budget" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kustannusarviointi!</h3>
                {/* GrantCalculator UI */}
                <div className="mb-8">
                  <div className="text-gray-700 mb-2">Arvioi apuraha ja budjetti vaihdolle:</div>
                  <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="flex-1 mb-6 md:mb-0">
                      {/* Simple GrantCalculator UI */}
                      <label className="block mb-2 text-sm font-medium text-gray-700">Arvioitu apuraha (€ / kk)</label>
                      <input
                        type="range"
                        min={0}
                        max={10000}
                        value={budgetAmount}
                        onChange={e => setBudgetAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8BC34A 0%, #8BC34A ${((budgetAmount) / 10000) * 100}%, #E5E7EB ${((budgetAmount) / 10000) * 100}%, #E5E7EB 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0€</span>
                        <span>10000€</span>
                      </div>
                      <div className="mt-2 text-center text-2xl font-bold text-[#8BC34A]">{budgetAmount}€ / kk</div>
                    </div>
                    <div className="flex-1">
                      {/* BudgetCategories UI */}
                      <label className="block mb-2 text-sm font-medium text-gray-700">Valitse kustannuskategoria</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { key: "matkakulut", label: "Matkakulut" },
                          { key: "vakuutukset", label: "Vakuutukset" },
                          { key: "asuminen", label: "Asuminen" },
                          { key: "ruoka_ja_arki", label: "Ruoka ja arki" },
                          { key: "opintovalineet", label: "Opintovälineet" }
                        ].map(cat => (
                          <button
                            key={cat.key}
                            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedCategory === cat.key ? "border-[#FF5722] bg-orange-50" : "border-gray-200 bg-white hover:bg-orange-50"}`}
                            onClick={() => setSelectedCategory(cat.key)}
                          >
                            <span className="font-semibold text-gray-900">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                      {selectedCategory && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-800 mb-2">Valittu kategoria: {selectedCategory}</div>
                          <div className="text-sm text-gray-600">Tähän voi lisätä tarkemman kustannusarvion ja muistiinpanot.</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Summary */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Yhteenveto</h4>
                  <p className="text-sm text-green-800">
                    Arvioitu apuraha: <span className="font-bold">{budgetAmount}€ / kk</span>
                  </p>
                  {selectedCategory && (
                    <p className="text-sm text-green-800 mt-2">
                      Valittu kustannuskategoria: <span className="font-bold">{selectedCategory}</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ...existing code for other phases... */}
            <div className="space-y-6">
              {filteredStages.map((stage) => (
                <div key={stage.id} className="bg-white rounded-lg shadow-sm border">
                  {/* ...existing code for stage header and expanded content... */}
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
                  {expandedStage === stage.id && (
                    <div className="border-t px-6 py-4">
                      {/* ...existing code for expanded content... */}
                      {/* Required Documents */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Pakolliset dokumentit</h4>
                        <div className="space-y-3">
                          {stage.requiredDocuments.map((doc, index) => {
                            const docKey = `${stage.id}-req2-${index}`;
                            const isFormActive = activeDocumentForm?.stageId === `${stage.id}-2` && activeDocumentForm?.docIndex === index;
                            const existingDocs = stageDocuments[docKey] || [];
                            
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <FaFileAlt className="text-gray-400" />
                                    <span className="text-gray-700">{doc}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => setActiveDocumentForm({ stageId: `${stage.id}-2`, docIndex: index })}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      title="Lisää dokumenttilinkki"
                                    >
                                      <FaLink size={14} />
                                    </button>
                                    {existingDocs.length > 0 && (
                                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                        <FaEye size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {isFormActive && (
                                  <QuickDocumentLinkForm
                                    documentType={doc}
                                    phase={stage.phase}
                                    onDocumentAdded={(newDoc) => {
                                      setStageDocuments(prev => ({
                                        ...prev,
                                        [docKey]: [...(prev[docKey] || []), newDoc]
                                      }));
                                      setActiveDocumentForm(null);
                                    }}
                                    onCancel={() => setActiveDocumentForm(null)}
                                  />
                                )}
                                {existingDocs.length > 0 && (
                                  <div className="ml-8 space-y-1">
                                    {existingDocs.map((linkDoc, idx) => (
                                      <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                                        <a href={linkDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                          <FaExternalLinkAlt size={10} />
                                          {linkDoc.sourceType === 'google_drive' ? 'Google Drive' : 
                                           linkDoc.sourceType === 'onedrive' ? 'OneDrive' :
                                           linkDoc.sourceType === 'dropbox' ? 'Dropbox' :
                                           linkDoc.sourceType === 'icloud' ? 'iCloud' : 'Linkki'}
                                        </a>
                                        <button 
                                          onClick={() => {
                                            setStageDocuments(prev => ({
                                              ...prev,
                                              [docKey]: prev[docKey].filter((_, i) => i !== idx)
                                            }));
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <FaTrash size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {/* Optional Documents */}
                      {stage.optionalDocuments && (
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Valinnaiset dokumentit</h4>
                          <div className="space-y-3">
                            {stage.optionalDocuments.map((doc, index) => {
                              const docKey = `${stage.id}-opt2-${index}`;
                              const isFormActive = activeDocumentForm?.stageId === `${stage.id}-2` && activeDocumentForm?.docIndex === -(index + 1);
                              const existingDocs = stageDocuments[docKey] || [];
                              
                              return (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <FaFileAlt className="text-blue-400" />
                                      <span className="text-gray-700">{doc}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button 
                                        onClick={() => setActiveDocumentForm({ stageId: `${stage.id}-2`, docIndex: -(index + 1) })}
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                        title="Lisää dokumenttilinkki"
                                      >
                                        <FaLink size={14} />
                                      </button>
                                      {existingDocs.length > 0 && (
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                          <FaEye size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {isFormActive && (
                                    <QuickDocumentLinkForm
                                      documentType={doc}
                                      phase={stage.phase}
                                      onDocumentAdded={(newDoc) => {
                                        setStageDocuments(prev => ({
                                          ...prev,
                                          [docKey]: [...(prev[docKey] || []), newDoc]
                                        }));
                                        setActiveDocumentForm(null);
                                      }}
                                      onCancel={() => setActiveDocumentForm(null)}
                                    />
                                  )}
                                  {existingDocs.length > 0 && (
                                    <div className="ml-8 space-y-1">
                                      {existingDocs.map((linkDoc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                                          <a href={linkDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                            <FaExternalLinkAlt size={10} />
                                            {linkDoc.sourceType === 'google_drive' ? 'Google Drive' : 
                                             linkDoc.sourceType === 'onedrive' ? 'OneDrive' :
                                             linkDoc.sourceType === 'dropbox' ? 'Dropbox' :
                                             linkDoc.sourceType === 'icloud' ? 'iCloud' : 'Linkki'}
                                          </a>
                                          <button 
                                            onClick={() => {
                                              setStageDocuments(prev => ({
                                                ...prev,
                                                [docKey]: prev[docKey].filter((_, i) => i !== idx)
                                              }));
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <FaTrash size={12} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
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
          </>
        )}
        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaihdon eteneminen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => {
              const phaseStages = applicationStages.filter(s => s.phase === phase);
              const completedStages = phaseStages.filter(s => s.status === "completed");
              const progress = phaseStages.length > 0 ? (completedStages.length / phaseStages.length) * 100 : 0;
              return (
                <div key={phase} className="text-center">
                  <div className="mb-2">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


