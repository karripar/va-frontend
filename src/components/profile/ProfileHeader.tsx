import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import Link from "next/link";

interface ProfileHeaderProps {
  title: string;
  showEdit?: boolean;
  showBack?: boolean;
  backPath?: string;
}

export default function ProfileHeader({ title, showEdit = false, showBack = true, backPath }: ProfileHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="bg-[#FF5722] text-white p-4 flex items-center justify-center relative">
      {showBack && (
        <button
          onClick={() => backPath ? router.push(backPath) : router.back()}
          className="absolute left-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Takaisin"
        >
          <FaArrowLeft size={20} />
        </button>
      )}
      
      <h1 className="text-2xl font-bold">{title}</h1>
      
      {showEdit && (
        <Link
          href="/profile/edit"
          className="absolute right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Muokkaa profiilia"
        >
          <FaEdit size={24} />
        </Link>
      )}
    </div>
  );
}
