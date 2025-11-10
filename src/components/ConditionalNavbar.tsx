"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/profile");
  const isAdminPage = pathname?.startsWith("/admin");

  // Don't render Navbar on profile or admin pages
  if (isProfilePage || isAdminPage) {
    return null;
  }

  return <Navbar />;
}