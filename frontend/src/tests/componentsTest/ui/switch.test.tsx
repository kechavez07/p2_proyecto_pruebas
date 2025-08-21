import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import { Switch } from '@/components/ui/switch'

const getSwitch = () => screen.getByRole('switch')

describe('Switch (shadcn/radix wrapper)', () => {
  it('renderiza con clases base, acepta className extra y props custom', () => {
    render(<Switch className="extra-class" data-test="ok" />)

    const sw = getSwitch()
    expect(sw).toBeInTheDocument()

    // Clases base relevantes + la extra
    expect(sw.className).toMatch(/inline-flex/)
    expect(sw.className).toMatch(/rounded-full/)
    expect(sw.className).toMatch(/focus-visible:ring-2/)
    expect(sw.className).toMatch(/data-\[state=checked\]:bg-primary/)
    expect(sw.className).toMatch(/extra-class/)

    // Prop extra llega al nodo raíz
    expect(sw).toHaveAttribute('data-test', 'ok')

    // Thumb presente y con clase base
    const thumb = sw.querySelector('*') as HTMLElement
    expect(thumb).toBeTruthy()
    expect(thumb.className).toMatch(/rounded-full/)
  })

  it('por defecto está unchecked (aria-checked=false, data-state="unchecked") y alterna con click', () => {
    render(<Switch />)

    const sw = getSwitch()
    // estado inicial
    expect(sw).toHaveAttribute('aria-checked', 'false')
    expect(sw).toHaveAttribute('data-state', 'unchecked')

    // click → checked
    fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(sw).toHaveAttribute('data-state', 'checked')

    // click de nuevo → unchecked
    fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'false')
    expect(sw).toHaveAttribute('data-state', 'unchecked')
  })

  it('respeta defaultChecked para estado inicial', () => {
    render(<Switch defaultChecked />)
    const sw = getSwitch()
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(sw).toHaveAttribute('data-state', 'checked')
  })

  it('disabled: no alterna al hacer click', () => {
    render(<Switch disabled />)

    const sw = getSwitch()
    // Radix debe marcar disabled y dejarlo en unchecked
    expect(sw).toHaveAttribute('disabled')
    expect(sw).toHaveAttribute('aria-checked', 'false')

    fireEvent.click(sw)
    // Sigue igual
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('llama onCheckedChange con el valor nuevo', () => {
    const onChange = vi.fn()
    render(<Switch onCheckedChange={onChange} />)

    const sw = getSwitch()
    fireEvent.click(sw)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)

    fireEvent.click(sw)
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith(false)
  })

  it('reenvía correctamente el ref al botón raíz', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Switch ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    // sanity: el ref apunta al mismo elemento que el role="switch"
    expect(ref.current).toBe(getSwitch())
  })
})
