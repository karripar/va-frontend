/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { FaCheck, FaExternalLinkAlt, FaTrash } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations/applications";

export interface TaskDocument {
  id: string;
  label: string;
  required: boolean;
  _id?: string; // MongoDB document ID
}

export interface TaskTile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  documents: TaskDocument[];
  isCheckboxOnly?: boolean; 
  reminderTitle?: string;
  reminderText?: string;
  reminderLink?: string;
  reminderLinkText?: string;
}

interface TaskCardProps {
  task: TaskTile;
  isExpanded: boolean;
  onToggleExpand: () => void;
  taskDocuments: Record<string, { url: string; source: string }>;
  onAddDocument: (taskId: string, docId: string, url: string, source: string) => void;
  onDeleteDocument: (taskId: string, docId: string) => void;
  onComplete: (taskId: string, task: TaskTile) => void;
  isCompleted: boolean;
  showReminder: boolean;
  onCloseReminder: () => void;
}

export function TaskCard({ 
  task, 
  isExpanded, 
  onToggleExpand, 
  taskDocuments, 
  onAddDocument, 
  onDeleteDocument,
  onComplete,
  isCompleted,
  showReminder,
  onCloseReminder
}: TaskCardProps) {
  const [activeDocForm, setActiveDocForm] = useState<string | null>(null);
  const [showSavedNotification, setShowSavedNotification] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const colors = {
    border: "border-orange-200",
    bg: "bg-[#FF5722]",
    hover: "hover:border-orange-400",
    text: "text-[#FF5722]"
  };
  const requiredDocs = task.documents.filter(d => d.required);
  const hasAllRequired = requiredDocs.every(d => taskDocuments[d.id]);

  return (
    <div className="space-y-4">
      {/* Task Card */}
      <div
        onClick={onToggleExpand}
        className={`bg-white border-2 ${colors.border} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all ${colors.hover} ${isCompleted ? 'opacity-75' : ''}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`${colors.bg} p-3 rounded-lg text-2xl`}>
              {task.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                {isCompleted && <FaCheck className="text-green-600" />}
              </div>
              <p className="text-sm text-gray-600">{task.subtitle}</p>
              {!isExpanded && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>{Object.keys(taskDocuments).length}/{task.documents.length} {t.documentsCount}</span>
                  {isCompleted && <span className="text-green-600 font-semibold">• {t.completed}</span>}
                </div>
              )}
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`bg-gray-50 border-2 ${colors.border} rounded-lg p-6`}>
          <p className="text-sm text-gray-700 mb-4">{task.description}</p>

          {/* Mobility Online Link */}
          {task.reminderLink && (
            <div className="mb-4">
              <a
                href={task.reminderLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-4 bg-orange-50 border-2 ${colors.border} rounded-lg hover:bg-orange-100 transition-colors`}
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt className="text-[#FF5722] text-xl" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{task.reminderLinkText || t.uploadDocument}</div>
                  {task.reminderText && <div className="text-sm text-gray-600">{task.reminderText}</div>}
                </div>
              </a>
              {/* Only show warning for Mobility Online application */}
              {task.id === 'sisainen-hakemus' && (
                <p className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                  {language === 'fi' ? 'Huomioithan, että linkki on aktiivinen vain hakuaikoina!' : 'Please note that the link will be active only during the application periods!'}
                </p>
              )}
            </div>
          )}

          {/* Document Upload Section */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">
              {task.isCheckboxOnly ? (language === 'fi' ? 'Vahvista osallistuminen' : 'Confirm participation') : t.uploadDocument}
            </h4>
            {task.documents.map((doc, index) => (
              <div key={doc.id || doc._id || `doc-${index}`} className="bg-white border border-gray-200 rounded-lg p-4">
                {task.isCheckboxOnly ? (
                  /* Checkbox mode for attendance confirmation */
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!!taskDocuments[doc.id]}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onAddDocument(task.id, doc.id, 'attended', 'checkbox');
                        } else {
                          onDeleteDocument(task.id, doc.id);
                        }
                      }}
                      className="w-5 h-5 text-[#FF5722] border-gray-300 rounded focus:ring-[#FF5722] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                        {doc.label}
                      </span>
                    </div>
                    {taskDocuments[doc.id] && (
                      <FaCheck className="text-green-600 text-lg" />
                    )}
                  </label>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{doc.label}</span>
                      </div>
                      {taskDocuments[doc.id] ? (
                        <button
                          onClick={() => onDeleteDocument(task.id, doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveDocForm(activeDocForm === doc.id ? null : doc.id)}
                          className="text-[#FF5722] hover:text-orange-700 text-sm font-medium"
                        >
                          {activeDocForm === doc.id ? t.cancel : `+ ${t.addDocument}`}
                        </button>
                      )}
                    </div>

                    {taskDocuments[doc.id] ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCheck className="text-green-600" />
                        <a 
                          href={taskDocuments[doc.id].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#FF5722] hover:underline flex items-center gap-1"
                    >
                      {language === 'fi' ? 'Dokumentti tallennettu' : 'Document saved'} <FaExternalLinkAlt className="w-3 h-3" />
                    </a>
                    <span className="text-gray-400">({taskDocuments[doc.id].source})</span>
                  </div>
                ) : activeDocForm === doc.id ? (
                  <DocumentUploadForm
                    taskId={task.id}
                    docId={doc.id}
                    onAdd={(taskId, docId, url, source) => {
                      onAddDocument(taskId, docId, url, source);
                      setShowSavedNotification(docId);
                      setTimeout(() => setShowSavedNotification(null), 5000);
                    }}
                    onCancel={() => setActiveDocForm(null)}
                  />
                ) : null}
                
                {/* Show notification after saving */}
                {!task.isCheckboxOnly && showSavedNotification === doc.id && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ℹ️ {t.submitApplicationReminder}
                    </p>
                  </div>
                )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Complete Button */}
          {!isCompleted && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onToggleExpand}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {language === 'fi' ? 'Sulje' : 'Close'}
              </button>
              <button
                onClick={() => onComplete(task.id, task)}
                disabled={!hasAllRequired}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  hasAllRequired 
                    ? `${colors.bg} text-white hover:opacity-90` 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t.completeTask}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Document Upload Form Component
interface DocumentUploadFormProps {
  taskId: string;
  docId: string;
  onAdd: (taskId: string, docId: string, url: string, source: string) => void;
  onCancel: () => void;
}

function DocumentUploadForm({ taskId, docId, onAdd, onCancel }: DocumentUploadFormProps) {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("google_drive");
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = () => {
    if (!url.trim()) {
      alert(language === 'fi' ? 'Liitä dokumenttilinkki' : 'Attach document link');
      return;
    }
    onAdd(taskId, docId, url, source);
    setUrl("");
    onCancel();
  };

  return (
    <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200 space-y-2">
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
      >
        <option value="google_drive">Google Drive</option>
        <option value="onedrive">OneDrive</option>
        <option value="dropbox">Dropbox</option>
        <option value="icloud">iCloud</option>
        <option value="other_url">{language === 'fi' ? 'Muu URL' : 'Other URL'}</option>
      </select>
      
      <input
        type="url"
        placeholder={language === 'fi' ? 'Liitä jaettava linkki tähän' : 'Paste shareable link here'}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
      />
      
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 px-3 py-2 text-sm bg-[#FF5722] text-white rounded-md hover:bg-orange-600"
        >
          {t.save}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
