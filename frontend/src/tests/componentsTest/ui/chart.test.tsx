// src/tests/componentsTest/chart.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ──────────────────────────────────────────────────────────────
// Mock de recharts: ResponsiveContainer/Tooltip/Legend simplificados
// ──────────────────────────────────────────────────────────────
vi.mock('recharts', () => {
  return {
    __esModule: true,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="recharts-responsive">{children}</div>
    ),
    Tooltip: (props: any) => <div data-testid="recharts-tooltip" {...props} />,
    Legend: (props: any) => <div data-testid="recharts-legend" {...props} />,
  }
})

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart'

describe('Chart (shadcn/ui)', () => {
  it('ChartContainer genera data-chart y estilos con variables CSS', () => {
    const config = {
      temperature: { label: 'Temp', color: '#f00' },
      humidity: { label: 'Hum', theme: { light: '#0f0', dark: '#00f' } },
    }

    const { container } = render(
      <ChartContainer id="abc" config={config}>
        <div>Inside</div>
      </ChartContainer>
    )

    const root = container.querySelector('[data-chart="chart-abc"]')
    expect(root).toBeInTheDocument()

    // ChartStyle se inyecta dentro del contenedor
    const style = container.querySelector('style') as HTMLStyleElement
    expect(style).toBeTruthy()

    const css = style.textContent || ''
    // Se generan reglas para light y dark
    expect(css).toContain('[data-chart=chart-abc]')
    expect(css).toContain('--color-temperature: #f00')
    expect(css).toContain('.dark [data-chart=chart-abc]')
    expect(css).toContain('--color-humidity: #00f') // color dark de theme
  })

  it('ChartTooltipContent no renderiza nada si no está activo o sin payload', () => {
    const config = { s1: { label: 'Serie 1', color: '#333' } }

    const { container, rerender } = render(
      <ChartContainer config={config}>
        <ChartTooltipContent active={false} payload={[]} />
      </ChartContainer>
    )
    expect(container.querySelector('[data-testid="tooltip"]')).toBeNull()
    expect(container.textContent).not.toContain('Serie 1')

    rerender(
      <ChartContainer config={config}>
        {/* sin payload */}
        <ChartTooltipContent active={true} payload={[]} />
      </ChartContainer>
    )
    expect(container.textContent).not.toContain('Serie 1')
  })

  it('ChartTooltipContent muestra label desde config y el valor', () => {
    const config = { temperature: { label: 'Temp', color: '#f00' } }
    const payload = [
      {
        dataKey: 'temperature',
        name: 'temperature',
        value: 23,
        color: '#f00',
        payload: { fill: '#f00' },
      },
    ]

    render(
      <ChartContainer config={config}>
        <ChartTooltipContent active label="temperature" payload={payload as any} />
      </ChartContainer>
    )

    // Cambia getByText por getAllByText y verifica que exista al menos uno
    expect(screen.getAllByText('Temp').length).toBeGreaterThan(0)
    expect(screen.getByText('23')).toBeInTheDocument()

    const indicator = document.querySelector('[style*="--color-bg"]') as HTMLDivElement
    expect(indicator).toBeTruthy()
    expect(indicator.getAttribute('style') || '').toContain('--color-bg')
  })

  it('ChartTooltipContent respeta hideIndicator y usa formatter cuando se pasa', () => {
    const config = { humidity: { label: 'Hum', color: '#00f' } }
    const payload = [
      {
        dataKey: 'humidity',
        name: 'humidity',
        value: 50,
        color: '#00f',
        payload: {},
      },
    ]

    // Sin indicador
    const { rerender } = render(
      <ChartContainer config={config}>
        <ChartTooltipContent active payload={payload as any} hideIndicator />
      </ChartContainer>
    )
    expect(document.querySelector('[style*="--color-bg"]')).toBeNull()

    // Con formatter
    const formatter = vi.fn((value: number, name: string) => (
      <div data-testid="fmt">{`${name}:${value}`}</div>
    ))

    rerender(
      <ChartContainer config={config}>
        <ChartTooltipContent active payload={payload as any} formatter={formatter} />
      </ChartContainer>
    )

    expect(screen.getByTestId('fmt')).toHaveTextContent('humidity:50')
    expect(formatter).toHaveBeenCalled()
  })

  it('ChartLegendContent devuelve null sin payload', () => {
    const config = { s1: { label: 'Serie 1', color: '#111' } }
    const { container } = render(
      <ChartContainer config={config}>
        <ChartLegendContent payload={[]} />
      </ChartContainer>
    )
    // No hay labels porque no hay payload
    expect(container.textContent).not.toContain('Serie 1')
  })

  it('ChartLegendContent pinta labels desde config y swatches de color', () => {
    const config = {
      temperature: { label: 'Temp', color: '#f00' },
      humidity: { label: 'Hum', color: '#00f' },
    }
    const legendPayload = [
      { value: 'temperature', color: '#f00', dataKey: 'temperature', payload: {} },
      { value: 'humidity', color: '#00f', dataKey: 'humidity', payload: {} },
    ]

    const { container } = render(
      <ChartContainer config={config}>
        <ChartLegendContent payload={legendPayload as any} />
      </ChartContainer>
    )

    expect(screen.getByText('Temp')).toBeInTheDocument()
    expect(screen.getByText('Hum')).toBeInTheDocument()

    // Busca los cuadritos con backgroundColor inline
    const boxes = Array.from(
      container.querySelectorAll('div[style*="background-color"]')
    ) as HTMLDivElement[]
    // Debe haber al menos dos (uno por item sin icono)
    expect(boxes.length).toBeGreaterThanOrEqual(2)
    expect((boxes[0].getAttribute('style') || '').toLowerCase()).toContain('rgb(255, 0, 0)')
    expect((boxes[1].getAttribute('style') || '').toLowerCase()).toContain('rgb(0, 0, 255)')
  })

  it('ChartLegendContent aplica padding según verticalAlign', () => {
    const config = { s1: { label: 'Serie 1', color: '#111' } }
    const legendPayload = [{ value: 's1', color: '#111', dataKey: 's1', payload: {} }]

    const { rerender, container } = render(
      <ChartContainer config={config}>
        <ChartLegendContent payload={legendPayload as any} />
      </ChartContainer>
    )
    // Por defecto verticalAlign="bottom" => clase "pt-3"
    const wrapperBottom = container.querySelector('.pt-3')
    expect(wrapperBottom).toBeTruthy()

    rerender(
      <ChartContainer config={config}>
        <ChartLegendContent payload={legendPayload as any} verticalAlign="top" />
      </ChartContainer>
    )
    const wrapperTop = container.querySelector('.pb-3')
    expect(wrapperTop).toBeTruthy()
  })
})
