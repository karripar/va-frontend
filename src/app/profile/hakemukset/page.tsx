/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useApplicationDocuments } from "@/hooks/documentsHooks";
import { useApplicationsData, useApplicationStages } from "@/hooks/applicationsHooks";
import { useProfileData } from "@/hooks/profileHooks";
import { useBudgetEstimate } from "@/hooks/budgetArviointiHooks";
import { useGrantsData } from "@/hooks/grantsManagingHooks";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BudgetCategories from "@/components/applications/BudgetCategories";
import GrantCalculator from "@/components/applications/GrantCalculator";
import { TaskCard } from "@/components/applications/TaskTile";
import { getPhaseTasks } from "@/config/phaseTasks";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { ApplicationDocument, ApplicationPhase, ApplicationStageStatus} from "va-hybrid-types/contentTypes";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/applications";
import LanguageToggle from "@/components/LanguageToggle";

type BudgetCategory = 
  | "matkakulut"
  | "vakuutukset"
  | "asuminen"
  | "ruoka_ja_arki"
  | "opintovalineet";

interface CategoryExpense {
  amount: number;
  notes: string;
}

// Compact inline document link 
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
      const apiUrl = process.env.NEXT_PUBLIC_UPLOAD_API;
      if (!apiUrl) throw new Error("Upload API URL not configured");

      const token = localStorage.getItem('authToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/linkUploads/documents`, {
        method: 'POST',
        headers,
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

const getPhaseTitle = (phase: ApplicationPhase, language: string) => {
  const t = translations[language];
  switch (phase) {
    case "esihaku":
      return `1. ${t.esihaku}`;
    case "nomination":
      return `2. ${t.nomination}`;
    case "apurahat":
      return `3. ${t.apurahat}`;
    case "vaihdon_jalkeen":
      return `4. ${t.vaihdon_jalkeen}`;
  }
};

export default function HakemuksetPage() {
  const [activePhase, setActivePhase] = useState<ApplicationPhase>("esihaku");
  const { profileData: profile, loading: profileLoading, error: profileError } = useProfileData();
  const { applications, loading: appsLoading, error: appsError } = useApplicationsData();
  const { stages: applicationStages, loading: stagesLoading, error: stagesError } = useApplicationStages();
  const { documents, addDocumentLink, deleteDocument } = useApplicationDocuments(activePhase);
  const { grants, loading: grantsLoading, error: grantsError } = useGrantsData();
  const { budget } = useBudgetEstimate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = translations[language];
  const PHASE_TASKS = getPhaseTasks(language);
  
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [activeBudgetTab, setActiveBudgetTab] = useState<"stages" | "budget">("stages");
  const [budgetExpenses, setBudgetExpenses] = useState<Record<BudgetCategory, CategoryExpense> | null>(null);
  
  // Task's specific document management
  const [taskDocuments, setTaskDocuments] = useState<Record<string, Record<string, { url: string; source: string }>>>({});
  const [showReminder, setShowReminder] = useState<string | null>(null);

  // Load saved documents from database on mount
  useEffect(() => {
    const loadedDocs: Record<string, Record<string, { url: string; source: string }>> = {};
    
    if (documents && documents.length > 0) {
      documents.forEach((doc: any) => {
        
        // Parse task reference from documentType or document_type
        const docType = doc.documentType || doc.document_type;
        const taskMatch = docType?.match(/Task: (.+)/);
        if (taskMatch) {
          const taskId = taskMatch[1];
          // Backend returns 'name' not 'fileName'
          const docId = doc.name || doc.fileName || doc.file_name;
          
          if (docId) {
            if (!loadedDocs[taskId]) {
              loadedDocs[taskId] = {};
            }
            
            loadedDocs[taskId][docId] = {
              // Backend returns 'url' not 'fileUrl'
              url: doc.url || doc.fileUrl || doc.file_url,
              source: doc.sourceType || doc.source_type
            };
          }
        }
      });
    }
    
    setTaskDocuments(loadedDocs);
  }, [documents]);

  // Calculate task completion based on saved documents (persists across reloads)
  const isTaskCompleted = (taskId: string, task: { documents: Array<{ id: string; required: boolean }> }) => {
    const taskDocs = taskDocuments[taskId] || {};
    const requiredDocs = task.documents.filter((d) => d.required);
    return requiredDocs.length > 0 && requiredDocs.every((d) => taskDocs[d.id]);
  };

  // Handle URL parameters for direct navigation from navbar
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'budget') {
      setActivePhase("apurahat");
      setActiveBudgetTab("budget");
    } else if (tab === 'apurahat') {
      setActivePhase("apurahat");
      setActiveBudgetTab("stages");
    }
  }, [searchParams]);

  const handleBudgetChange = (expenses: Record<BudgetCategory, CategoryExpense>) => {
    setBudgetExpenses(expenses);
  };

  const handleCalculate = (amount: number) => {
    // Calculation complete
  };

  const getTotalBudget = () => {
    if (!budgetExpenses) return 0;
    return Object.values(budgetExpenses).reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleAddDocument = async (taskId: string, docId: string, url: string, source: string) => {
    try {
      const fileUrl = source === 'checkbox' ? 'https://attendance-confirmed.local' : url;
      
      // Save to database via API
      const newDoc = await addDocumentLink({
        phase: activePhase,
        documentType: `Task: ${taskId}`, // Storing task reference in documentType
        fileName: docId, 
        fileUrl: fileUrl,
        sourceType: source,
      });
      
      // Updating local state after successful save 
      setTaskDocuments(prev => ({
        ...prev,
        [taskId]: {
          ...(prev[taskId] || {}),
          [docId]: { url, source }
        }
      }));
    } catch (error) {
      console.error("Error saving document:", error);
      alert(language === 'fi' ? 'Dokumentin tallentaminen epäonnistui' : 'Failed to save document');
    }
  };

  const handleDeleteDocument = async (taskId: string, docId: string) => {
    try {
      // Finding the document in the current documents list
      const docToDelete = documents.find(doc => 
        doc.fileName === docId && doc.documentType?.includes(`Task: ${taskId}`)
      );
      
      if (docToDelete && docToDelete.id) {
        // Delete from database
        await deleteDocument(docToDelete.id);
      }
      
      // Update local state
      setTaskDocuments(prev => {
        const updated = { ...prev };
        if (updated[taskId]) {
          delete updated[taskId][docId];
        }
        return updated;
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      alert(language === 'fi' ? 'Dokumentin poistaminen epäonnistui' : 'Failed to delete document');
    }
  };

  const handleCompleteTask = async (taskId: string, task: { documents: Array<{ id: string; required: boolean }> }) => {
    const taskDocs = taskDocuments[taskId] || {};
    const requiredDocs = task.documents.filter((d) => d.required);
    const hasAllRequired = requiredDocs.every((d) => taskDocs[d.id]);

    if (!hasAllRequired) {
      alert(t.fillRequired);
      return;
    }

    // Show reminder (completion is auto calculated from documents)
    setShowReminder(taskId);
    
    setTimeout(() => {
      setExpandedTask(null);
    }, 3000);
  };

  const getPhaseProgress = (phase: ApplicationPhase) => {
    const tasks = PHASE_TASKS[phase];
    const completedTasks = tasks.filter(t => isTaskCompleted(t.id, t));
    return tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  };

  if (profileLoading || appsLoading || stagesLoading) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p>{t.loading}</p>
      </div>
    );
  }

  if (profileError || appsError || stagesError) {
    return (
      <div className="flex flex-col items-center p-4 mt-8">
        <p className="text-red-500">{t.error} {profileError || appsError || stagesError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader title={t.title} showBack />

      {/* Description */}
      <div className="bg-white p-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-3">
            <p className="text-gray-700 text-center flex-1">
              {t.description}
            </p>
            <LanguageToggle />
          </div>
          <div className="text-sm text-gray-600 space-y-1 max-w-2xl mx-auto">
            <p>{t.requirement1}</p>
            <p>{t.requirement2}</p>
            <p>{t.requirement3}</p>
            <p>{t.requirement4}</p>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex overflow-x-auto space-x-1">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => (
              <button
                key={phase}
                onClick={() => {
                  setActivePhase(phase);
                  if (phase !== "apurahat") {
                    setActiveBudgetTab("stages");
                  }
                }}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activePhase === phase
                    ? "border-[#FF5722] text-[#FF5722]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {getPhaseTitle(phase, language)}
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
                {t.grantsTabTitle}
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 transition-colors ${activeBudgetTab === "budget" ? "border-[#FF5722] text-[#FF5722] bg-white" : "border-transparent text-gray-500 bg-gray-100"}`}
                onClick={() => setActiveBudgetTab("budget")}
              >
                {t.budgetTabTitle}
              </button>
            </div>

            {activeBudgetTab === "stages" && (
              <div className="space-y-6">
                <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                  <h4 className="font-semibold text-[#FF5722] mb-2">{t.grantsInfoTitle}</h4>
                  <p className="text-sm text-gray-700">
                    {t.grantsInfoText}
                  </p>
                </div>

                {/* Render Grant Tasks */}
                {PHASE_TASKS.apurahat.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isExpanded={expandedTask === task.id}
                    onToggleExpand={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    taskDocuments={taskDocuments[task.id] || {}}
                    onAddDocument={handleAddDocument}
                    onDeleteDocument={handleDeleteDocument}
                    onComplete={handleCompleteTask}
                    isCompleted={isTaskCompleted(task.id, task)}
                    showReminder={showReminder === task.id}
                    onCloseReminder={() => setShowReminder(null)}
                  />
                ))}
              </div>
            )}

            {activeBudgetTab === "budget" && (
              <div>
                {/* Info banner */}
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-[#FF5722]">
                  <h4 className="text-sm font-semibold text-[#FF5722] mb-2">{t.budgetInfoTitle}</h4>
                  <p className="text-xs text-gray-700 mb-2">
                    {t.budgetInfoText}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t.budgetInfoExtraText}
                  </p>
                </div>

                {/* Budget Categories Component */}
                <div className="mb-6">
                  <BudgetCategories onBudgetChange={handleBudgetChange} />
                </div>

                {/* Budget Summary */}
                {budgetExpenses && getTotalBudget() > 0 && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      📈 {t.budgetSummaryTitle}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{t.budgetSummaryTotalCost}</p>
                        <p className="text-3xl font-bold text-[#FF5722]">{getTotalBudget()}€</p>
                      </div>
                      {budget && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Arvioitu apuraha</p>
                          <p className="text-3xl font-bold text-green-600">{budget.totalEstimate || 0}€</p>
                        </div>
                      )}
                    </div>
                    {budget && (
                      <div className="pt-4 border-t border-orange-200">
                        <p className="text-sm text-gray-700">
                          {getTotalBudget() > (budget.totalEstimate || 0) ? (
                            <span className="text-red-600 font-medium">
                              ⚠️ Budjettisi ylittää arvioidun apurahan {getTotalBudget() - (budget.totalEstimate || 0)}€:lla
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              ✅ Apuraha kattaa budjetit ({(budget.totalEstimate || 0) - getTotalBudget()}€ jäljellä)
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Grant Calculator Component */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🧮 Laskin</h3>
                  <GrantCalculator onCalculate={handleCalculate} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {activePhase === "esihaku" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">{t.esihakuInfoTitle}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  {t.esihakuInfoText}
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>{t.esihakuInfoList1}</li>
                  <li>{t.esihakuInfoList2}</li>
                  <li>{t.esihakuInfoList3}</li>
                </ul>
              </div>
            )}
            {activePhase === "nomination" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">{t.nominationInfoTitle}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  {t.nominationInfoText}
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>{t.nominationInfoList1}</li>
                  <li>{t.nominationInfoList2}</li>
                  <li>{t.nominationInfoList3}</li>
                  <li>{t.nominationInfoList4}</li>
                </ul>
              </div>
            )}
            {activePhase === "vaihdon_jalkeen" && (
              <div className="bg-orange-50 border-l-4 border-[#FF5722] p-4 mb-6">
                <h4 className="font-semibold text-[#FF5722] mb-2">{t.vaihdoJalkeenInfoTitle}</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>{t.vaihdoJalkeenDuringTitle}</strong> {t.vaihdoJalkeenDuringText}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>{t.vaihdoJalkeenAfterTitle}</strong> {t.vaihdoJalkeenAfterText}
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>{t.vaihdoJalkeenExtraList1}</li>
                  <li>{t.vaihdoJalkeenExtraList2}</li>
                  <li>{t.vaihdoJalkeenExtraList3}</li>
                </ul>
              </div>
            )}

            {/* Render Phase Tasks */}
            {PHASE_TASKS[activePhase].map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isExpanded={expandedTask === task.id}
                onToggleExpand={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                taskDocuments={taskDocuments[task.id] || {}}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onComplete={handleCompleteTask}
                isCompleted={isTaskCompleted(task.id, task)}
                showReminder={showReminder === task.id}
                onCloseReminder={() => setShowReminder(null)}
              />
            ))}
          </div>
        )}
        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.phaseOverviewTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(["esihaku", "nomination", "apurahat", "vaihdon_jalkeen"] as ApplicationPhase[]).map((phase) => {
              const progress = getPhaseProgress(phase);
              const tasks = PHASE_TASKS[phase];
              const completedTasks = tasks.filter(t => isTaskCompleted(t.id, t));
              
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
                    {getPhaseTitle(phase, language)}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {completedTasks.length}/{tasks.length} valmis
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


