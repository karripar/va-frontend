import { vi, describe, test, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import DestinationAdminPanel from "@/components/exchange-destinations/destinationAdminPanel";

const mockGetDestinationUrls = vi.fn();
const mockUpdateDestinationUrl = vi.fn();
const mockDeleteDestinationUrl = vi.fn();

vi.mock("@/hooks/destinationUrlHooks", () => ({
  useDestinationUrls: () => ({
    getDestinationUrls: mockGetDestinationUrls,
    updateDestinationUrl: mockUpdateDestinationUrl,
    deleteDestinationUrl: mockDeleteDestinationUrl,
    loading: false,
    error: null,
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

describe("DestinationAdminPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders admin panel title and instructions", async () => {
    mockGetDestinationUrls.mockResolvedValue({ urls: [] });

    render(<DestinationAdminPanel />);

    await waitFor(() =>
      expect(
        screen.getByText(/Admin: Manage Destination URLs/i)
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText(
        /Adding or modifying a destination URL will affect the data sources/i
      )
    ).toBeInTheDocument();
  });

  test("renders fetched URLs in table", async () => {
    mockGetDestinationUrls.mockResolvedValue({
      urls: [
        { _id: "1", field: "tech", lang: "en", url: "https://example.com" },
      ],
    });

    render(<DestinationAdminPanel />);

    await waitFor(() =>
      expect(screen.getByText("https://example.com")).toBeInTheDocument()
    );
    expect(screen.getByText("tech")).toBeInTheDocument();
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  test("allows adding a new URL", async () => {
    mockGetDestinationUrls.mockResolvedValue({ urls: [] });
    mockUpdateDestinationUrl.mockResolvedValue({
      entry: { _id: "2", field: "tech", lang: "en", url: "https://new.com" },
    });

    render(<DestinationAdminPanel />);

    fireEvent.change(screen.getByPlaceholderText("URL"), {
      target: { value: "https://new.com" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByText("https://new.com")).toBeInTheDocument()
    );
  });

  test("allows deleting a URL", async () => {
    mockGetDestinationUrls.mockResolvedValue({
      urls: [
        { _id: "1", field: "tech", lang: "en", url: "https://delete.com" },
      ],
    });
    mockDeleteDestinationUrl.mockResolvedValue({});

    // Mock confirm dialog to return true
    vi.stubGlobal("confirm", () => true);

    render(<DestinationAdminPanel />);

    await waitFor(() =>
      expect(screen.getByText("https://delete.com")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() =>
      expect(screen.queryByText("https://delete.com")).not.toBeInTheDocument()
    );
  });

  test("shows error message if hook returns error", async () => {
    vi.mocked(mockGetDestinationUrls).mockRejectedValue(new Error("Failed"));

    render(<DestinationAdminPanel />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load URLs/i)).toBeInTheDocument()
    );
  });
});
