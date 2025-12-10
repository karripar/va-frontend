import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React, { Suspense } from "react";

vi.setConfig({ testTimeout: 10000 });

const mockUseDestinationData = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: 1,
      name: "Test Admin",
      email: "admin@example.com",
      user_level_id: 2,
    },
  }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

vi.mock("@/hooks/destinationHooks", () => ({
  useDestinationData: () => mockUseDestinationData(),
}));

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

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="mocked-image" {...props} />
  ),
}));

vi.mock("@/components/exchange-destinations/DestinationMap", () => ({
  default: () => <div data-testid="mock-map" />,
}));

vi.mock("@/components/exchange-destinations/DestinationList", () => ({
  default: (props: { data: { length: number } }) => (
    <div data-testid="mock-list">{props.data.length} destinations</div>
  ),
}));

import DestinationsPage from "@/app/destinations/page";
import DestinationAdminPanel from "@/components/exchange-destinations/destinationAdminPanel";

describe("DestinationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithSuspense = () =>
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DestinationsPage />
      </Suspense>
    );

  test("renders loading state", () => {
    mockUseDestinationData.mockReturnValue({
      loading: true,
      error: null,
      destinationArray: null,
    });

    renderWithSuspense();
    expect(screen.getByText(/Loading destinations/i)).toBeInTheDocument();
  });

  test("renders error message", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: "Failed to fetch",
      destinationArray: null,
    });

    renderWithSuspense();
    expect(
      screen.getByText(/Could not load destinations/i)
    ).toBeInTheDocument();
  });

  test("renders destinations and components", async () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: null,
      destinationArray: [
        { id: 1, name: "Metropolia Partner", country: "Finland" },
      ],
    });

    renderWithSuspense();

    // Wait until the lazy mock finishes rendering (lazy import is needed in actual component)
    await waitFor(() =>
      expect(screen.getByTestId("mock-map")).toBeInTheDocument()
    );
    expect(screen.getByTestId("mock-list")).toHaveTextContent("1 destinations");
  });

  test("changes selected field via dropdown", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: null,
      destinationArray: [
        { id: 1, name: "Tech University", country: "Germany" },
      ],
    });

    renderWithSuspense();
    const select = screen.getByTestId("destination-field-select");
    fireEvent.change(select, { target: { value: "business" } });
    expect(select).toHaveValue("business");
  });
});

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
        /Changing or adding a destination URL will update the data source/i
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
