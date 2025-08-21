// src/setupTests.ts
import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { vi } from 'vitest'

// Shim de compatibilidad para librerías que esperan "jest"
;(globalThis as any).jest = vi

;(globalThis as any).ResizeObserver ??= class {
  observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn()
}
// DOMRect (para algunos layouts)
;(globalThis as any).DOMRect ??= {
  fromRect: (r: any) => r,
} as any
// matchMedia (algun
// os componentes lo usan)
if (!('matchMedia' in window)) {
  // @ts-ignore
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},     // deprecated
    removeListener: () => {},  // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// IntersectionObserver stub
if (!('IntersectionObserver' in window)) {
  // @ts-ignore
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
    root = null
    rootMargin = ''
    thresholds = []
  }
}
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    dispatchEvent: jest.fn(),
  }),
});
