"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_LEVEL_ID, ELEVATED_LEVEL_ID} from "@/config/roles";


// Login page is the only one that don't require authentication
const PUBLIC_PAGES = [
  "/login", 
  "/content/docs/apidoc/index.html", 
  "/auth/docs/apidoc/index.html", 
  "/upload/docs/apidoc/index.html",
  "/content/docs/typedoc/index.html",
  "/auth/docs/typedoc/index.html",
  "/upload/docs/typedoc/index.html"
];

const ADMIN_PREFIX = "/admin";

const adminLevels = [Number(ADMIN_LEVEL_ID), Number(ELEVATED_LEVEL_ID)];

if (!ADMIN_LEVEL_ID || !ELEVATED_LEVEL_ID) {
  console.warn(
    "NEXT_PUBLIC_ADMIN_LEVEL_ID is not set in config/roles.ts"
  );
}

// create a protected layout for the pages that require authentication
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PAGES.some((page) => pathname.startsWith(page));
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);

  useEffect(() => {
    // redirect to login if we're not loading, not authenticated, and not on a login page
    if (!loading && !isAuthenticated && !isPublicPage) {
      router.push("/login");
    }

    // redirect to home if non-admin user tries to access admin routes (user_level_id 2 is admin, 3 is elevated admin)
    if (
      !loading &&
      isAuthenticated &&
      isAdminRoute &&
      !adminLevels.includes(Number(user?.user_level_id))
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
