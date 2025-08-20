import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import Profile from "@/pages/Profile";
import { BrowserRouter } from "react-router-dom";

// Utilidad para renderizar con router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Mock de fetch
const mockFetch = vi.fn();

// Setup
beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  // 👇 Siempre devolver una promesa (aunque vacía) para evitar el error
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });

  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => "fake-token"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});

// Cleanup
afterEach(() => {
  vi.restoreAllMocks();
});

describe("Profile Component", () => {
  it("muestra mensaje de carga inicialmente", () => {
    renderWithRouter(<Profile />);
    expect(screen.getByText(/cargando perfil/i)).toBeInTheDocument();
  });

  it("muestra error si no hay token", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null), // no hay token
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    renderWithRouter(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/no hay sesión activa/i)).toBeInTheDocument();
    });
  });

  it("muestra error si no se puede obtener el perfil", async () => {
    mockFetch.mockRejectedValueOnce(new Error("fail"));

    renderWithRouter(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/error al obtener el perfil/i)).toBeInTheDocument();
    });
  });

  it("renderiza correctamente con datos válidos", async () => {
    // 1. Mock para perfil
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 1,
          username: "john_doe",
          avatar: "avatar.png",
          bio: "Bio test",
          followersCount: 10,
          followingCount: 5,
          pinsCount: 3,
        },
      }),
    });

    // 2. Mock para pins creados
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: "Pin 1" }],
    });

    // 3. Mock para pins guardados
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 2, title: "Saved Pin" }],
    });

    renderWithRouter(<Profile />);

    // Esperar cualquier texto del perfil
    await waitFor(() => {
      expect(screen.getAllByText(/john_doe/i).length).toBeGreaterThanOrEqual(1);
    });
  });
});
