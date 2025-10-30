import "./globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ProtectedLayout from "../components/ProtectedLayout";
import type { Metadata } from "next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "Vaihtoaktivaattori",
  description: "Platform for students interested in student exchange.",
  manifest: "/manifest.json", // points to your manifest
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/app-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/app-icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="fi">
      <body className={` antialiased`}>
        <GoogleOAuthProvider clientId={clientId}>
          <AuthProvider>
            <ConditionalNavbar />
            <ProtectedLayout>
              <main className="mx-auto max-w-full mb-10">{children}</main>
            </ProtectedLayout>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
