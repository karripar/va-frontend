import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

const mockUseAuth = vi.fn();
const mockUsePathname = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/components/ui/ToggleSwitch", () => ({
  default: () => <div>Toggle Switch</div>,
}));

import NavBar from "@/components/NavBar";

// komponentin renderöinti
describe("NavBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: "Test User", user_level_id: 1 },
      isAuthenticated: true,
      loading: false,
    });
  });

  // tietokone navigaatio
  describe("Desktop Navigation", () => {
    test("renders logo and language toggle", () => {
      render(<NavBar />);

      expect(screen.getByAltText("Logo")).toBeInTheDocument();
      expect(
        screen.getAllByLabelText("Switch to Finnish").length
      ).toBeGreaterThan(0);
    });

    test("renders navigation categories", () => {
      render(<NavBar />);

      expect(screen.getByText("Student Exchange")).toBeInTheDocument();
      expect(screen.getByText("Community & Support")).toBeInTheDocument();
      expect(screen.getByText("User Settings")).toBeInTheDocument();
    });

    test("renders dropdown menu items", () => {
      render(<NavBar />);

      const exchangeButton = screen.getByText("Student Exchange");
      expect(exchangeButton).toBeInTheDocument();

      // kategorian alakategoriat
      const dropdownLinks = screen.getAllByText("Application Process");
      expect(dropdownLinks.length).toBeGreaterThan(0);
    });

    // navigaation kategoriat renderöityvät
    test("renders categories with dropdown arrows", () => {
      render(<NavBar />);

      expect(screen.getByText("Student Exchange")).toBeInTheDocument();
      expect(screen.getByText("Community & Support")).toBeInTheDocument();
      expect(screen.getByText("User Settings")).toBeInTheDocument();
    });

    // admin paneeli näkyy vain admin käyttäjille
    test("shows admin link for admin users", () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: "Admin User", user_level_id: 2 },
        isAuthenticated: true,
        loading: false,
      });

      render(<NavBar />);

      expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });

    test("hides admin link for non-admin users", () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: "Regular User", user_level_id: 1 },
        isAuthenticated: true,
        loading: false,
      });

      render(<NavBar />);

      expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    });
  });

  // mobiili navigaatio
  describe("Mobile Navigation", () => {
    test("renders hamburger menu button", () => {
      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      expect(hamburgerButton).toBeInTheDocument();
    });

    // hamppari menu aukeaa
    test("opens sidebar when hamburger clicked", async () => {
      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      await userEvent.click(hamburgerButton);

      await waitFor(() => {
        const mobileSidebar = document.querySelector(".translate-x-0");
        expect(mobileSidebar).toBeInTheDocument();
      });
    });

    // ja menun voi sulkea
    test("sidebar has close button", async () => {
      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      await userEvent.click(hamburgerButton);

      await waitFor(() => {
        const mobileSidebar = document.querySelector(".translate-x-0");
        expect(mobileSidebar).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByLabelText("Close menu");
      expect(closeButtons.length).toBe(2);
    });

    // hampparimenussa on navigaatiolinkit (user & admin)
    test("sidebar renders with navigation links", async () => {
      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      await userEvent.click(hamburgerButton);

      await waitFor(() => {
        const mobileSidebar = document.querySelector(".translate-x-0");
        expect(mobileSidebar).toBeInTheDocument();
      });

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Experiences & Tips")).toBeInTheDocument();
    });

    test("shows admin link in mobile menu for admin users", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: "Admin User", user_level_id: 2 },
        isAuthenticated: true,
        loading: false,
      });

      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      await userEvent.click(hamburgerButton);

      await waitFor(() => {
        const adminLinks = screen.getAllByText("Admin Panel");
        expect(adminLinks.length).toBeGreaterThan(0);
      });
    });

    test("hides admin link in mobile menu for non-admin users", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: "Regular User", user_level_id: 1 },
        isAuthenticated: true,
        loading: false,
      });

      render(<NavBar />);

      const hamburgerButton = screen.getByLabelText("Open menu");
      await userEvent.click(hamburgerButton);

      await waitFor(() => {
        const mobileSidebar = document.querySelector(".translate-x-0");
        expect(mobileSidebar).toBeInTheDocument();
      });

      expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    });
  });

  // navigaatio näkyy vaikkei ole kirjautunut
  describe("Authentication States", () => {
    test("renders navbar even when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: false,
      });

      render(<NavBar />);

      expect(screen.getByText("Student Exchange")).toBeInTheDocument();
    });

    test("renders during loading state", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: true,
      });

      render(<NavBar />);

      expect(screen.getByAltText("Logo")).toBeInTheDocument();
    });

    test("handles authentication loading state", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: true,
      });
      mockUsePathname.mockReturnValue("/");

      render(<NavBar />);

      expect(screen.getByAltText("Logo")).toBeInTheDocument();
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });

    test("renders correctly when user data is available", () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, name: "Test User", user_level_id: 1 },
        isAuthenticated: true,
        loading: false,
      });

      render(<NavBar />);

      expect(screen.getByText("Student Exchange")).toBeInTheDocument();
      expect(screen.getByAltText("Logo")).toBeInTheDocument();
    });
  });
});
