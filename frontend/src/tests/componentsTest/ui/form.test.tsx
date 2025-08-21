// src/tests/componentsTest/form.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'

// Un formulario de prueba que expone lo suficiente para las aserciones
function DemoForm({
  withCustomMessage = false,
  requiredMsg = 'Email requerido',
}: {
  withCustomMessage?: boolean
  requiredMsg?: string
}) {
  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          name="email"
          rules={{ required: requiredMsg }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input placeholder="correo" {...field} />
              </FormControl>
              <FormDescription>Ingresa tu email</FormDescription>
              {withCustomMessage ? (
                <FormMessage>Mensaje custom</FormMessage>
              ) : (
                <FormMessage />
              )}
            </FormItem>
          )}
        />
        <button type="submit">Enviar</button>
      </form>
    </Form>
  )
}

const submit = () =>
  act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
  })

describe('Form (shadcn/ui + react-hook-form)', () => {
  it('cablea label-control y aria-describedby sin error', () => {
    render(<DemoForm />)

    const input = screen.getByLabelText('Email') as HTMLInputElement
    const labelEl = screen.getByText('Email') as HTMLLabelElement
    const desc = screen.getByText('Ingresa tu email')

    // label → control
    expect(labelEl.getAttribute('for')).toBe(input.id)

    // accesibilidad sin error
    expect(input).toHaveAttribute('aria-invalid', 'false')
    expect(desc.id).toBeTruthy()
    expect(input.getAttribute('aria-describedby')).toBe(desc.id)

    // FormMessage sin children y sin error → no renderiza
    expect(screen.queryByText('Email requerido')).not.toBeInTheDocument()
  })

  it('al validar con error: muestra mensaje, aria-invalid=true y aria-describedby incluye messageId', async () => {
    render(<DemoForm requiredMsg="Campo obligatorio" />)

    const input = screen.getByLabelText('Email') as HTMLInputElement
    const labelEl = screen.getByText('Email') as HTMLLabelElement
    const desc = screen.getByText('Ingresa tu email')

    await submit()

    const msg = await screen.findByText('Campo obligatorio')

    // aria-invalid y aria-describedby (desc + msg)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const describedBy = input.getAttribute('aria-describedby') || ''
    expect(describedBy.split(' ').sort()).toEqual([desc.id, msg.id].sort())

    // label recibe clase destructiva cuando hay error
    expect(labelEl.className).toMatch(/text-destructive/)
  })

  it('FormMessage renderiza children cuando no hay error', () => {
    render(<DemoForm withCustomMessage />)

    // Sin enviar, no hay error -> debe mostrarse el children custom
    expect(screen.getByText('Mensaje custom')).toBeInTheDocument()
  })

  it('FormMessage muestra el error en lugar del children cuando lo hay', async () => {
    render(<DemoForm withCustomMessage requiredMsg="Ups, requerido" />)

    // Antes del submit está el custom
    expect(screen.getByText('Mensaje custom')).toBeInTheDocument()

    await submit()

    // Tras el submit aparece el mensaje de error
    expect(screen.getByText('Ups, requerido')).toBeInTheDocument()
  })
})
