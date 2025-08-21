// src/tests/Index.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'

// ───────────────────────────────────────────────────────────────
// 1) Fuerza sesión (por si tu guard lee localStorage)
beforeEach(() => {
  localStorage.setItem('token', 'fake-token')
})
afterEach(() => {
  localStorage.clear()
})

// 2) MOCKS DE AUTH (ponemos varias rutas "virtuales":
//    si tu Index importa cualquiera de ellas, quedará autenticado)
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: 'u1', name: 'Jane' },
  }),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: 'u1', name: 'Jane' },
  }),
  useSession: () => ({ user: { id: 'u1' } }),
}))

vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    isLoggedIn: true,
    user: { id: 'u1', name: 'Jane' },
  }),
}))

// 3) MOCKS DE HIJOS (rutas DEBEN coincidir con como las importa Index)
vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">HeaderMock</header>,
}))
vi.mock('@/components/UploadModal', () => ({
  default: () => <div data-testid="upload-modal">UploadModalMock</div>,
}))
vi.mock('@/components/PinGrid', () => ({
  default: () => <section data-testid="pin-grid">PinGridMock</section>,
}))

// 4) helper Router
const renderWithRouter = (ui: React.ReactElement) =>
  render(<BrowserRouter>{ui}</BrowserRouter>)

// ───────────────────────────────────────────────────────────────
// IMPORTA Index *DESPUÉS* de definir los mocks
describe('Index Page', () => {
  it('renderiza Header, UploadModal y PinGrid correctamente', async () => {
    const { default: Index } = await import('@/pages/Index') // import diferido para respetar mocks

    renderWithRouter(<Index />)

    expect(await screen.findByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('upload-modal')).toBeInTheDocument()
    expect(screen.getByTestId('pin-grid')).toBeInTheDocument()

    // (opcional) valida algunas clases del layout
    expect(document.body.innerHTML).toMatch(/min-h-screen/)
    expect(document.body.innerHTML).toMatch(/container mx-auto/)
  })
})

