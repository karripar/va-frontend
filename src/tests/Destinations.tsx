import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";



// === FIX: define mock BEFORE vi.mock and reuse the SAME reference
const mockUseDestinationData = vi.fn();

// === Context mocks
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

// === Destination hook mock (use the same reference!)
vi.mock("@/hooks/destinationHooks", () => ({
  useDestinationData: mockUseDestinationData,
}));

// === Component mocks
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

// === Import component after mocks
import DestinationsPage from "../app/destinations/page";

describe("DestinationsPage", () => {
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
