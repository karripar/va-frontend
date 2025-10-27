/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
