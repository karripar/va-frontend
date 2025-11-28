import { useRouter } from "next/navigation";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import Link from "next/link";

interface ProfileHeaderProps {
  title: string;
  showEdit?: boolean;
  showBack?: boolean;
  backPath?: string;
}

export default function ProfileHeader({
  title,
  showEdit = false,
  showBack = true,
  backPath,
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-[var(--va-orange)] text-white px-4 flex items-center justify-center relative py-2 md:h-20 h-15 ">
      {showBack && (
        <button
          onClick={() => (backPath ? router.push(backPath) : router.back())}
          className="absolute left-6 text-white hover:text-gray-200 transition-colors"
          aria-label="Takaisin"
        >
          <FaArrowLeft size={20} />
        </button>
      )}

      <h1
        className="sm:text-2xl text-xl tracking-widest sm:max-w-full max-w-60 text-center"
        style={{ fontFamily: "var(--font-machina-bold)" }}
      >
        {title}
      </h1>

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
