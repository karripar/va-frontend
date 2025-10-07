"use client"

import React, { createContext, useState, useEffect } from "react"

// types for authentication
type GoogleAuthResponse = {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: GoogleAuthResponse | null;
  loading: boolean;
  error: string | null;
  login: (userData: GoogleAuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GoogleAuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // check authentication status
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const userData = JSON.parse(userProfile) as GoogleAuthResponse;
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log("No user found in localStorage");
      }
    } catch (err) {
      console.error("Failed to load authentication state:", err);
      setError("Failed to load authentication state");

      localStorage.removeItem("userProfile");
    } finally {
      setLoading(false);
    }
  }, []);

  // handle login
  const login = (userData: GoogleAuthResponse) => {
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
    // store the user google id in localStorage
    localStorage.setItem("userProfile", JSON.stringify(userData));
  };

  // handle logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    // clear localStorage
    localStorage.removeItem("userProfile");
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

