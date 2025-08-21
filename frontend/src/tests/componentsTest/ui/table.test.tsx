import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

describe('Table (shadcn wrapper)', () => {
  it('renderiza la estructura básica con clases base y extra', () => {
    const { container } = render(
      <Table data-testid="tbl" className="t-extra">
        <TableCaption>Mi caption</TableCaption>

        <TableHeader data-testid="thead" className="th-extra">
          <TableRow data-testid="trh">
            <TableHead data-testid="th1">H1</TableHead>
            <TableHead data-testid="th2">H2</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody data-testid="tbody" className="tb-extra">
          <TableRow data-testid="tr1" data-state="selected">
            <TableCell data-testid="td1">C1</TableCell>
            <TableCell data-testid="td2">C2</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter data-testid="tfoot" className="tf-extra">
          <TableRow>
            <TableCell colSpan={2}>foot</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    // Wrapper contenedor con overflow
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toBeInstanceOf(HTMLDivElement)
    expect(wrapper.className).toMatch(/relative/)
    expect(wrapper.className).toMatch(/overflow-auto/)

    // Tabla con clases base
    const table = screen.getByTestId('tbl')
    expect(table).toBeInstanceOf(HTMLTableElement)
    expect(table.className).toMatch(/w-full/)
    expect(table.className).toMatch(/caption-bottom/)
    expect(table.className).toMatch(/text-sm/)
    expect(table.className).toMatch(/t-extra/)

    // THEAD
    const thead = screen.getByTestId('thead')
    expect(thead.tagName).toBe('THEAD')
    expect(thead.className).toMatch(/\[&_tr\]:border-b/)
    expect(thead.className).toMatch(/th-extra/)

    // TBODY
    const tbody = screen.getByTestId('tbody')
    expect(tbody.tagName).toBe('TBODY')
    expect(tbody.className).toMatch(/\[&_tr:last-child\]:border-0/)
    expect(tbody.className).toMatch(/tb-extra/)

    // TFOOT
    const tfoot = screen.getByTestId('tfoot')
    expect(tfoot.tagName).toBe('TFOOT')
    expect(tfoot.className).toMatch(/border-t/)
    expect(tfoot.className).toMatch(/bg-muted\/50/)
    expect(tfoot.className).toMatch(/tf-extra/)

    // TR (con estado selected)
    const tr = screen.getByTestId('tr1')
    expect(tr.className).toMatch(/border-b/)
    expect(tr.className).toMatch(/hover:bg-muted\/50/)
    expect(tr).toHaveAttribute('data-state', 'selected')
    expect(tr.className).toMatch(/data-\[state=selected\]:bg-muted/)

    // TH
    const th = screen.getByTestId('th1')
    expect(th.tagName).toBe('TH')
    expect(th.className).toMatch(/h-12/)
    expect(th.className).toMatch(/text-left/)
    expect(th.className).toMatch(/\[&:has\(\[role=checkbox\]\)\]:pr-0/)

    // TD
    const td = screen.getByTestId('td1')
    expect(td.tagName).toBe('TD')
    expect(td.className).toMatch(/p-4/)
    expect(td.className).toMatch(/\[&:has\(\[role=checkbox\]\)\]:pr-0/)

    // CAPTION
    const caption = screen.getByText('Mi caption')
    expect(caption.tagName).toBe('CAPTION')
    expect(caption.className).toMatch(/mt-4/)
    expect(caption.className).toMatch(/text-muted-foreground/)
  })

  it('forwardea refs correctamente a cada subcomponente', () => {
    const tableRef = React.createRef<HTMLTableElement>()
    const theadRef = React.createRef<HTMLTableSectionElement>()
    const tbodyRef = React.createRef<HTMLTableSectionElement>()
    const tfootRef = React.createRef<HTMLTableSectionElement>()
    const trRef = React.createRef<HTMLTableRowElement>()
    const thRef = React.createRef<HTMLTableCellElement>()
    const tdRef = React.createRef<HTMLTableCellElement>()
    const captionRef = React.createRef<HTMLTableCaptionElement>()

    render(
      <Table ref={tableRef}>
        <TableCaption ref={captionRef}>Cap</TableCaption>
        <TableHeader ref={theadRef}>
          <TableRow ref={trRef}>
            <TableHead ref={thRef}>H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={tbodyRef}>
          <TableRow>
            <TableCell ref={tdRef}>C</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter ref={tfootRef}>
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(tableRef.current).toBeInstanceOf(HTMLTableElement)
    expect(theadRef.current).toBeInstanceOf(HTMLTableSectionElement)
    expect(tbodyRef.current).toBeInstanceOf(HTMLTableSectionElement)
    expect(tfootRef.current).toBeInstanceOf(HTMLTableSectionElement)
    expect(trRef.current).toBeInstanceOf(HTMLTableRowElement)
    expect(thRef.current).toBeInstanceOf(HTMLTableCellElement)
    expect(tdRef.current).toBeInstanceOf(HTMLTableCellElement)
    expect(captionRef.current).toBeInstanceOf(HTMLTableCaptionElement)
  })

  it('propaga atributos extra en cada subcomponente', () => {
    render(
      <Table data-x="table">
        <TableCaption data-x="caption">Cap</TableCaption>
        <TableHeader data-x="thead">
          <TableRow data-x="tr">
            <TableHead data-x="th">H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-x="tbody">
          <TableRow data-x="tr2">
            <TableCell data-x="td">C</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter data-x="tfoot">
          <TableRow data-x="tr3">
            <TableCell data-x="td2">F</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByRole('table')).toHaveAttribute('data-x', 'table')
    expect(screen.getByText('Cap')).toHaveAttribute('data-x', 'caption')
    expect(screen.getByText('H').closest('thead')).toHaveAttribute('data-x', 'thead')
    expect(screen.getByText('H').closest('tr')).toHaveAttribute('data-x', 'tr')
    expect(screen.getByText('H').closest('th')).toHaveAttribute('data-x', 'th')
    expect(screen.getByText('C').closest('tbody')).toHaveAttribute('data-x', 'tbody')
    expect(screen.getByText('C').closest('tr')).toHaveAttribute('data-x', 'tr2')
    expect(screen.getByText('C').closest('td')).toHaveAttribute('data-x', 'td')
    expect(screen.getByText('F').closest('tfoot')).toHaveAttribute('data-x', 'tfoot')
    expect(screen.getByText('F').closest('tr')).toHaveAttribute('data-x', 'tr3')
    expect(screen.getByText('F').closest('td')).toHaveAttribute('data-x', 'td2')
  })
})
