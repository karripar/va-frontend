import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

const mockGetInstructionVisibility = vi.fn();
const mockToggleVisibility = vi.fn();
const mockGetInstructionLinks = vi.fn();
const mockUpdateLink = vi.fn();
const mockUploadFile = vi.fn();

// Mock hooks
vi.mock("@/hooks/instructionHooks", () => ({
  useInstructionVisibility: () => mockGetInstructionVisibility(),
  useToggleInstructionVisibility: () => ({
    toggleVisibility: mockToggleVisibility,
    loading: false,
    error: null,
  }),
  useInstructionLinks: () => mockGetInstructionLinks(),
  useUpdateInstructionLink: () => ({
    updateLink: mockUpdateLink,
    loading: false,
    error: null,
  }),
}));

vi.mock("@/hooks/useFileUpload", () => ({
  useFileUpload: () => ({
    uploadFile: mockUploadFile,
    uploading: false,
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

// Mock AuthContext - Stepper uses useContext(AuthContext)
vi.mock("@/context/AuthContext", async () => {
  const actual = await vi.importActual("react");
  const React = actual as typeof import("react");
  return {
    AuthContext: React.createContext({
      user: {
        id: 1,
        name: "Admin Tester",
        email: "admin@example.com",
        user_level_id: 2,
      },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  };
});

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    language: "en",
    toggleLanguage: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="mocked-image" {...props} />
  ),
}));

import InstructionsPage from "@/app/instructions/page";
import { Stepper } from "@/components/ui/Card";

// komponentin renderöinti
describe("InstructionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default mock values
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true, true, true, true, true, true, true, true, true],
      loading: false,
      error: null,
    });
    mockGetInstructionLinks.mockReturnValue({
      links: [],
      loading: false,
      error: null,
    });
  });

  test("renders instructions page with title and content", () => {
    render(<InstructionsPage />);

    expect(screen.getByText("Ready for an adventure?")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Exchange studies open doors to new cultures, friendships and professional insights/i
      )
    ).toBeInTheDocument();
  });

  // kaikki 9 steppiä renderöityy
  test("renders all 9 instruction steps", () => {
    render(<InstructionsPage />);

    expect(screen.getByText("Find information")).toBeInTheDocument();
    expect(screen.getByText("Application info")).toBeInTheDocument();
    expect(screen.getByText("Before you apply")).toBeInTheDocument();
    expect(
      screen.getByText("Metropolia's internal application")
    ).toBeInTheDocument();
    expect(screen.getByText("Internal selection results")).toBeInTheDocument();
    expect(
      screen.getByText("Apply to the host university")
    ).toBeInTheDocument();
    expect(screen.getByText("Filling attachments")).toBeInTheDocument();
    expect(
      screen.getByText("Submitting application & acceptance")
    ).toBeInTheDocument();
    expect(screen.getByText("Prepare for departure")).toBeInTheDocument();
  });

  // opiskelija.metropolia linkit näkyvät
  test("renders external links to Metropolia resources", () => {
    render(<InstructionsPage />);

    const exchangeLink = screen.getByText("Exchange studies").closest("a");
    const applyLink = screen.getByText("Apply for exchange").closest("a");
    const checklistLink = screen.getByText("Checklist").closest("a");

    expect(exchangeLink).toHaveAttribute(
      "href",
      expect.stringContaining("opiskelijan.metropolia.fi")
    );
    expect(applyLink).toHaveAttribute(
      "href",
      expect.stringContaining("opiskelijan.metropolia.fi")
    );
    expect(checklistLink).toHaveAttribute(
      "href",
      expect.stringContaining("opiskelijan.metropolia.fi")
    );
  });

  test("renders disclaimer text", () => {
    render(<InstructionsPage />);

    expect(
      screen.getByText(
        /This page is a student-created summary of the Metropolia exchange application process/i
      )
    ).toBeInTheDocument();
  });
});

// Stepper (instructions-kortti) komponentti testit
describe("Stepper Component - Visibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetInstructionLinks.mockReturnValue({
      links: [],
      loading: false,
      error: null,
    });
  });

  // kaikki ei-piilotetut stepit näkyvät
  test("renders all visible steps", () => {
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true, true, true],
      loading: false,
      error: null,
    });

    const steps = [
      { title: "Step 1", text: <p>Content 1</p> },
      { title: "Step 2", text: <p>Content 2</p> },
      { title: "Step 3", text: <p>Content 3</p> },
    ];

    render(<Stepper steps={steps} />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  // piilotetut stepit eivät näy normi käyttäjälle
  test("hides steps marked as hidden for non-admin users", () => {
    // non-admin user
    vi.mock("@/hooks/useAuth", () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: {
          id: 1,
          name: "Regular User",
          email: "user@example.com",
          user_level_id: 1,
        },
        loading: false,
      }),
    }));

    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true, false, true],
      loading: false,
      error: null,
    });

    const steps = [
      { title: "Step 1", text: <p>Content 1</p> },
      { title: "Step 2", text: <p>Content 2</p> },
      { title: "Step 3", text: <p>Content 3</p> },
    ];

    render(<Stepper steps={steps} />);

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.queryByText("Step 2")).not.toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  // admin voi piilottaa/näyttää stepin
  test("admin can toggle step visibility", async () => {
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true, true],
      loading: false,
      error: null,
    });
    mockToggleVisibility.mockResolvedValue(false);

    const steps = [
      { title: "Step 1", text: <p>Content 1</p> },
      { title: "Step 2", text: <p>Content 2</p> },
    ];

    render(<Stepper steps={steps} />);

    const eyeButtons = screen.getAllByRole("button", { name: /Hide step/i });
    await userEvent.click(eyeButtons[0]);

    expect(mockToggleVisibility).toHaveBeenCalledWith(0);
  });
});

describe("Stepper Component - Links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true, true],
      loading: false,
      error: null,
    });
  });

  // backendistä tulevat linkit + labelit renderöityy
  test("renders instruction links from API", () => {
    mockGetInstructionLinks.mockReturnValue({
      links: [
        {
          _id: "1",
          stepIndex: 0,
          labelFi: "Linkki suomeksi",
          labelEn: "Link in English",
          href: "https://example.com",
          isExternal: true,
          isFile: false,
        },
      ],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);

    expect(screen.getByText("Link in English")).toBeInTheDocument();
    const link = screen.getByText("Link in English").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  test("renders file icon for file links", () => {
    mockGetInstructionLinks.mockReturnValue({
      links: [
        {
          _id: "1",
          stepIndex: 0,
          labelEn: "Document",
          href: "https://example.com/doc.pdf",
          isExternal: false,
          isFile: true,
        },
      ],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);

    expect(screen.getByText("Document")).toBeInTheDocument();
  });

  // vain admin voi muokata linkkien URL
  test("admin can edit instruction link", async () => {
    mockGetInstructionLinks.mockReturnValue({
      links: [
        {
          _id: "link-1",
          stepIndex: 0,
          labelEn: "Old Link",
          href: "https://old.com",
          isExternal: true,
          isFile: false,
        },
      ],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);

    // muokkaa nappi
    const editButton = screen.getByRole("button", { name: /edit link/i });
    await userEvent.click(editButton);

    // linkin muokkauslomake renderöityy
    expect(screen.getByText("Current URL:")).toBeInTheDocument();
    expect(screen.getByText("https://old.com")).toBeInTheDocument();

    // muokkaa linkki
    const input = screen.getByPlaceholderText("https://...");
    await userEvent.type(input, "https://new.com");

    // päivitä nappi
    mockUpdateLink.mockResolvedValue({
      _id: "link-1",
      href: "https://new.com",
      isExternal: true,
      isFile: false,
    });

    const updateButton = screen.getByRole("button", { name: /^Update$/i });
    await userEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateLink).toHaveBeenCalledWith("link-1", {
        href: "https://new.com",
      });
    });
  });

  // admin voi uploadata uuden tiedoston
  test("admin can upload file and update link", async () => {
    mockGetInstructionLinks.mockReturnValue({
      links: [
        {
          _id: "link-1",
          stepIndex: 0,
          labelEn: "Document",
          href: "https://old.com/doc.pdf",
          isExternal: false,
          isFile: true,
        },
      ],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);

    // muokkaa nappi
    const editButton = screen.getByRole("button", { name: /edit link/i });
    await userEvent.click(editButton);

    // lataa uusi tiedosto
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });
    const fileInput = screen.getByLabelText("Select file") as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(screen.getByText(/Selected: document.pdf/i)).toBeInTheDocument();

    // mock data
    mockUploadFile.mockResolvedValue({
      url: "https://upload.com/uploads/document.pdf",
    });

    mockUpdateLink.mockResolvedValue({
      _id: "link-1",
      href: "https://upload.com/uploads/document.pdf",
      isExternal: false,
      isFile: true,
    });

    // lataa + päivitä nappi
    const uploadButton = screen.getByRole("button", {
      name: /Upload & update/i,
    });
    await userEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(file);
      expect(mockUpdateLink).toHaveBeenCalledWith("link-1", {
        href: "https://upload.com/uploads/document.pdf",
        isFile: true,
        isExternal: false,
      });
    });
  });

  // cancel muokkaa linkkiä
  test("admin can cancel editing link", async () => {
    mockGetInstructionLinks.mockReturnValue({
      links: [
        {
          _id: "link-1",
          stepIndex: 0,
          labelEn: "Link",
          href: "https://example.com",
          isExternal: true,
          isFile: false,
        },
      ],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);

    // muokkaa nappi
    const editButton = screen.getByRole("button", { name: /edit link/i });
    await userEvent.click(editButton);

    expect(screen.getByText("Current URL:")).toBeInTheDocument();

    // peruuta muokkaus
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // muokkauslomake ei näy enää
    expect(screen.queryByText("Current URL:")).not.toBeInTheDocument();
  });
});

// virheiden käsittely
describe("Stepper Component - Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("handles visibility fetch error", () => {
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [],
      loading: false,
      error: "Failed to fetch visibility",
    });
    mockGetInstructionLinks.mockReturnValue({
      links: [],
      loading: false,
      error: null,
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });

  test("handles links fetch error", () => {
    mockGetInstructionVisibility.mockReturnValue({
      visibility: [true],
      loading: false,
      error: null,
    });
    mockGetInstructionLinks.mockReturnValue({
      links: [],
      loading: false,
      error: "Failed to fetch links",
    });

    const steps = [{ title: "Step 1", text: <p>Content 1</p> }];

    render(<Stepper steps={steps} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });
});
