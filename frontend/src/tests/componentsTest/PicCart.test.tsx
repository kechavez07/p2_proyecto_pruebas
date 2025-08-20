import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import PinCard from "@/components/PinCard";

// Mock Button y Avatar para aislar la prueba (opcional, puedes omitir si no lo deseas)
vi.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));
vi.mock("@/components/ui/avatar", () => ({
  Avatar: (props: any) => <div data-testid="avatar">{props.children}</div>,
  AvatarImage: (props: any) => <img data-testid="avatar-image" {...props} />,
  AvatarFallback: (props: any) => <span data-testid="avatar-fallback">{props.children}</span>,
}));
vi.mock("lucide-react", () => ({
  Heart: () => <svg data-testid="icon-heart" />,
  Share2: () => <svg data-testid="icon-share" />,
  MoreHorizontal: () => <svg data-testid="icon-more" />,
  Bookmark: () => <svg data-testid="icon-bookmark" />,
}));

const mockFetch = vi.fn();
const mockSetItem = vi.fn();
const mockGetItem = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubGlobal("localStorage", {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PinCard Component", () => {
  const defaultProps = {
    id: "pin123",
    imageUrl: "https://test.com/image.jpg",
    title: "Test Pin Title",
    description: "A test pin description",
    author: {
      name: "Alice",
      avatar: "https://test.com/avatar.jpg",
    },
    saved: false,
  };

  it("renderiza los datos principales", () => {
    render(<PinCard {...defaultProps} />);
    expect(screen.getByText(/test pin title/i)).toBeInTheDocument();
    expect(screen.getByAltText(/test pin title/i)).toHaveAttribute("src", defaultProps.imageUrl);
    expect(screen.getByText(/a test pin description/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByTestId("avatar-image")).toHaveAttribute("src", defaultProps.author.avatar);
    expect(screen.getByTestId("avatar-fallback")).toHaveTextContent("A");
  });

  it("muestra el botón Guardar al hacer hover", () => {
    render(<PinCard {...defaultProps} />);
    // Al principio no debe estar el botón Guardar
    expect(screen.queryByText(/guardar/i)).not.toBeInTheDocument();

    // Simula hover
    fireEvent.mouseEnter(screen.getByAltText(/test pin title/i));
    expect(screen.getByText(/guardar/i)).toBeInTheDocument();

    // Sale de hover
    fireEvent.mouseLeave(screen.getByAltText(/test pin title/i));
    expect(screen.queryByText(/guardar/i)).not.toBeInTheDocument();
  });

  it("muestra 'Guardado' y desactiva el botón cuando ya está guardado", () => {
    render(<PinCard {...defaultProps} saved={true} />);
    fireEvent.mouseEnter(screen.getByAltText(/test pin title/i));
    expect(screen.getByText(/guardado/i)).toBeDisabled();
  });

  it("al hacer clic en Guardar, llama a fetch y muestra 'Guardado'", async () => {
    mockGetItem.mockReturnValueOnce(JSON.stringify({ id: "user-abc" })); // simula usuario logueado
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<PinCard {...defaultProps} />);
    fireEvent.mouseEnter(screen.getByAltText(/test pin title/i));

    const saveButton = screen.getByText(/guardar/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/pins/savePin",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({ "Content-Type": "application/json" }),
          body: JSON.stringify({ userId: "user-abc", pinId: "pin123" }),
        })
      );
      expect(screen.getByText(/guardado/i)).toBeInTheDocument();
      expect(screen.getByText(/guardado/i)).toBeDisabled();
    });
  });

  it("no llama a fetch si no hay usuario logueado", () => {
    mockGetItem.mockReturnValueOnce("{}"); // usuario vacío

    render(<PinCard {...defaultProps} />);
    fireEvent.mouseEnter(screen.getByAltText(/test pin title/i));
    const saveButton = screen.getByText(/guardar/i);
    fireEvent.click(saveButton);

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
