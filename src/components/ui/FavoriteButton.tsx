"use client";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  destinationName: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * add/remove destinations from favorites
 */
export default function FavoriteButton({
  destinationName,
  className = "",
  showLabel = false,
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
        flex items-center gap-2 
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-110 active:scale-95
        focus-ring
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
          style={{ color: "var(--va-grey)" }}
          size={20}
        />
      )}
      {showLabel && (
        <span
          className="text-sm font-medium"
          style={{ color: "var(--typography)" }}
        >
          {favorite ? "Suosikki" : "Lisää suosikkeihin"}
        </span>
      )}
    </button>
  );
}
