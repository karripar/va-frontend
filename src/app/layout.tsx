import "./globals.css";
import Navbar from "../components/NavBar";
import type { Metadata } from "next";

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
        <main className="mx-auto max-w-full mb-10">{children}</main>
      </body>
    </html>
  );
}
