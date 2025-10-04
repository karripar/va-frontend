import "./globals.css";
import Navbar from "./components/NavBar";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  return (
    <html lang="fi">
      <body className={` antialiased`}>
        <Navbar />
        <main className="mx-auto max-w-6xl">{children}</main>
      </body>
    </html>
  );
}
