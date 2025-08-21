// src/tests/componentsTest/carousel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'

// Mock controlable de embla-carousel-react
vi.mock('embla-carousel-react', () => {
  let listeners: Record<string, Array<(api: any) => void>> = {}
  let canPrev = false
  let canNext = true

  const api = {
    canScrollPrev: vi.fn(() => canPrev),
    canScrollNext: vi.fn(() => canNext),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((evt: string, cb: (api: any) => void) => {
      ;(listeners[evt] ||= []).push(cb)
    }),
    off: vi.fn((evt: string, cb: (api: any) => void) => {
      listeners[evt] = (listeners[evt] || []).filter((f) => f !== cb)
    }),
    // helpers para el test
    __setCan: (prev: boolean, next: boolean) => {
      canPrev = prev
      canNext = next
    },
    __emit: (evt: string) => {
      ;(listeners[evt] || []).forEach((fn) => fn(api))
    },
  }

  const emblaRef = vi.fn()

  return {
    __esModule: true,
    default: () => [emblaRef, api],
    __mockEmbla: { getApi: () => api },
  }
})

// Import de los componentes reales
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

// Acceso al helper del mock sin líos de tipos
import * as EmblaMockNS from 'embla-carousel-react'
const __mockEmbla: any = (EmblaMockNS as any).__mockEmbla

const getPrev = () => screen.getByRole('button', { name: /previous slide/i })
const getNext = () => screen.getByRole('button', { name: /next slide/i })

describe('Carousel (shadcn/ui)', () => {
  it('renderiza el carrusel con slides y roles accesibles', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')

    const slides = screen.getAllByRole('group')
    expect(slides).toHaveLength(3)
    slides.forEach(s => {
      expect(s).toHaveAttribute('aria-roledescription', 'slide')
    })

    expect(getPrev()).toBeDisabled()
    expect(getNext()).not.toBeDisabled()
  })

  it('hace scroll con botones y actualiza disabled', async () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>A</CarouselItem>
          <CarouselItem>B</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const api: any = __mockEmbla.getApi()

    await act(async () => {
      fireEvent.click(getNext())
    })
    expect(api.scrollNext).toHaveBeenCalledTimes(1)

    await act(async () => {
      api.__setCan(true, false)
      api.__emit('select')
    })

    expect(getPrev()).not.toBeDisabled()
    expect(getNext()).toBeDisabled()

    await act(async () => {
      fireEvent.click(getPrev())
    })
    expect(api.scrollPrev).toHaveBeenCalledTimes(1)
  })

  it('responde a ArrowLeft/ArrowRight', async () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>1</CarouselItem>
          <CarouselItem>2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const api: any = __mockEmbla.getApi()
    const region = screen.getByRole('region')

    await act(async () => {
      fireEvent.keyDown(region, { key: 'ArrowRight' })
    })
    expect(api.scrollNext).toHaveBeenCalled()

    await act(async () => {
      fireEvent.keyDown(region, { key: 'ArrowLeft' })
    })
    expect(api.scrollPrev).toHaveBeenCalled()
  })

  it('aplica clases de orientación vertical en CarouselItem', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem data-testid="slide">V1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const item = screen.getByTestId('slide')
    expect(item).toHaveClass('pt-4')
  })

  it('llama setApi cuando se proporciona', () => {
    const setApi = vi.fn()
    render(
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>SetApi</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
    expect(setApi).toHaveBeenCalled()
  })

  it('CarouselPrevious/Next muestran su icono y texto accesible', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>IconTest</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
    expect(getPrev().querySelector('svg')).toBeInTheDocument()
    expect(getNext().querySelector('svg')).toBeInTheDocument()
    expect(getPrev().querySelector('.sr-only')?.textContent).toBe('Previous slide')
    expect(getNext().querySelector('.sr-only')?.textContent).toBe('Next slide')
  })

  it('lanza error si useCarousel se usa fuera de contexto', () => {
    // @ts-expect-error
    function Bad() { return require('@/components/ui/carousel').useCarousel() }
    expect(Bad).toThrow()
  })
})
