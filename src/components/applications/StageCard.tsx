"use client";
import React from "react";
import { 
  FaFileAlt, 
  FaTrash, 
  FaLink, 
  FaCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaEye,
  FaExternalLinkAlt,
  FaSpinner
} from "react-icons/fa";
import { ApplicationDocument, ApplicationStageStatus, ApplicationStageWithProgress } from "va-hybrid-types/contentTypes";

interface StageCardProps {
  stage: ApplicationStageWithProgress;
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeDocumentForm: { stageId: string; docIndex: number } | null;
  setActiveDocumentForm: (value: { stageId: string; docIndex: number } | null) => void;
  stageDocuments: Record<string, ApplicationDocument[]>;
  setStageDocuments: React.Dispatch<React.SetStateAction<Record<string, ApplicationDocument[]>>>;
  QuickDocumentLinkForm: React.ComponentType<{
    documentType: string;
    phase: string;
    onDocumentAdded: (doc: ApplicationDocument) => void;
    onCancel: () => void;
  }>;
  onUpdateStatus?: (stageId: string, status: ApplicationStageStatus) => Promise<void>;
  uniquePrefix?: string;
}

const getStatusIcon = (status: ApplicationStageStatus) => {
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

const getStatusText = (status: ApplicationStageStatus) => {
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

const getPlatformName = (sourceType: string) => {
  const platforms: Record<string, string> = {
    google_drive: 'Google Drive',
    onedrive: 'OneDrive',
    dropbox: 'Dropbox',
    icloud: 'iCloud'
  };
  return platforms[sourceType] || 'Linkki';
};

export default function StageCard({
  stage,
  isExpanded,
  onToggleExpand,
  activeDocumentForm,
  setActiveDocumentForm,
  stageDocuments,
  setStageDocuments,
  QuickDocumentLinkForm,
  onUpdateStatus,
  uniquePrefix = ""
}: StageCardProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleMarkAsComplete = async () => {
    if (!onUpdateStatus) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(stage.id, "completed");
    } catch (error) {
      console.error("Failed to update stage status:", error);
      alert("Vaiheen tilaa ei voitu päivittää");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderDocuments = (documents: string[], isOptional: boolean) => {
    return documents.map((doc, index) => {
      const docKey = `${stage.id}-${uniquePrefix}${isOptional ? 'opt' : 'req'}-${index}`;
      const formStageId = uniquePrefix ? `${stage.id}-${uniquePrefix}` : stage.id;
      const isFormActive = activeDocumentForm?.stageId === formStageId && 
                          activeDocumentForm?.docIndex === (isOptional ? -(index + 1) : index);
      const existingDocs = stageDocuments[docKey] || [];
      
      return (
        <div key={index} className="space-y-2">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            isOptional ? 'bg-blue-50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <FaFileAlt className={isOptional ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-gray-700">{doc}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setActiveDocumentForm({ 
                  stageId: formStageId, 
                  docIndex: isOptional ? -(index + 1) : index 
                })}
                className={`p-2 text-blue-600 rounded-md transition-colors ${
                  isOptional ? 'hover:bg-blue-100' : 'hover:bg-blue-50'
                }`}
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
                  <a 
                    href={linkDoc.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <FaExternalLinkAlt size={10} />
                    {getPlatformName(linkDoc.sourceType || '')}
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
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
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
      
      {isExpanded && (
        <div className="border-t px-6 py-4">
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Pakolliset dokumentit</h4>
            <div className="space-y-3">
              {renderDocuments(stage.requiredDocuments, false)}
            </div>
          </div>
          
          {stage.optionalDocuments && stage.optionalDocuments.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Valinnaiset dokumentit</h4>
              <div className="space-y-3">
                {renderDocuments(stage.optionalDocuments, true)}
              </div>
            </div>
          )}
          
          {stage.externalLinks && stage.externalLinks.length > 0 && (
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
          
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Tallenna luonnos
            </button>
            <button 
              onClick={handleMarkAsComplete}
              disabled={isUpdating || stage.status === "completed"}
              className="px-4 py-2 bg-[#FF5722] text-white rounded-md hover:bg-[#E64A19] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Päivitetään...
                </>
              ) : stage.status === "completed" ? (
                <>
                  <FaCheck />
                  Valmis
                </>
              ) : (
                "Merkitse valmiiksi"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
