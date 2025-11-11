import { FaSpinner } from "react-icons/fa";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  );
}

interface SubmitButtonProps {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function SubmitButton({ loading, loadingText = "Ladataan...", children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
