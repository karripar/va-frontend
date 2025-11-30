import { ApplicationPhase } from "va-hybrid-types/contentTypes";
import { phaseTasksTranslations } from "@/lib/translations/phaseTasks";

// Task document interface
interface TaskDocument {
  id: string;
  label: string;
  required: boolean;
}

// Task tile interface
export interface TaskTile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  documents: TaskDocument[];
  isCheckboxOnly?: boolean; // If true, shows checkbox instead of document upload
  reminderTitle?: string;
  reminderText?: string;
  reminderLink?: string;
  reminderLinkText?: string;
}

// Get phase tasks based on language
export const getPhaseTasks = (language: string = 'fi'): Record<ApplicationPhase, TaskTile[]> => {
  return phaseTasksTranslations[language] || phaseTasksTranslations['fi'];
};

// Default export for backward compatibility 
export const PHASE_TASKS = getPhaseTasks('fi');
