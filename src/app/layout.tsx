"use client";
import "./globals.css";
import Navbar from "../components/NavBar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/profile");

  return (
    <html lang="fi">
      <body className={` antialiased`}>
        {!isProfilePage && <Navbar />}
        <main className="mx-auto max-w-full">{children}</main>
      </body>
    </html>
  );
}
