// src/__tests__/main.dom-init.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock de react-dom/client para espiar createRoot/render
const renderSpy = vi.fn()
const createRootSpy = vi.fn(() => ({ render: renderSpy }))

vi.mock('react-dom/client', () => ({
  createRoot: createRootSpy,
}))

// Mockea el CSS global para evitar bloqueos
vi.mock('@/index.css', () => ({}), { virtual: true })

describe('main.tsx boot', () => {
  let root: HTMLDivElement

  beforeEach(() => {
    root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('usa createRoot sobre #root y llama a render una vez', async () => {
    await import('@/main') // ejecuta el boot

    expect(createRootSpy).toHaveBeenCalledTimes(1)
    expect(createRootSpy).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderSpy).toHaveBeenCalledTimes(1)
    // Si quieres comprobar que render recibe algún elemento React:
    expect(renderSpy.mock.calls[0]?.[0]).toBeTruthy()
  })
})
