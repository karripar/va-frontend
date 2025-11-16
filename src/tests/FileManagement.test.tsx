import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, beforeEach, expect } from "vitest";
import React from "react";

interface Document {
  filename: string;
  url: string;
  media_type: string;
  filesize: number;
  uploadedAt: string;
}

const mockDeleteDocument = vi.fn();
const mockFetchDocuments = vi.fn();
const mockUseDocuments = vi.fn();

mockUseDocuments.mockReturnValue({
  documents: [],
  loading: false,
  error: null,
  deleteDocument: mockDeleteDocument,
  fetchDocuments: mockFetchDocuments,
});

// Mock useDocuments hook
vi.mock("@/hooks/useDocuments", () => ({
  useDocuments: () => mockUseDocuments(),
}));

const setMockDocuments = (
  documents: Document[],
  error: string | null = null,
  loading: boolean = false
) => {
  mockUseDocuments.mockReturnValue({
    documents,
    loading,
    error,
    deleteDocument: mockDeleteDocument,
    fetchDocuments: mockFetchDocuments,
  } as unknown as ReturnType<typeof mockUseDocuments>);
};

// Mock useAuth for admin check
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      id: 1,
      name: "Admin User",
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

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import DocumentManagement from "@/app/admin/fileManagement/page";

// komponentin renderöinti
describe("DocumentManagement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders document management page title", () => {
    setMockDocuments([]);

    render(<DocumentManagement />);

    expect(screen.getByText("Document Management")).toBeInTheDocument();
    expect(screen.getByLabelText("Back to Admin Panel")).toBeInTheDocument();
  });

  // ei dokumentteja ladattu
  test("displays no documents message when list is empty", () => {
    setMockDocuments([]);

    render(<DocumentManagement />);

    expect(screen.getByText("No documents uploaded")).toBeInTheDocument();
  });

  // dokumenttilistaus näkyy adminille
  test("renders list of uploaded documents", () => {
    setMockDocuments([
      {
        filename: "document1.pdf",
        url: "http://localhost:3003/uploads/document1.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
      {
        filename: "document2.pptx",
        url: "http://localhost:3003/uploads/document2.pptx",
        media_type:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filesize: 2048,
        uploadedAt: "2025-01-14T09:00:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    expect(screen.getByText("document1.pdf")).toBeInTheDocument();
    expect(screen.getByText("document2.pptx")).toBeInTheDocument();

    expect(screen.getByText("Filename")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  // dokumenttilinkit toimivat ja avautuvat uudessa välilehdessä
  test("document links are clickable and open in new tab", () => {
    setMockDocuments([
      {
        filename: "test.pdf",
        url: "http://localhost:3003/uploads/test.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    const link = screen.getByText("test.pdf").closest("a");
    expect(link).toHaveAttribute(
      "href",
      "http://localhost:3003/uploads/test.pdf"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  // uploadaus päivämäärä ja aika näkyvät
  test("displays upload date and time correctly", () => {
    setMockDocuments([
      {
        filename: "document.pdf",
        url: "http://localhost:3003/uploads/document.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    expect(screen.getByText(/15.01.2025/i)).toBeInTheDocument();
    expect(screen.getByText(/at:/i)).toBeInTheDocument();
  });

  // dokumentin poisto
  test("opens delete confirmation modal when delete button clicked", async () => {
    setMockDocuments([
      {
        filename: "document.pdf",
        url: "http://localhost:3003/uploads/document.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    const deleteButton = screen.getByLabelText("Delete document.pdf");
    await userEvent.click(deleteButton);

    // vahvistusmodaali
    expect(
      screen.getByText("Are you sure you want to delete:")
    ).toBeInTheDocument();
    expect(screen.getByText("Yes, delete")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  // poista dokumentti voi perua
  test("closes delete confirmation modal when cancel clicked", async () => {
    setMockDocuments([
      {
        filename: "document.pdf",
        url: "http://localhost:3003/uploads/document.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    const deleteButton = screen.getByLabelText("Delete document.pdf");
    await userEvent.click(deleteButton);

    expect(
      screen.getByText("Are you sure you want to delete:")
    ).toBeInTheDocument();

    // peruuta nappi
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    // modal sulkeutuu
    expect(
      screen.queryByText("Are you sure you want to delete:")
    ).not.toBeInTheDocument();
  });

  // dokumentin poisto toimii admineille
  test("deletes document when confirmed", async () => {
    setMockDocuments([
      {
        filename: "document.pdf",
        url: "http://localhost:3003/uploads/document.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);
    mockDeleteDocument.mockResolvedValue(true);

    render(<DocumentManagement />);

    const deleteButton = screen.getByLabelText("Delete document.pdf");
    await userEvent.click(deleteButton);

    // vahvista poisto
    const confirmButton = screen.getByText("Yes, delete");
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteDocument).toHaveBeenCalledWith("document.pdf");
    });
  });

  // virheiden käsittely
  test("displays error message when delete fails", async () => {
    setMockDocuments([
      {
        filename: "document.pdf",
        url: "http://localhost:3003/uploads/document.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
    ]);
    mockDeleteDocument.mockResolvedValue(false);

    render(<DocumentManagement />);

    const deleteButton = screen.getByLabelText("Delete document.pdf");
    await userEvent.click(deleteButton);

    // vahvista poisto
    const confirmButton = screen.getByText("Yes, delete");
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Error deleting file")).toBeInTheDocument();
    });
  });

  // useampi dokumentti näkyy
  test("renders multiple documents correctly", () => {
    setMockDocuments([
      {
        filename: "doc1.pdf",
        url: "http://localhost:3003/uploads/doc1.pdf",
        media_type: "application/pdf",
        filesize: 1024,
        uploadedAt: "2025-01-15T10:30:00.000Z",
      },
      {
        filename: "doc2.docx",
        url: "http://localhost:3003/uploads/doc2.docx",
        media_type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filesize: 2048,
        uploadedAt: "2025-01-14T09:00:00.000Z",
      },
      {
        filename: "doc3.pptx",
        url: "http://localhost:3003/uploads/doc3.pptx",
        media_type:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filesize: 3072,
        uploadedAt: "2025-01-13T09:30:00.000Z",
      },
    ]);

    render(<DocumentManagement />);

    expect(screen.getByText("doc1.pdf")).toBeInTheDocument();
    expect(screen.getByText("doc2.docx")).toBeInTheDocument();
    expect(screen.getByText("doc3.pptx")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", {
      name: /Delete doc/i,
    });
    expect(deleteButtons).toHaveLength(3);
  });
});

// virheiden käsittely
describe("DocumentManagement - Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays error message when fetch fails", () => {
    setMockDocuments([], "Failed to load documents");

    render(<DocumentManagement />);

    expect(screen.getByText("Failed to load documents")).toBeInTheDocument();
  });
});

describe("DocumentManagement - Admin Access", () => {
  test("admin can access document management page", () => {
    setMockDocuments([]);

    render(<DocumentManagement />);

    expect(screen.getByText("Document Management")).toBeInTheDocument();
  });

  test("displays back to admin panel link", () => {
    setMockDocuments([]);

    render(<DocumentManagement />);

    const backLink = screen.getByLabelText("Back to Admin Panel");
    expect(backLink).toHaveAttribute("href", "/admin");
  });
});
