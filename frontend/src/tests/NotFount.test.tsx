import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";

describe("NotFound Component", () => {
  // Espía de console.error
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  it("debe renderizar el mensaje 404", () => {
    render(
      <MemoryRouter initialEntries={["/ruta-no-existe"]}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to home/i })).toBeInTheDocument();
  });

  it("debe registrar el error 404 en consola", () => {
    render(
      <MemoryRouter initialEntries={["/ruta-fake"]}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/ruta-fake"
    );
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
});
