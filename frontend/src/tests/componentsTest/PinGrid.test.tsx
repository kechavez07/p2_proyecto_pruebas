import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PinGrid from "@/components/PinGrid";

// Mock del PinCard para aislar la prueba y facilitar asserts
vi.mock("@/components/PinCard", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="pin-card">
      <span>{props.title}</span>
      <span>{props.author?.name}</span>
    </div>
  ),
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PinGrid Component", () => {
  it("muestra el grid vacío inicialmente", () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<PinGrid />);
    // Grid renderiza pero no hay tarjetas
    expect(screen.queryAllByTestId("pin-card")).toHaveLength(0);
  });

  it("renderiza los pines traídos de la API", async () => {
    const pins = [
      {
        id: "1",
        imageUrl: "img1.jpg",
        title: "Pin 1",
        description: "Desc 1",
        authorName: "User 1",
        authorAvatar: "ava1.jpg",
      },
      {
        id: "2",
        imageUrl: "img2.jpg",
        title: "Pin 2",
        description: "Desc 2",
        authorName: "User 2",
        authorAvatar: "ava2.jpg",
      },
    ];
    mockFetch.mockResolvedValueOnce({
      json: async () => pins,
    });

    render(<PinGrid />);

    // Espera a que los pins se rendericen
    await waitFor(() => {
      expect(screen.getAllByTestId("pin-card")).toHaveLength(2);
    });

    // Verifica contenido de cada tarjeta mockeada
    expect(screen.getByText("Pin 1")).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("Pin 2")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
  });

  it("llama al endpoint correcto de la API", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<PinGrid />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("https://proyecto-pruebas-api.onrender.com/api/pins/getPins");
    });
  });
});
