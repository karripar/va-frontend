"use client";
import { useProfileData } from "@/hooks/profileHooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaExternalLinkAlt
} from "react-icons/fa";
import ProgressStep from "@/components/applications/ProgressStep";
import DocumentUpload from "@/components/applications/DocumentUpload";
import { useApplicationsData } from "@/hooks/applicationsHooks";
import{ApplicationPhase, ApplicationStatus}from "va-hybrid-types/contentTypes";

//type ApplicationPhase = "esihaku" | "nomination" | "apurahat" | "vaihdon_jalkeen";
//type ApplicationStatus = "not_started" | "in_progress" | "completed" | "pending_review";

export default function HakemuksetOverviewPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { profileData: profile, loading: profileLoading, error: profileError } = useProfileData();
  const { applications, loading: appsLoading, error: appsError } = useApplicationsData();
  const router = useRouter();
  
  const [activePhase, setActivePhase] = useState<ApplicationPhase>("esihaku");

  // Mock application phases data
  const applicationPhases = [
    {
      phase: "esihaku" as ApplicationPhase,
      title: "Esihaku",
      description: "Sisäinen haku omassa korkeakoulussa",
      status: applications?.esihaku?.status || "not_started" as ApplicationStatus,
      completedTasks: 2,
      totalTasks: 4,
      tasks: [
        { name: "Vapaamuotoinen hakemus", completed: true, required: true },
        { name: "Motivaatiokirje", completed: true, required: true },
        { name: "Opintosuoritusote", completed: false, required: true },
        { name: "Kielitaitotodistus", completed: false, required: true },
      ],
      deadline: "2024-02-15",
      tips: [
        "Aloita hakemuksen kirjoittaminen ajoissa",
        "Pyydä suosituskirje opettajalta",
        "Tarkista kielitaitovaatimukset"
      ]
    },
    {
      phase: "nomination" as ApplicationPhase,
      title: "Nomination",
      description: "Kotikorkeakoulu nominoi sinut kohdeyliopistoon",
      status: applications?.nomination?.status || "not_started" as ApplicationStatus,
      completedTasks: 0,
      totalTasks: 3,
      tasks: [
        { name: "Passikopio", completed: false, required: true },
        { name: "Virallinen opintosuoritusote (eng)", completed: false, required: true },
        { name: "Final Learning Agreement", completed: false, required: true },
      ],
      externalLinks: [
        {
          title: "Partner University Portal",
          url: "https://university.edu/exchange",
          description: "Kirjaudu partneriyliopiston portaaliin"
        }
      ]
    },
    {
      phase: "apurahat" as ApplicationPhase,
      title: "Apurahat ja tuet",
      description: "Hae Erasmus+ ja Kela-tukia",
      status: applications?.grants?.erasmus?.status || "not_started" as ApplicationStatus,
      completedTasks: 0,
      totalTasks: 2,
      tasks: [
        { name: "Erasmus+ Grant Agreement", completed: false, required: true },
        { name: "Kela-hakemus", completed: false, required: true },
      ],
      externalLinks: [
        {
          title: "Erasmus+ Portal",
          url: "https://erasmusplus.fi",
          description: "Virallinen Erasmus+ hakuportaali"
        },
        {
          title: "Kela",
          url: "https://kela.fi",
          description: "Hae opintotukea ulkomaille"
        }
      ]
    },
    {
      phase: "vaihdon_jalkeen" as ApplicationPhase,
      title: "Vaihdon jälkeiset tehtävät",
      description: "Opintojen hyväksiluku ja loppuraportti",
      status: applications?.postExchange?.status || "not_started" as ApplicationStatus,
      completedTasks: 0,
      totalTasks: 3,
      tasks: [
        { name: "Transcript of Records", completed: false, required: true },
        { name: "Vaihdon loppuraportti", completed: false, required: true },
        { name: "Hyväksilukuhakemus", completed: false, required: true },
      ]
    }
  ];

  const activePhaseData = applicationPhases.find(p => p.phase === activePhase);
  const overallProgress = applicationPhases.reduce((acc, phase) => {
    return acc + (phase.completedTasks / phase.totalTasks);
  }, 0) / applicationPhases.length * 100;

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
      {/* Header */}
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

      {/* Overall Progress */}
      <div className="bg-white border-b p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Vaihdon eteneminen</h2>
            <span className="text-2xl font-bold text-[#FF5722]">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Olet suorittanut {Math.round(overallProgress)}% vaihtohaun tehtävistä
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Progress Steps */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaihdon vaiheet</h3>
              <div className="space-y-2">
                {applicationPhases.map((phase) => (
                  <ProgressStep
                    key={phase.phase}
                    phase={phase.phase}
                    status={phase.status}
                    title={phase.title}
                    description={phase.description}
                    isActive={activePhase === phase.phase}
                    onClick={() => setActivePhase(phase.phase)}
                    completedTasks={phase.completedTasks}
                    totalTasks={phase.totalTasks}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Phase Details */}
          <div className="lg:col-span-2">
            {activePhaseData && (
              <div className="space-y-6">
                {/* Phase Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{activePhaseData.title}</h3>
                    {activePhaseData.deadline && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Määräaika</p>
                        <p className="text-lg font-semibold text-[#FF5722]">
                          {new Date(activePhaseData.deadline).toLocaleDateString("fi-FI")}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{activePhaseData.description}</p>
                  
                  {/* Progress for this phase */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#FF5722] h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(activePhaseData.completedTasks / activePhaseData.totalTasks) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {activePhaseData.completedTasks}/{activePhaseData.totalTasks}
                    </span>
                  </div>
                </div>

                {/* Tasks Checklist */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Tehtävälista</h4>
                  <div className="space-y-3">
                    {activePhaseData.tasks.map((task, index) => (
                      <div 
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg border ${
                          task.completed 
                            ? "bg-green-50 border-green-200" 
                            : task.required 
                            ? "bg-red-50 border-red-200" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          task.completed ? "bg-green-500" : "bg-gray-300"
                        }`}>
                          {task.completed && <FaCheckCircle className="text-white" size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? "text-green-800" : "text-gray-900"}`}>
                            {task.name}
                            {task.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </p>
                        </div>
                        {!task.completed && task.required && (
                          <FaExclamationTriangle className="text-red-500" size={16} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Upload */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Dokumenttien hallinta</h4>
                  <DocumentUpload
                    applicationId={`app-${activePhase}`}
                    documentType={activePhase}
                    required={true}
                  />
                </div>

                {/* External Links */}
                {activePhaseData.externalLinks && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Ulkoiset palvelut</h4>
                    <div className="space-y-3">
                      {activePhaseData.externalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">{link.title}</h5>
                            <p className="text-sm text-gray-600">{link.description}</p>
                          </div>
                          <FaExternalLinkAlt className="text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {activePhaseData.tips && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaInfoCircle className="text-blue-600" />
                      <h4 className="text-lg font-semibold text-blue-900">Vinkkejä</h4>
                    </div>
                    <ul className="space-y-2">
                      {activePhaseData.tips.map((tip, index) => (
                        <li key={index} className="text-blue-800 text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}