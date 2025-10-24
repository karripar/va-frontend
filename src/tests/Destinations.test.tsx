import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";


/*

This file is for destinations page component tests. Create a separate test file for other topics.

*/


//  Mocks must be declared BEFORE importing the component
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

vi.mock("@/hooks/apiHooks", () => ({
  useDestinationData: vi.fn(),
}));


/* Actual tests start here */

import DestinationsPage from "../app/destinations/page";
import { useDestinationData } from "@/hooks/apiHooks";


describe("DestinationsPage", () => {
  const mockUseDestinationData = useDestinationData as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state", () => {
    mockUseDestinationData.mockReturnValue({
      loading: true,
      error: null,
      destinationArray: null,
    });

    render(<DestinationsPage />);
    expect(screen.getByText(/Loading destinations/i)).toBeInTheDocument();
  });

  test("renders error message", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: "Failed to fetch",
      destinationArray: null,
    });

    render(<DestinationsPage />);
    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  test("renders no destinations available", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: null,
      destinationArray: null,
    });

    render(<DestinationsPage />);
    expect(screen.getByText(/No destinations available/i)).toBeInTheDocument();
  });

  test("renders destinations and components", () => {
    mockUseDestinationData.mockReturnValue({
      loading: false,
      error: null,
      destinationArray: [
        { id: 1, name: "Metropolia Partner", country: "Finland" },
      ],
    });

    render(<DestinationsPage />);
    expect(screen.getByTestId("mock-map")).toBeInTheDocument();
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

    render(<DestinationsPage />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "business" } });
    expect(select).toHaveValue("business");
  });
});
