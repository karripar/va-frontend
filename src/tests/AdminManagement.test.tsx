import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

// ---- Mock functions ----
const mockGetAdmins = vi.fn();
const mockPromote = vi.fn();
const mockDemote = vi.fn();
const mockElevate = vi.fn();
const mockSearchUsers = vi.fn();


// ---- Mock adminHooks ----
vi.mock("@/hooks/adminHooks", () => ({
  __esModule: true,
  default: () => ({
    getAdmins: mockGetAdmins,
    promoteToAdmin: mockPromote,
    demoteFromAdmin: mockDemote,
    elevateAdmin: mockElevate,
    loading: false,
  }),
}));

// ---- Mock searchHooks ----
vi.mock("@/hooks/searchHooks", () => ({
  __esModule: true,
  default: () => ({
    searchUsersByEmail: mockSearchUsers,
    usersLoading: false,
    error: null,
  }),
}));

// ---- Mock LanguageContext ----
vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
  }),
}));

// ---- MOCK AdminList ----
vi.mock("@/components/admin/AdminList", () => ({
  __esModule: true,
  default: ({
    admins,
    onDemote,
    onElevate,
  }: {
    admins: { _id: string; email: string; user_level_id: number }[];
    onDemote: (id: string) => void;
    onElevate: (id: string) => void;
  }) => (
    <div>
      {admins.map((a) => (
        <div key={a._id}>
          <span>{a.email}</span>

          <button onClick={() => onElevate(a._id)}>Elevate</button>
          <button onClick={() => onDemote(a._id)}>Demote</button>
        </div>
      ))}
    </div>
  ),
}));

// ---- Mock SearchUsers (kept minimal) ----
vi.mock("@/components/admin/SearchUsers", () => ({
    __esModule: true,
    default: function SearchUsers() {
      const [query, setQuery] = React.useState("");
  
      React.useEffect(() => {
        if (query) {
          // Call mock immediately, ignore real debounce
          mockSearchUsers(query);
        }
      }, [query]);
  
      return (
        <input
          placeholder="Search by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      );
    },
  }));
  

// Real component
import AdminBoard from "@/app/admin/controls/admins/page";

describe("AdminBoard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Loads admins on mount
  test("loads and displays admins on mount", async () => {
    mockGetAdmins.mockResolvedValueOnce({
      admins: [
        { _id: "1", email: "admin1@example.com", user_level_id: 2 },
        { _id: "2", email: "admin2@example.com", user_level_id: 3 },
      ],
    });

    render(<AdminBoard />);

    expect(await screen.findByText("admin1@example.com")).toBeInTheDocument();
    expect(await screen.findByText("admin2@example.com")).toBeInTheDocument();
  });

  // 2. Manual Add Admin works
  test("adds a new admin when form is submitted", async () => {
    mockGetAdmins.mockResolvedValueOnce({ admins: [] }); // initial

    mockPromote.mockResolvedValueOnce({ message: "ok" });

    mockGetAdmins.mockResolvedValueOnce({
      admins: [{ _id: "9", email: "new@admin.com", user_level_id: 2 }],
    });

    render(<AdminBoard />);

    await userEvent.type(
      screen.getByPlaceholderText(/Enter user email/i),
      "new@admin.com"
    );

    await userEvent.type(
      screen.getByPlaceholderText(/Confirm user email/i),
      "new@admin.com"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /Add as Admin/i })
    );

    expect(mockPromote).toHaveBeenCalledWith("new@admin.com");

    expect(await screen.findByText("new@admin.com")).toBeInTheDocument();
  });

  // 3. Demoting an admin
  test("demotes an admin when confirmed", async () => {
    mockGetAdmins.mockResolvedValueOnce({
      admins: [{ _id: "1", email: "to@demote.com", user_level_id: 2 }],
    });

    mockDemote.mockResolvedValueOnce({ message: "ok" });

    mockGetAdmins.mockResolvedValueOnce({
      admins: [],
    });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminBoard />);

    expect(await screen.findByText("to@demote.com")).toBeInTheDocument();

    const demoteButton = screen.getByRole("button", { name: /Demote/i });
    await userEvent.click(demoteButton);

    expect(mockDemote).toHaveBeenCalledWith("1");
  });

  // 4. Elevating an admin
  test("elevates admin when confirmed", async () => {
    mockGetAdmins.mockResolvedValueOnce({
      admins: [{ _id: "1", email: "elevate@admin.com", user_level_id: 2 }],
    });

    mockElevate.mockResolvedValueOnce({ message: "ok" });

    mockGetAdmins.mockResolvedValueOnce({ admins: [] });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminBoard />);

    expect(await screen.findByText("elevate@admin.com")).toBeInTheDocument();

    const elevateButton = screen.getByRole("button", { name: /Elevate/i });
    await userEvent.click(elevateButton);

    expect(mockElevate).toHaveBeenCalledWith("1");
  });

  // 5. Search calls searchUsersByEmail
  test("search triggers user search after typing", async () => {
    mockSearchUsers.mockResolvedValue([{ _id: "u1", email: "search@example.com" }]);
    render(<AdminBoard />);
  
    const input = screen.getByPlaceholderText(/Search by email/i);
    await userEvent.type(input, "search@example.com");
  
    expect(mockSearchUsers).toHaveBeenCalledWith("search@example.com");
  });
  
  

  // 6. Error when fetching admins fails
  test("shows error if getAdmins fails", async () => {
    mockGetAdmins.mockRejectedValueOnce(new Error("fail"));
    render(<AdminBoard />);
    expect(
      await screen.findByText(/Failed to fetch admins/i)
    ).toBeInTheDocument();
  });
});
