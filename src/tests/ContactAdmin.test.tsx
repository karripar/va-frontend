import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest"; // vi for mocking, create fake components etc.
import AdminContactPage from "../app/admin/contact-messages/page";

// Mock window.alert to prevent actual popups
window.alert = vi.fn();

describe("AdminContactPage", () => {
  test("renders heading and loading state initially", () => {
    render(<AdminContactPage />);
    expect(screen.getByText(/Yhteydenottojen hallinta/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
  });

  test("loads messages and allows selecting one", async () => {
    render(<AdminContactPage />);

    // Wait for mock messages to appear (setTimeout 500ms in useEffect)
    await waitFor(() => {
      expect(screen.getByText(/Matti Meikäläinen/i)).toBeInTheDocument();
    });

    // Click on first message
    const firstMsg = screen.getByText(/Vaihto-ohjelman hakeminen/i);
    fireEvent.click(firstMsg);

    // Right column shows message details
    const messageDetails = screen.getAllByText(
      /Hei, haluaisin tietää lisää hakuprosessista/i
    )[1]; // pick the second one (details panel)

    expect(messageDetails).toBeInTheDocument();

    expect(screen.getByLabelText(/Kirjoita vastaus/i)).toBeInTheDocument();
  });

  test("filters messages based on input", async () => {
    render(<AdminContactPage />);

    await waitFor(() => {
      expect(screen.getByText(/Matti Meikäläinen/i)).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText(
      /Hae nimen, sähköpostin tai aiheen perusteella/i
    );
    fireEvent.change(filterInput, { target: { value: "Anna" } });

    expect(screen.queryByText(/Matti Meikäläinen/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Anna Virtanen/i)).toBeInTheDocument();
  });

  test("sends a reply to selected message", async () => {
    render(<AdminContactPage />);

    await waitFor(() => {
      expect(screen.getByText(/Matti Meikäläinen/i)).toBeInTheDocument();
    });

    const firstMsg = screen.getByText(/Vaihto-ohjelman hakeminen/i);
    fireEvent.click(firstMsg);

    const replyTextarea = screen.getByLabelText(/Kirjoita vastaus/i);
    fireEvent.change(replyTextarea, {
      target: { value: "Kiitos viestistäsi!" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Lähetä vastaus/i,
    });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Reply sent to matti@example.com: Kiitos viestistäsi!"
    );
  });
});
