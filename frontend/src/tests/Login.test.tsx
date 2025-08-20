import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const mockToast = vi.fn(); // Mock global

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("debe renderizar el formulario de inicio de sesión", () => {
    renderWithRouter(<Login />);
    const form = screen.getByTestId("login-form"); // ← usa data-testid
    expect(form).toBeInTheDocument();
  });

  it("el botón de inicio de sesión debe estar presente", () => {
    renderWithRouter(<Login />);
    const button = screen.getByRole("button", { name: /iniciar sesión/i });
    expect(button).toBeInTheDocument();
  });

  it("debe mostrar inputs de email y contraseña", () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("debe permitir cambiar al modo registro", () => {
    renderWithRouter(<Login />);
    const toggleBtn = screen.getByRole("button", { name: /crear cuenta/i });
    fireEvent.click(toggleBtn);

    // usa solo botón para evitar conflictos con encabezado "Crear cuenta"
    const registerBtn = screen.getAllByRole("button", { name: /crear cuenta/i })[0];
    expect(registerBtn).toBeInTheDocument();

    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
  });

  it("debe mostrar un toast de error si se envía con campos vacíos", () => {
    renderWithRouter(<Login />);
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Error",
        description: expect.stringContaining("Por favor completa todos los campos"),
        variant: "destructive",
      })
    );
  });

  it("debe permitir escribir en los inputs", () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByLabelText(/correo electrónico/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/contraseña/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });

    expect(emailInput.value).toBe("test@mail.com");
    expect(passwordInput.value).toBe("12345678");
  });
});
