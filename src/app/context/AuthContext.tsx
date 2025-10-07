"use client";

import React, { createContext, useState, useEffect } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import { useLogout } from "@/hooks/apiHooks";

type AuthContextType = {
  user: ProfileResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  handleLogin: (user: ProfileResponse) => void;
  handleLogout: () => void;
  handleAutoLogin: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Use apiHooks for data fetching
  const { logout: apiLogout } = useLogout();

  const handleLogin = (userData: ProfileResponse) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const success = await apiLogout();
    if (success) {
      setUser(null);
    }
  };

  // Check if user is authenticated by fetching profile
  const handleAutoLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/api/v1/users/profile",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.log("Auto-login failed: no valid cookie");
      }
    } catch (error) {
      console.error("Auto-login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAutoLogin();
  }, []);

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        handleLogin,
        handleLogout,
        handleAutoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
