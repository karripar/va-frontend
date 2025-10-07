"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

// Login page is the only one that don't require authentication
const PUBLIC_PAGES = ["/login"];

// create a protected layout for the pages that require authentication
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PAGES.includes(pathname);

  useEffect(() => {
    // redirect to login if we're not loading, not authenticated, and not on a login page
    if (!loading && !isAuthenticated && !isPublicPage) {
      router.push("/login");
    }
  }, [router, isAuthenticated, loading, isPublicPage, pathname]);

  // load while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ladataan...</p>
      </div>
    );
  }

  // render login page
  if (isPublicPage) {
    return <>{children}</>;
  }

  // render protected pages only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
