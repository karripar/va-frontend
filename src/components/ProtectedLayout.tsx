"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_LEVEL_ID } from "@/config/roles";


// Login page is the only one that don't require authentication
const PUBLIC_PAGES = ["/login"];

const ADMIN_PREFIX = "/admin";

if (!ADMIN_LEVEL_ID) {
  console.warn(
    "NEXT_PUBLIC_ADMIN_LEVEL_ID is not defined in environment variables"
  );
}

// create a protected layout for the pages that require authentication
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);

  useEffect(() => {
    // redirect to login if we're not loading, not authenticated, and not on a login page
    if (!loading && !isAuthenticated && !isPublicPage) {
      router.push("/login");
    }

    // redirect to home if non-admin user tries to access admin routes (user_level_id 2 is admin)
    if (
      !loading &&
      isAuthenticated &&
      isAdminRoute &&
      user?.user_level_id !== Number(ADMIN_LEVEL_ID)
    ) {
      router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
