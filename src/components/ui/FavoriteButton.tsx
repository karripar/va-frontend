"use client";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  destinationName: string;
  className?: string;
}

/**
 * add/remove destinations from favorites
 */
export default function FavoriteButton({
  destinationName,
  className = "",
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const favorite = isFavorite(destinationName);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsAnimating(true);
    await toggleFavorite(destinationName);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        transition-all duration-200
        hover:scale-110 active:scale-95
        focus-ring shadow-sm p-2.5 bg-[var(--va-grey-50)] rounded-lg cursor-pointer
        ${isAnimating ? "scale-125" : ""}
        ${className}
      `}
      aria-label={
        favorite
          ? `Remove ${destinationName} from favorites`
          : `Add ${destinationName} to favorites`
      }
      title={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      {favorite ? (
        <FaHeart
          className="transition-colors duration-200"
          style={{ color: "var(--va-orange)" }}
          size={20}
        />
      ) : (
        <FaRegHeart
          className="transition-colors duration-200"
          style={{
            color: "var(--va-typography)",
          }}
          size={20}
        />
      )}
    </button>
  );
}
