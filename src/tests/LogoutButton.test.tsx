import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

const mockHandleLogout = vi.fn();
const mockPush = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    handleLogout: mockHandleLogout,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import LogoutButton from "@/components/ui/LogoutButton";

// komponentin renderöinti
describe("LogoutButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders logout button", () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByLabelText("Logout");
    expect(logoutButton).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<LogoutButton className="custom-class" />);

    const logoutButton = screen.getByLabelText("Logout");
    expect(logoutButton).toHaveClass("custom-class");
  });

  // modaali aukeaa ja sulkeutuu oikein
  test("opens confirmation modal when clicked", async () => {
    render(<LogoutButton />);

    const logoutButton = screen.getByLabelText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to logout?")
      ).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  test("closes modal when cancel clicked", async () => {
    render(<LogoutButton />);

    // avaa vahvistusmodaali
    const logoutButton = screen.getByLabelText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to logout?")
      ).toBeInTheDocument();
    });

    // peruuta
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to logout?")
      ).not.toBeInTheDocument();
    });
  });

  // logout toimii ja ohjaa käyttäjän takaisin login sivulle
  test("calls handleLogout and redirects when confirmed", async () => {
    render(<LogoutButton />);

    // avaa vahvistusmodaali
    const logoutButton = screen.getByLabelText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to logout?")
      ).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Logout");
    const confirmButton = confirmButtons.find(
      (btn) =>
        btn.tagName === "BUTTON" &&
        btn.className.includes("bg-[var(--va-orange)]")
    );

    if (confirmButton) {
      await userEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(mockHandleLogout).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  // logout modaali sulkeutuu kun vahvistettu
  test("modal closes after logout confirmation", async () => {
    render(<LogoutButton />);

    // avaa vahvistusmodaali
    const logoutButton = screen.getByLabelText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(
        screen.getByText("Are you sure you want to logout?")
      ).toBeInTheDocument();
    });

    const confirmButtons = screen.getAllByText("Logout");
    const confirmButton = confirmButtons.find(
      (btn) =>
        btn.tagName === "BUTTON" &&
        btn.className.includes("bg-[var(--va-orange)]")
    );

    if (confirmButton) {
      await userEvent.click(confirmButton);
    }

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to logout?")
      ).not.toBeInTheDocument();
    });
  });
});
