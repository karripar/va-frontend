import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

vi.mock("@/config/roles", () => ({
  ADMIN_LEVEL_ID: 2,
  ELEVATED_LEVEL_ID: 3,
}));

const mockPush = vi.fn();
const mockUsePathname = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockUsePathname(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

import ProtectedLayout from "@/components/ProtectedLayout";

// komponentin renderöinti
describe("ProtectedLayout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { id: 1, user_level_id: 1 },
    });
  });

  // login sivu on ainoa julkinen sivu
  describe("Authentication Redirects", () => {
    test("redirects to /login when not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      mockUsePathname.mockReturnValue("/");

      render(
        <ProtectedLayout>
          <div>Protected Content</div>
        </ProtectedLayout>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    // muut sivut näkyvät kun on kirjautunut
    test("renders children when authenticated on protected route", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 1 },
      });
      mockUsePathname.mockReturnValue("/");

      render(
        <ProtectedLayout>
          <div>Protected Content</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("renders children on public page (login) without redirect", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      mockUsePathname.mockReturnValue("/login");

      render(
        <ProtectedLayout>
          <div>Login Form</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("Login Form")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("does not redirect if already on login page", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      mockUsePathname.mockReturnValue("/login");

      render(
        <ProtectedLayout>
          <div>Login Page</div>
        </ProtectedLayout>
      );

      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  // admin reittien suojaus
  describe("Admin Route Protection", () => {
    test("redirects non-admin users from admin routes", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 1 }, // regular user
      });
      mockUsePathname.mockReturnValue("/admin");

      render(
        <ProtectedLayout>
          <div>Admin Content</div>
        </ProtectedLayout>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    test("allows admin users to access admin routes", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 2 }, // admin user
      });
      mockUsePathname.mockReturnValue("/admin");

      render(
        <ProtectedLayout>
          <div>Admin Content</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("Admin Content")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("redirects non-admin from nested admin routes", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 1 },
      });
      mockUsePathname.mockReturnValue("/admin/fileManagement");

      render(
        <ProtectedLayout>
          <div>File Management</div>
        </ProtectedLayout>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    test("allows admin users on nested admin routes", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 2 },
      });
      mockUsePathname.mockReturnValue("/admin/fileManagement");

      render(
        <ProtectedLayout>
          <div>File Management</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("File Management")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Loading States", () => {
    test("shows loading state while authentication is loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: true,
        user: null,
      });
      mockUsePathname.mockReturnValue("/");

      render(
        <ProtectedLayout>
          <div>Protected Content</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("Ladataan...")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    test("does not redirect while loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: true,
        user: null,
      });
      mockUsePathname.mockReturnValue("/");

      render(
        <ProtectedLayout>
          <div>Content</div>
        </ProtectedLayout>
      );

      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText("Ladataan...")).toBeInTheDocument();
    });

    test("renders children after loading completes for authenticated user", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1, user_level_id: 1 },
      });
      mockUsePathname.mockReturnValue("/");

      render(
        <ProtectedLayout>
          <div>Protected Content</div>
        </ProtectedLayout>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(screen.queryByText("Ladataan...")).not.toBeInTheDocument();
    });
  });

  // muut testit
  describe("Edge Cases", () => {
    test("handles missing user object", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: null, // user is null but authenticated
      });
      mockUsePathname.mockReturnValue("/admin");

      render(
        <ProtectedLayout>
          <div>Admin Content</div>
        </ProtectedLayout>
      );

      // käyttäjä level undefined joten käyttäjä ohjataan pois
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    test("handles undefined user_level_id", async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        loading: false,
        user: { id: 1 }, // no user_level_id
      });
      mockUsePathname.mockReturnValue("/admin");

      render(
        <ProtectedLayout>
          <div>Admin Content</div>
        </ProtectedLayout>
      );

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    // suojaa reitit oikein kun käyttäjä ei ole kirjautunut
    test("renders nothing for unauthenticated user on protected route", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      mockUsePathname.mockReturnValue("/destinations");

      const { container } = render(
        <ProtectedLayout>
          <div>Destinations</div>
        </ProtectedLayout>
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
