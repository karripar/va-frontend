import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

const mockGetContacts = vi.fn();
const mockAddContact = vi.fn();
const mockDeleteContact = vi.fn();

// Mock hooks
vi.mock("@/hooks/contactHooks", () => ({
  useAdminContacts: () => ({
    getContacts: mockGetContacts,
    addContact: mockAddContact,
    deleteContact: mockDeleteContact,
    loading: false,
    error: null,
  }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: 1,
      name: "Admin Tester",
      email: "admin@example.com",
      user_level_id: 2,
    },
    loading: false,
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

import ContactPage from "@/app/contact/page";

describe("ContactPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders fetched contacts", async () => {
    mockGetContacts.mockResolvedValueOnce({
      contacts: [
        {
          _id: "1",
          name: "John Doe",
          title: "Manager",
          email: "john@example.com",
        },
        {
          _id: "2",
          name: "Jane Smith",
          title: "Admin",
          email: "jane@example.com",
        },
      ],
    });

    render(<ContactPage />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
  });

  test("allows admin to add a new contact", async () => {
    mockGetContacts.mockResolvedValueOnce({ contacts: [] });
    mockAddContact.mockResolvedValueOnce({
      contact: {
        _id: "3",
        name: "New Admin",
        title: "Support",
        email: "new@admin.com",
      },
    });

    render(<ContactPage />);

    await userEvent.type(screen.getByPlaceholderText(/Name/i), "New Admin");
    await userEvent.type(screen.getByPlaceholderText(/Title/i), "Support");
    await userEvent.type(
      screen.getByPlaceholderText(/Email/i),
      "new@admin.com"
    );

    await userEvent.click(screen.getByRole("button", { name: /Add/i }));

    expect(mockAddContact).toHaveBeenCalledWith({
      name: "New Admin",
      title: "Support",
      email: "new@admin.com",
    });

    // Optional: verify new contact appears
    expect(await screen.findByText("New Admin")).toBeInTheDocument();
  });

  test("allows admin to delete a contact", async () => {
    mockGetContacts.mockResolvedValueOnce({
      contacts: [
        {
          _id: "1",
          name: "John Doe",
          title: "Manager",
          email: "john@example.com",
        },
      ],
    });
    mockDeleteContact.mockResolvedValueOnce({ success: true });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<ContactPage />);

    expect(await screen.findByText("John Doe")).toBeInTheDocument();

    await userEvent.click(screen.getByText(/Remove/i));

    expect(mockDeleteContact).toHaveBeenCalledWith("1");
  });

  test("renders error message if fetching fails", async () => {
    mockGetContacts.mockRejectedValueOnce(new Error("Failed to fetch"));

    // Override hook to propagate error
    vi.mock("@/hooks/contactHooks", () => ({
      useAdminContacts: () => ({
        getContacts: mockGetContacts,
        addContact: mockAddContact,
        deleteContact: mockDeleteContact,
        loading: false,
        error: "Failed to fetch contacts", // simulate what component expects
      }),
    }));

    render(<ContactPage />);

    // wait for the error message to appear
    const errorEl = await screen.findByText("Failed to fetch contacts");
    expect(errorEl).toBeInTheDocument();
  });
});
