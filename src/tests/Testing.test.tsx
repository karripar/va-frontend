import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import DestinationsPage from "../app/destinations/page";

test("placeholder test for using github actions", () => {
  render(<Home />);
  const linkElement = screen.getByText(/Get started by editing/i);
  expect(linkElement).toBeDefined();
});
