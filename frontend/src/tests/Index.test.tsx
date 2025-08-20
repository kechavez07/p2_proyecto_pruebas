import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/pages/Index";
import { BrowserRouter } from "react-router-dom";

// Mocks de componentes hijos
vi.mock("@/components/Header", () => ({
  default: () => <header data-testid="header">HeaderMock</header>,
}));
vi.mock("@/components/UploadModal", () => ({
  default: () => <div data-testid="upload-modal">UploadModalMock</div>,
}));
vi.mock("@/components/PinGrid", () => ({
  default: () => <section data-testid="pin-grid">PinGridMock</section>,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Index Page", () => {
  it("renderiza Header, UploadModal y PinGrid correctamente", () => {
    renderWithRouter(<Index />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("upload-modal")).toBeInTheDocument();
    expect(screen.getByTestId("pin-grid")).toBeInTheDocument();

    // Opcional: Verifica el layout principal
    expect(document.body.innerHTML).toMatch(/min-h-screen/);
    expect(document.body.innerHTML).toMatch(/container mx-auto/);
  });
});
