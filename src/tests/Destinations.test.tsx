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
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  test("renders no destinations available", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: null,
      destinationArray: null,
    });

    renderWithSuspense();
    expect(screen.getByText(/No destinations available/i)).toBeInTheDocument();
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
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "business" } });
    expect(select).toHaveValue("business");
  });
});
