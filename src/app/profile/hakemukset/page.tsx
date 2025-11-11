/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
      return "1. Esihaku";
    case "nomination":
      return "2. Nomination";
    case "apurahat":
      return "3. Apurahat ja kustannukset";
    case "vaihdon_jalkeen":
      return "4. Vaihdon jälkeiset tehtävät";
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
  const [budgetAmount, setBudgetAmount] = useState(540);
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
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>Ladataan hakemuksia...</p>
      </div>
    );
  }

  if (profileError || appsError || stagesError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">Virhe: {profileError || appsError || stagesError}</p>
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
      <ProfileHeader title="Hakemusten hallinta" showBack />

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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kustannusarviointi</h3>
                
                <div className="mb-6">
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

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">Yhteenveto</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Arvioitu apuraha / kk:</span>
                      <span className="font-bold text-green-800">{budgetAmount}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Kustannukset yhteensä / kk:</span>
                      <span className="font-bold text-orange-600">
                        {Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0)}€
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-semibold">Erotus:</span>
                      <span className={`font-bold text-lg ${
                        budgetAmount - Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0) >= 0 
                          ? 'text-green-700' 
                          : 'text-red-600'
                      }`}>
                        {budgetAmount - Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0)}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
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
        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaihdon eteneminen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => {
              const phaseStages = applicationStages.filter(s => s.phase === phase);
              const completedStages = phaseStages.filter(s => s.status === "completed");
              const progress = phaseStages.length > 0 ? (completedStages.length / phaseStages.length) * 100 : 0;
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
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


