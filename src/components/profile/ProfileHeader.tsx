import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

interface ProfileHeaderProps {
  title: string;
  showBack?: boolean;
  backPath?: string;
}

export default function ProfileHeader({
  title,
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
    </div>
  );
}
