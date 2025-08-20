// src/setupTests.ts
import '@testing-library/jest-dom'
import 'whatwg-fetch' // fetch en JSDOM

// matchMedia (algunos componentes lo usan)
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
