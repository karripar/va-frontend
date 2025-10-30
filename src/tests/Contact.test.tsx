import { render, screen, fireEvent } from "@testing-library/react";
import ContactPage from "../app/contact/page";

describe("ContactPage", () => {
  test("renders heading and description", () => {
    render(<ContactPage />);
    expect(screen.getByText(/Ota yhteyttä/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Onko sinulla kysyttävää/i)
    ).toBeInTheDocument();
  });

  test("renders contact form initially", () => {
    render(<ContactPage />);
    expect(screen.getByLabelText(/Nimi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sähköposti/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aihe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Viesti/i)).toBeInTheDocument();
  });

  test("submits the form and shows success component", () => {
    render(<ContactPage />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Nimi/i), { target: { value: "Karri" } });
    fireEvent.change(screen.getByLabelText(/Sähköposti/i), { target: { value: "karri@example.com" } });
    fireEvent.change(screen.getByLabelText(/Aihe/i), { target: { value: "Kysymys" } });
    fireEvent.change(screen.getByLabelText(/Viesti/i), { target: { value: "Testiviesti" } });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Lähetä viesti/i }));

    // Success component appears
    expect(screen.getByText(/Kiitos yhteydenotostasi/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Nimi/i)).not.toBeInTheDocument();
  });
});
