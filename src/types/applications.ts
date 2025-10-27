// Types that should be added to va-hybrid-types/contentTypes.ts

export interface ApplicationsResponse {
  userId: string;
  esihaku?: ApplicationPhaseData;
  nomination?: ApplicationPhaseData;
  grants?: {
    erasmus?: ApplicationPhaseData;
    kela?: ApplicationPhaseData;
  };
  postExchange?: ApplicationPhaseData;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationPhaseData {
  status: ApplicationStatus;
  completedAt?: string;
  deadline?: string;
  documents: ApplicationDocument[];
  notes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export type ApplicationStatus = 
  | "not_started" 
  | "in_progress" 
  | "completed" 
  | "pending_review"
  | "approved"
  | "rejected";

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  applicationPhase: ApplicationPhase;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
  isRequired: boolean;
  status: DocumentStatus;
  uploadedBy: string;
}

export type ApplicationPhase = 
  | "esihaku" 
  | "nomination" 
  | "apurahat" 
  | "vaihdon_jalkeen";

export type DocumentStatus = 
  | "uploaded" 
  | "processing" 
  | "approved" 
  | "rejected" 
  | "needs_revision";

export interface ApplicationTask {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  completedAt?: string;
  dueDate?: string;
  documentTypes?: string[];
  externalLinks?: ExternalLink[];
}

export interface ExternalLink {
  title: string;
  url: string;
  description: string;
  category?: "application" | "information" | "support";
}

// Extensions to existing ProfileResponse type
export interface ProfileResponse {
  // ... existing fields
  applications?: ApplicationsResponse;
  applicationProgress?: {
    overallProgress: number;
    currentPhase: ApplicationPhase;
    nextDeadline?: string;
    completedPhases: ApplicationPhase[];
  };
}

// API Endpoints that should be implemented in backend:

// GET /api/applications - Get current user's applications
// POST /api/applications - Create new application
// PUT /api/applications/:id - Update application
// DELETE /api/applications/:id - Delete application

// GET /api/applications/:id/documents - Get application documents
// POST /api/applications/:id/documents - Upload document
// DELETE /api/applications/documents/:documentId - Delete document

// POST /api/applications/:id/submit - Submit application phase
// POST /api/applications/:id/approve - Approve application (admin)
// POST /api/applications/:id/reject - Reject application (admin)

// GET /api/applications/templates - Get application templates
// GET /api/applications/requirements/:phase - Get requirements for specific phase