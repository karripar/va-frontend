import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AdminContactPage from "../app/admin/contact-messages/page";
import { act } from "@testing-library/react";

// Mock window.alert to prevent popups
window.alert = vi.fn();

// === Context mocks (exact casing matters)
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

// === Mock fetch for API calls ===
const mockMessages = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Exchange program question",
    message: "Hi! I’d like more info about the exchange process.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Application help",
    message: "How do I upload my documents?",
  },
];

//  Mock localStorage token (authToken)
beforeAll(() => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "authToken") return "fake-jwt-token";
    return null;
  });

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ messages: mockMessages }),
    })
  ) as unknown as typeof fetch;
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe("AdminContactPage", () => {
  test("renders heading and loading state initially", () => {
    render(<AdminContactPage />);
    expect(screen.getByText(/Manage Contact Messages/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
  });

  test("displays messages after fetch", async () => {
    render(<AdminContactPage />);

    // Wait until fetch is called and messages appear
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });

  test("filters messages by input", async () => {
    render(<AdminContactPage />);
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const search = screen.getByPlaceholderText(
      /Search by name, email, or subject/i
    );
    fireEvent.change(search, { target: { value: "Jane" } });

    expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  it("sends a reply to selected message", async () => {
    render(<AdminContactPage />);

    const messageItem = await screen.findByText((content) =>
      content.includes("John") || content.includes("john@example.com")
    );
    

    await act(async () => {
      fireEvent.click(messageItem);
    });

    const replyInput = screen.getByPlaceholderText("Write a Reply");

    await act(async () => {
      fireEvent.change(replyInput, {
        target: { value: "Thanks for your question!" },
      });
    });

    const sendButton = screen.getByText("Send Reply");

    await act(async () => {
      fireEvent.click(sendButton);
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Reply sent to john@example.com"
    );
    
  });

  test("shows error message if fetch fails", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Unauthorized" }),
      })
    );

    render(<AdminContactPage />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch messages/i)).toBeInTheDocument();
    });
  });
});
