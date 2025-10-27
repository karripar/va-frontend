// Application status types
export type ApplicationStatus = "not_started" | "in_progress" | "completed" | "pending_review";

// Application phase types
export type ApplicationPhase = "esihaku" | "nomination" | "apurahat" | "vaihdon_jalkeen";

// Application phase data structure
export interface ApplicationPhaseData {
  phase: ApplicationPhase;
  title: string;
  description: string;
  status: ApplicationStatus;
  completedTasks: number;
  totalTasks: number;
  tasks: ApplicationTask[];
  deadline?: string;
  tips?: string[];
  externalLinks?: ExternalLink[];
}

// Individual task within a phase
export interface ApplicationTask {
  name: string;
  completed: boolean;
  required: boolean;
}

// External link structure
export interface ExternalLink {
  title: string;
  url: string;
  description: string;
}

// Application document structure
export interface ApplicationDocument {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
}
