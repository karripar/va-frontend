"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/profile");

  // Don't render Navbar on profile pages
  if (isProfilePage) {
    return null;
  }

  return <Navbar />;
}