"use client";
import { FaCheck, FaClock, FaExclamationTriangle, FaChevronRight } from "react-icons/fa";

type ApplicationStatus = "not_started" | "in_progress" | "completed" | "pending_review";
type ApplicationPhase = "esihaku" | "nomination" | "apurahat" | "vaihdon_jalkeen";

interface ProgressStepProps {
  phase: ApplicationPhase;
  status: ApplicationStatus;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  completedTasks?: number;
  totalTasks?: number;
}

export default function ProgressStep({
  phase,
  status,
  title,
  description,
  isActive,
  onClick,
  completedTasks = 0,
  totalTasks = 1
}: ProgressStepProps) {
  const getStepNumber = (phase: ApplicationPhase) => {
    switch (phase) {
      case "esihaku": return "1";
      case "nomination": return "2";
      case "apurahat": return "3";
      case "vaihdon_jalkeen": return "4";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <FaCheck className="text-white" size={16} />;
      case "in_progress":
        return <FaClock className="text-white" size={16} />;
      case "pending_review":
        return <FaExclamationTriangle className="text-white" size={16} />;
      default:
        return <span className="text-white font-bold">{getStepNumber(phase)}</span>;
    }
  };

  const getStepColor = () => {
    if (isActive) {
      switch (status) {
        case "completed": return "bg-green-500 border-green-500";
        case "in_progress": return "bg-yellow-500 border-yellow-500";
        case "pending_review": return "bg-orange-500 border-orange-500";
        default: return "bg-blue-500 border-blue-500";
      }
    } else {
      switch (status) {
        case "completed": return "bg-green-400 border-green-400";
        case "in_progress": return "bg-yellow-400 border-yellow-400";
        case "pending_review": return "bg-orange-400 border-orange-400";
        default: return "bg-gray-300 border-gray-300";
      }
    }
  };

  const getConnectorColor = () => {
    return status === "completed" ? "border-green-400" : "border-gray-300";
  };

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="relative">
      {/* Connector Line */}
      <div className={`absolute left-6 top-12 w-0.5 h-16 border-l-2 ${getConnectorColor()}`} />
      
      {/* Step Content */}
      <div
        className={`relative flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
          isActive ? "bg-white shadow-md ring-2 ring-blue-100" : "hover:bg-gray-50"
        }`}
        onClick={onClick}
      >
        {/* Step Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepColor()}`}>
          {getStatusIcon()}
        </div>

        {/* Step Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${isActive ? "text-gray-900" : "text-gray-700"}`}>
              {title}
            </h3>
            <FaChevronRight className={`text-gray-400 ${isActive ? "text-gray-600" : ""}`} />
          </div>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
          
          {/* Progress Bar */}
          {totalTasks > 1 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{completedTasks}/{totalTasks} tehtävää valmis</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    status === "completed" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              status === "completed"
                ? "bg-green-100 text-green-800"
                : status === "in_progress"
                ? "bg-yellow-100 text-yellow-800"
                : status === "pending_review"
                ? "bg-orange-100 text-orange-800"
                : "bg-gray-100 text-gray-600"
            }`}>
              {status === "completed"
                ? "Valmis"
                : status === "in_progress"
                ? "Käynnissä"
                : status === "pending_review"
                ? "Odottaa tarkistusta"
                : "Ei aloitettu"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
