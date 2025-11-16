"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Debug: Check if Client ID is loaded
  if (!clientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set!");
  }

  return (
    <LanguageProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>{children}</AuthProvider>
      </GoogleOAuthProvider>
    </LanguageProvider>
  );
}
