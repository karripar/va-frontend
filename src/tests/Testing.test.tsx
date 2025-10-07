import { render, screen } from "@testing-library/react";
import Home from "../app/page";

test("placeholder test for using github actions", () => {
  render(<Home />);
  const linkElement = screen.getByText(/Tervetuloa Metropolian/i);
  expect(linkElement).toBeDefined();
});
