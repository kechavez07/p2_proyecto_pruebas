import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import UserProfile from "@/components/UserProfile";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mock PinCard para aislar los tests (puedes remover si prefieres testear PinCard de verdad)
vi.mock("@/components/PinCard", () => ({
  __esModule: true,
  default: ({ title }: any) => <div data-testid="mock-pin-card">{title}</div>,
}));

const baseUser = {
  id: "1",
  name: "Jane Doe",
  username: "janedoe",
  avatar: "avatar.jpg",
  bio: "Biografía de prueba",
  followersCount: 12,
  followingCount: 7,
  pinsCount: 2,
};

const userPins = [
  { id: "1", title: "Pin creado 1", imageUrl: "img1.jpg", description: "desc", authorName: "Jane Doe", authorAvatar: "avatar.jpg" },
  { id: "2", title: "Pin creado 2", imageUrl: "img2.jpg", description: "desc", authorName: "Jane Doe", authorAvatar: "avatar.jpg" },
];

const savedPins = [
  { id: "3", title: "Pin guardado", imageUrl: "img3.jpg", description: "desc", authorName: "Jane Doe", authorAvatar: "avatar.jpg" },
];

describe("UserProfile", () => {
  it("renderiza correctamente el perfil propio y sus datos", () => {
    render(<UserProfile user={baseUser} isOwnProfile userPins={userPins} savedPins={savedPins} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("@janedoe")).toBeInTheDocument();
    expect(screen.getByText("Biografía de prueba")).toBeInTheDocument();
    expect(screen.getByText("Seguidores")).toBeInTheDocument();
    expect(screen.getByText("Siguiendo")).toBeInTheDocument();
    expect(screen.getByText("Pines")).toBeInTheDocument();
    expect(screen.getByText("Editar perfil")).toBeInTheDocument();
    expect(screen.getByText("Creado")).toBeInTheDocument();
    expect(screen.getByText("Guardado")).toBeInTheDocument();
  });

  it("renderiza los pines creados por el usuario en la pestaña 'Creado'", () => {
    render(<UserProfile user={baseUser} isOwnProfile userPins={userPins} savedPins={[]} />);
    // La pestaña "Creado" está activa por defecto
    expect(screen.getByText("Pin creado 1")).toBeInTheDocument();
    expect(screen.getByText("Pin creado 2")).toBeInTheDocument();
    // Buscar solo en el tab activo
    const visiblePanels = screen.getAllByRole("tabpanel").filter(panel => !panel.hasAttribute("hidden"));
    expect(within(visiblePanels[0]).queryByText(/No tienes pines creados/i)).not.toBeInTheDocument();
  });

  it("renderiza mensaje si no hay pines creados", () => {
    render(<UserProfile user={baseUser} isOwnProfile userPins={[]} savedPins={[]} />);
    const visiblePanels = screen.getAllByRole("tabpanel").filter(panel => !panel.hasAttribute("hidden"));
    expect(within(visiblePanels[0]).getByText(/No tienes pines creados/i)).toBeInTheDocument();
  });

  it("renderiza botón de seguir si no es el perfil propio y puede alternar estado", () => {
    render(<UserProfile user={baseUser} isOwnProfile={false} userPins={userPins} savedPins={[]} />);
    const seguirBtn = screen.getByRole("button", { name: "Seguir" });
    expect(seguirBtn).toBeInTheDocument();
    fireEvent.click(seguirBtn);
    expect(screen.getByRole("button", { name: "Siguiendo" })).toBeInTheDocument();
  });
});
