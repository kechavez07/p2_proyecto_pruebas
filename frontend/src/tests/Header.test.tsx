// src/tests/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ───────────────────────────────────────────────────────────────
// 1) Prepara localStorage (para comprobar que el logout lo limpia)
beforeEach(() => {
  localStorage.setItem('token', 'fake-token')
  localStorage.setItem('user', JSON.stringify({ id: 'u1', name: 'Jane' }))
})
afterEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.resetModules()
})

// 2) Mock de react-router-dom SOLO para useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// 3) Render helper con BrowserRouter real
const renderWithRouter = async (ui: React.ReactElement) => {
  const { BrowserRouter } = await import('react-router-dom')
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Header', () => {
  it('renderiza logo, navegación y buscador', async () => {
    const { default: Header } = await import('@/components/Header')

    await renderWithRouter(<Header />)

    // Logo → link a /home
    const logo = screen.getByRole('link', { name: /pinboard/i })
    expect(logo).toHaveAttribute('href', '/home')

    // Nav: Inicio y Perfil
    const inicio = screen.getByRole('link', { name: /inicio/i })
    expect(inicio).toHaveAttribute('href', '/home')

    const perfil = screen.getByRole('link', { name: /perfil/i })
    expect(perfil).toHaveAttribute('href', '/profile')

    // Buscador
    expect(screen.getByPlaceholderText('Buscar ideas...')).toBeInTheDocument()

    // (opcional) avatar link a /profile existe en el DOM
    const avatarLink = document.querySelector('a[href="/profile"]')
    expect(avatarLink).toBeTruthy()
  })

  it('al hacer click en "Salir" limpia el storage y navega a "/"', async () => {
    const { default: Header } = await import('@/components/Header')

    await renderWithRouter(<Header />)

    // Aseguramos que había valores antes
    expect(localStorage.getItem('token')).toBe('fake-token')
    expect(localStorage.getItem('user')).not.toBeNull()

    // Click en Salir
    const salirBtn = screen.getByRole('button', { name: /salir/i })
    fireEvent.click(salirBtn)

    // Se borran token y user
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()

    // Navega a raíz
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
