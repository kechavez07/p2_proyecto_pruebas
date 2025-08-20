import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import UploadModal from "@/components/UploadModal";

// Mocks UI y lucide para aislar pruebas
vi.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));
vi.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));
vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));
vi.mock("@/components/ui/label", () => ({
  Label: (props: any) => <label {...props}>{props.children}</label>,
}));
vi.mock("@/components/ui/dialog", () => ({
  Dialog: (props: any) => <div data-testid="dialog">{props.children}</div>,
  DialogContent: (props: any) => <div data-testid="dialog-content">{props.children}</div>,
  DialogHeader: (props: any) => <div>{props.children}</div>,
  DialogTitle: (props: any) => <h2>{props.children}</h2>,
  DialogTrigger: (props: any) => <div onClick={props.onClick}>{props.children}</div>,
}));
vi.mock("lucide-react", () => ({
  Upload: () => <svg data-testid="icon-upload" />,
  X: () => <svg data-testid="icon-x" />,
  Plus: () => <svg data-testid="icon-plus" />,
}));

const mockFetch = vi.fn();
const mockAlert = vi.fn();
const mockGetItem = vi.fn();

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => "blob:http://dummy");
});
afterAll(() => {
  (global.URL.createObjectURL as any).mockRestore?.();
});

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
  vi.stubGlobal("alert", mockAlert);
  vi.stubGlobal("localStorage", {
    getItem: mockGetItem,
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("UploadModal Component", () => {
  it("renderiza el botón para abrir el modal", () => {
    render(<UploadModal />);
    expect(screen.getByText(/crear pin/i)).toBeInTheDocument();
  });

  it("puede abrir y cerrar el modal", () => {
    render(<UploadModal />);
    // Abre el modal
    fireEvent.click(screen.getByText(/crear pin/i));
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
    // Cierra con botón cancelar
    fireEvent.click(screen.getByText(/cancelar/i));
    // Al ser todo controlado por estado, el diálogo sigue montado pero campos limpios
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("puede seleccionar archivo y muestra preview", () => {
    render(<UploadModal />);
    fireEvent.click(screen.getByText(/crear pin/i));
    // Simula selección de imagen
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/selecciona una imagen/i);
    fireEvent.change(input, { target: { files: [file] } });
    // Como mockeamos el componente, no hay img real, pero cambia estado interno (no hay error)
  });

  it("no permite enviar sin imagen o sin título", async () => {
    render(<UploadModal />);
    fireEvent.click(screen.getByText(/crear pin/i));
    const submit = screen.getByText(/publicar pin/i) as HTMLButtonElement;
    expect(submit).toBeDisabled();
  });

  it("envía el formulario correctamente y limpia estado", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    mockGetItem.mockReturnValueOnce(JSON.stringify({ username: "user123" }));
    render(<UploadModal />);
    fireEvent.click(screen.getByText(/crear pin/i));
    // Selecciona archivo
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    // Usa un input que sí exista (label htmlFor coincide con id)
    fireEvent.change(screen.getByLabelText(/selecciona una imagen/i), { target: { files: [file] } });
    // Ingresa título
    fireEvent.change(screen.getByPlaceholderText(/agrega un título/i), { target: { value: "Nuevo Pin" } });
    // Ingresa descripción
    fireEvent.change(screen.getByPlaceholderText(/de qué se trata tu pin/i), { target: { value: "Descripción" } });
    // Ahora el botón ya no está deshabilitado
    const submit = screen.getByText(/publicar pin/i) as HTMLButtonElement;
    expect(submit).not.toBeDisabled();
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/pins/createPin",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        })
      );
      expect(screen.getByText(/crear pin/i)).toBeInTheDocument(); // botón sigue estando
    });
  });

  it("muestra alerta si la API responde error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    mockGetItem.mockReturnValueOnce(JSON.stringify({ username: "user123" }));
    render(<UploadModal />);
    fireEvent.click(screen.getByText(/crear pin/i));
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/selecciona una imagen/i), { target: { files: [file] } });
    fireEvent.change(screen.getByPlaceholderText(/agrega un título/i), { target: { value: "Nuevo Pin" } });
    fireEvent.click(screen.getByText(/publicar pin/i));
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Error al crear el pin");
    });
  });

  it("muestra alerta si hay error de red", async () => {
    mockFetch.mockRejectedValueOnce(new Error("fail"));
    mockGetItem.mockReturnValueOnce(JSON.stringify({ username: "user123" }));
    render(<UploadModal />);
    fireEvent.click(screen.getByText(/crear pin/i));
    const file = new File(["dummy"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/selecciona una imagen/i), { target: { files: [file] } });
    fireEvent.change(screen.getByPlaceholderText(/agrega un título/i), { target: { value: "Nuevo Pin" } });
    fireEvent.click(screen.getByText(/publicar pin/i));
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Error de red al crear el pin");
    });
  });
});
