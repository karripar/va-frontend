"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * manage user's favorite destinations
 */
export const useFavorites = () => {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // get the users favorites from their profile
  useEffect(() => {
    if (user?.favorites) {
      setFavorites(user.favorites);
    }
  }, [user?.favorites]);

  /**
   * Add a destination to favorites
   */
  const addFavorite = useCallback(
    async (destination: string): Promise<boolean> => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Not authenticated");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_API}/profile/favorites`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ destination }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to add favorite: ${response.status}`);
        }

        const updatedUser = await response.json();
        setFavorites(updatedUser.favorites || []);

        // update user profile
        if (updateUser) {
          updateUser(updatedUser);
        }

        return true;
      } catch (err) {
        console.error("Error adding favorite:", err);
        setError("Failed to add favorite");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  /**
   * Remove a destination from favorites
   */
  const removeFavorite = useCallback(
    async (destination: string): Promise<boolean> => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Not authenticated");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_API}/profile/favorites`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ destination }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to remove favorite: ${response.status}`);
        }

        const updatedUser = await response.json();
        setFavorites(updatedUser.favorites || []);

        if (updateUser) {
          updateUser(updatedUser);
        }

        return true;
      } catch (err) {
        console.error("Error removing favorite:", err);
        setError("Failed to remove favorite");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  /**
   * toggle favorite status
   */
  const toggleFavorite = useCallback(
    async (destination: string): Promise<boolean> => {
      const isFavorite = favorites.includes(destination);
      return isFavorite
        ? await removeFavorite(destination)
        : await addFavorite(destination);
    },
    [favorites, addFavorite, removeFavorite]
  );

  /**
   * check if destination is in favorites
   */
  const isFavorite = useCallback(
    (destination: string): boolean => {
      return favorites.includes(destination);
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
