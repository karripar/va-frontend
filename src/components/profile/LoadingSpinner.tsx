import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({ message = "Ladataan..." }: { message?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
