"use client";

import React, { createContext, useState, useEffect } from "react";
import { ProfileResponse } from "va-hybrid-types/contentTypes";
import { authService } from "@/services/authService";

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

  const handleLogin = (userData: ProfileResponse) => {
    setUser(userData);
  };

  // logout
  const handleLogout = async () => {
    try {
      authService.removeToken();
      setUser(null);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  // Check if user is authenticated by fetching profile
  const handleAutoLogin = async () => {
    try {
      setLoading(true);

      // get token from localStorage
      const token = authService.getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/v1/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.log("Auto-login failed: no valid token");
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
