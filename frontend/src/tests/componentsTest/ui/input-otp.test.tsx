// src/tests/componentsTest/ui/input-otp.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ──────────────────────────────────────────────────────────────────────────────
// Mock del paquete 'input-otp' para controlar el DOM y el contexto
// ──────────────────────────────────────────────────────────────────────────────
vi.mock('input-otp', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactMock: typeof import('react') = require('react')

  const OTPInputContext = ReactMock.createContext<{ slots: any[] }>({ slots: [] })

  const OTPInput = ReactMock.forwardRef<HTMLDivElement, any>(
    ({ containerClassName, className, ...props }, ref) => (
      <div ref={ref} data-testid="otp-container" className={containerClassName}>
        <div data-testid="otp-input" className={className} {...props} />
      </div>
    )
  )

  return { __esModule: true, OTPInput, OTPInputContext }
})

// Importamos nuestros wrappers reales
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

// Importamos el mismo contexto desde el mock
import { OTPInputContext } from 'input-otp'

describe('InputOTP (shadcn wrapper)', () => {
  it('renderiza InputOTP con clases base y clases extra en container e input', () => {
    render(
      <InputOTP
        containerClassName="c-container"
        className="c-input"
        disabled
        data-x="ok"
      />
    )

    const container = screen.getByTestId('otp-container')
    const inner = screen.getByTestId('otp-input')

    expect(container.className).toMatch(/flex/)
    expect(container.className).toMatch(/items-center/)
    expect(container.className).toMatch(/gap-2/)
    expect(container.className).toMatch(/c-container/)

    expect(inner.className).toMatch(/disabled:cursor-not-allowed/)
    expect(inner.className).toMatch(/c-input/)

    expect(inner).toHaveAttribute('data-x', 'ok')
    expect(inner).toHaveAttribute('disabled')
  })

  it('InputOTPGroup añade clases y renderiza children', () => {
    render(
      <InputOTPGroup className="g-extra">
        <span>child</span>
      </InputOTPGroup>
    )
    const group = screen.getByText('child').parentElement as HTMLElement
    expect(group.className).toMatch(/flex/)
    expect(group.className).toMatch(/items-center/)
    expect(group.className).toMatch(/g-extra/)
  })

  it('InputOTPSlot muestra el char, el caret y clases de foco cuando isActive', () => {
    const ctxValue = {
      slots: [{ char: '5', hasFakeCaret: true, isActive: true }],
    }

    render(
      <OTPInputContext.Provider value={ctxValue}>
        <InputOTPSlot index={0} />
      </OTPInputContext.Provider>
    )

    // el propio elemento del slot contiene el texto
    const slotEl = screen.getByText('5') as HTMLElement

    // caret falso visible
    expect(slotEl.querySelector('.animate-caret-blink')).toBeTruthy()

    // clases de foco cuando isActive
    expect(slotEl.className).toMatch(/ring-2/)
    expect(slotEl.className).toMatch(/ring-ring/)
  })

  it('InputOTPSlot respeta className extra y no muestra caret ni ring si no está activo', () => {
    const ctxValue = {
      slots: [{ char: 'A', hasFakeCaret: false, isActive: false }],
    }

    render(
      <OTPInputContext.Provider value={ctxValue}>
        <InputOTPSlot index={0} className="slot-extra" />
      </OTPInputContext.Provider>
    )

    const slotEl = screen.getByText('A') as HTMLElement
    expect(slotEl.className).toMatch(/slot-extra/)
    expect(slotEl.querySelector('.animate-caret-blink')).toBeFalsy()
    expect(slotEl.className).not.toMatch(/ring-2/)
  })

  it('InputOTPSeparator tiene role="separator" y un svg (icono Dot)', () => {
    render(<InputOTPSeparator />)
    const sep = screen.getByRole('separator')
    expect(sep).toBeInTheDocument()
    expect(sep.querySelector('svg')).toBeTruthy()
  })

  // ────────────────────────────────────────────────────────────────────────────
  // Nuevos tests
  // ────────────────────────────────────────────────────────────────────────────
  it('InputOTPSlot muestra correctamente varios slots', () => {
    const ctxValue = {
      slots: [
        { char: '1', hasFakeCaret: false, isActive: false },
        { char: '2', hasFakeCaret: true, isActive: true },
        { char: '', hasFakeCaret: false, isActive: false },
      ],
    }

    render(
      <OTPInputContext.Provider value={ctxValue}>
        <div data-testid="s0"><InputOTPSlot index={0} /></div>
        <div data-testid="s1"><InputOTPSlot index={1} /></div>
        <div data-testid="s2"><InputOTPSlot index={2} /></div>
      </OTPInputContext.Provider>
    )

    // slots con contenido
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    // slot activo (#1) con caret y ring
    const s1 = screen.getByTestId('s1').querySelector('div') as HTMLElement
    expect(s1.querySelector('.animate-caret-blink')).toBeTruthy()
    expect(s1.className).toMatch(/ring-2/)

    // slot vacío (#2) sin caret ni ring
    const s2 = screen.getByTestId('s2').querySelector('div') as HTMLElement
    expect(s2.querySelector('.animate-caret-blink')).toBeFalsy()
    expect(s2.className).not.toMatch(/ring-2/)
  })

  it('InputOTPGroup acepta ref y props extra', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <InputOTPGroup ref={ref} data-test="group-test">
        <span>child</span>
      </InputOTPGroup>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-test', 'group-test')
  })

  it('InputOTPSeparator acepta ref y props extra', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<InputOTPSeparator ref={ref} data-test="sep-test" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-test', 'sep-test')
  })

  it('InputOTP pasa correctamente el ref al contenedor', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<InputOTP ref={ref} containerClassName="test-ref" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.className).toMatch(/test-ref/)
  })

  it('InputOTPSlot acepta y pasa props extra', () => {
    const ctxValue = {
      slots: [{ char: 'Z', hasFakeCaret: false, isActive: false }],
    }
    render(
      <OTPInputContext.Provider value={ctxValue}>
        <InputOTPSlot index={0} data-test="slot-test" />
      </OTPInputContext.Provider>
    )
    const slotEl = screen.getByText('Z') as HTMLElement
    expect(slotEl).toHaveAttribute('data-test', 'slot-test')
  })
})
