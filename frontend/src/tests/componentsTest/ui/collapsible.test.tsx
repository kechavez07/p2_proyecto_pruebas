// src/tests/componentsTest/collapsible.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock mínimo de Radix Collapsible para controlar el estado y atributos
vi.mock('@radix-ui/react-collapsible', () => {
  const React = require('react')
  const Ctx = React.createContext<{ open: boolean; setOpen: (v: boolean) => void }>({
    open: false,
    setOpen: () => {},
  })

  const Root = ({ open: openProp, defaultOpen, onOpenChange, children }: any) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(!!defaultOpen)
    const isControlled = openProp !== undefined
    const open = isControlled ? !!openProp : uncontrolledOpen

    const setOpen = (next: boolean) => {
      onOpenChange?.(next)
      if (!isControlled) setUncontrolledOpen(next)
    }

    return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>
  }

  const CollapsibleTrigger = ({ children, ...props }: any) => {
    const { open, setOpen } = React.useContext(Ctx)
    return (
      <button
        type="button"
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
      </button>
    )
  }

  const CollapsibleContent = ({ children, forceMount, ...props }: any) => {
    const { open } = React.useContext(Ctx)
    if (!open && !forceMount) return null
    return (
      <div
        hidden={!open}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    )
  }

  return {
    __esModule: true,
    Root,
    CollapsibleTrigger,
    CollapsibleContent,
  }
})

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'

describe('Collapsible (shadcn/ui wrapper)', () => {
  it('está cerrado por defecto y el contenido no se renderiza', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Contenido</CollapsibleContent>
      </Collapsible>
    )

    const btn = screen.getByRole('button', { name: /toggle/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAttribute('data-state', 'closed')
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument()
  })

  it('al hacer click en el trigger, abre y muestra el contenido', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Contenido</CollapsibleContent>
      </Collapsible>
    )

    const btn = screen.getByRole('button', { name: /toggle/i })
    fireEvent.click(btn)

    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(btn).toHaveAttribute('data-state', 'open')
    const content = screen.getByText('Contenido')
    expect(content).toBeInTheDocument()
    expect(content).toHaveAttribute('data-state', 'open')
  })

  it('funciona en modo controlado (open + onOpenChange)', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Collapsible open={true} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Ctrl</CollapsibleContent>
      </Collapsible>
    )

    // Está abierto por la prop
    expect(screen.getByText('Ctrl')).toBeInTheDocument()

    // Click: no cambia por sí mismo, pero llama onOpenChange con el nuevo estado propuesto
    fireEvent.click(screen.getByRole('button', { name: /toggle/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)

    // Simulamos que el padre cambia a cerrado
    rerender(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Ctrl</CollapsibleContent>
      </Collapsible>
    )
    expect(screen.queryByText('Ctrl')).not.toBeInTheDocument()
  })

  it('forceMount mantiene el nodo en el DOM aunque esté cerrado', () => {
    render(
      <Collapsible open={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent forceMount data-testid="content">FM</CollapsibleContent>
      </Collapsible>
    )

    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveAttribute('data-state', 'closed')
    expect(content).toHaveAttribute('hidden')
  })
})
