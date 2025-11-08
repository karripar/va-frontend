"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <LanguageProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>{children}</AuthProvider>
      </GoogleOAuthProvider>
    </LanguageProvider>
  );
}
