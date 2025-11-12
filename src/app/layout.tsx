import "./globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import ProtectedLayout from "../components/ProtectedLayout";
import type { Metadata } from "next";
import ClientProviders from "./clientProviders";

export const metadata: Metadata = {
  title: "Vaihtoaktivaattori",
  description: "Platform for students interested in student exchange.",
  manifest: "/manifest.json",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body className="antialiased">
        <ClientProviders>
          <ConditionalNavbar />
          <ProtectedLayout>
            <main className="mx-auto max-w-full mb-10">{children}</main>
          </ProtectedLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
