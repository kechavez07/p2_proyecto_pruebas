// src/tests/ui.smoke.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// ── Mocks para libs que a veces dan problemas en tests ─────────
vi.mock('recharts', () => {
  const Any = (p: any) => <div data-testid="recharts" {...p} />
  return {
    ResponsiveContainer: Any, AreaChart: Any, LineChart: Any, Line: Any,
    BarChart: Any, Bar: Any, CartesianGrid: Any, XAxis: Any, YAxis: Any, Tooltip: Any, Legend: Any,
  }
})
vi.mock('react-day-picker', () => ({
  DayPicker: (props: any) => <div role="grid" aria-label="day-picker" {...props} />,
}))

// ── Importa tus componentes shadcn/ui (bloque único) ─────────────────────────
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { Accordion } from '@/components/ui/accordion'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Calendar } from '@/components/ui/calendar'
import { Carousel } from '@/components/ui/carousel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet } from '@/components/ui/sheet'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'

// Compuestos
import { Command, CommandList, CommandItem } from '@/components/ui/command'
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from '@/components/ui/context-menu'
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
} from '@/components/ui/menubar' 
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext,
} from '@/components/ui/pagination'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  ResizablePanelGroup, ResizablePanel, ResizableHandle,
} from '@/components/ui/resizable'

// Chart: estos son los exports reales (no existe `Chart`)
import {
  ChartContainer,
  // si los usas: ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle
} from '@/components/ui/chart'


// Añade un test básico para cada uno:
describe('UI smoke suite (shadcn/ui)', () => {
  it('Resizable', () => {
    render(
        <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}><div>Left</div></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel><div>Right</div></ResizablePanel>
        </ResizablePanelGroup>
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    })
    it('Button', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument()
  })

  it('Input + Label + Separator', () => {
    render(
      <div>
        <Label htmlFor="i1">Nombre</Label>
        <Input id="i1" placeholder="Escribe..." />
        <Separator />
      </div>
    )
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Escribe...')).toBeInTheDocument()
  })

  it('Checkbox', () => {
    render(<Checkbox aria-label="acepto" />)
    expect(screen.getByRole('checkbox', { name: /acepto/i })).toBeInTheDocument()
  })

  it('Badge + Avatar + Fallback', () => {
    render(
      <div>
        <Badge variant="secondary">Nuevo</Badge>
        <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
      </div>
    )
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('Progress + Skeleton + Slider', () => {
    render(
      <div>
        <Progress value={40} />
        <Skeleton className="h-4 w-20" />
        <Slider defaultValue={[25]} max={100} step={1} />
      </div>
    )
    // no siempre hay roles accesibles, validar que se montó algo
    expect(document.body.innerHTML).toMatch(/progress|skeleton|range/i)
  })

  it('Card + Alert', () => {
    render(
      <div>
        <Card>
          <CardHeader><CardTitle>Título</CardTitle></CardHeader>
          <CardContent>Contenido</CardContent>
        </Card>

        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>Texto de alerta</AlertDescription>
        </Alert>
      </div>
    )
    expect(screen.getByText('Título')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
    expect(screen.getByText('Heads up!')).toBeInTheDocument()
    expect(screen.getByText('Texto de alerta')).toBeInTheDocument()
  })

  it('Dialog (forzado abierto con trigger)', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mi diálogo</DialogTitle>
            <DialogDescription>Descripción del diálogo</DialogDescription>
          </DialogHeader>
          Hola
        </DialogContent>
      </Dialog>
    )
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Mi diálogo')).toBeInTheDocument()
    expect(screen.getByText('Hola')).toBeInTheDocument()
  })

  it('DropdownMenu (abre y muestra item)', () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('Popover (forzado abierto)', () => {
    render(
      <Popover open>
        <PopoverTrigger>Pop</PopoverTrigger>
        <PopoverContent>Contenido popover</PopoverContent>
      </Popover>
    )
    expect(screen.getByText('Contenido popover')).toBeInTheDocument()
  })

  it('HoverCard (forzado abierto)', () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>Info</HoverCardContent>
      </HoverCard>
    )
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('Select (abre y renderiza items)', () => {
    render(
      <Select defaultValue="1" open>
        <SelectTrigger data-testid="select"><SelectValue placeholder="Elige" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Uno</SelectItem>
          <SelectItem value="2">Dos</SelectItem>
        </SelectContent>
      </Select>
    )
    // Verifica que hay dos "Uno" (trigger y opción)
    expect(screen.getAllByText('Uno').length).toBeGreaterThan(1)
    expect(screen.getByText('Dos')).toBeInTheDocument()
  })

  it('Accordion', () => {
    render(<Accordion type="single" />)
  })

  it('AlertDialog', () => {
    render(<AlertDialog open />)
  })

  it('AspectRatio', () => {
    render(<AspectRatio ratio={16 / 9}><div>Contenido</div></AspectRatio>)
  })

  it('Breadcrumb', () => {
    render(<Breadcrumb><div>Item</div></Breadcrumb>)
  })

  it('Calendar', () => {
    render(<Calendar />)
  })

  it('Carousel', () => {
    render(<Carousel><div>Slide</div></Carousel>)
  })

  it('ChartContainer', () => {
    render(<ChartContainer data={[]} config={{}} />)
    expect(screen.getByTestId('recharts')).toBeInTheDocument()
  })


  it('Command', () => {
    render(<Command><div>Cmd</div></Command>)
  })

  it('ContextMenu', () => {
    render(<ContextMenu><div>Ctx</div></ContextMenu>)
  })

  it('Drawer', () => {
    render(<Drawer open />)
  })

  it('Form', () => {
    render(<Form><div>Form</div></Form>)
  })

  it('Menubar', () => {
    render(<Menubar><div>Menu</div></Menubar>)
  })

  it('NavigationMenu', () => {
    render(<NavigationMenu><div>Nav</div></NavigationMenu>)
  })

  it('Pagination', () => {
    render(<Pagination pageCount={5} />)
  })

  it('RadioGroup', () => {
    render(<RadioGroup><div>Radio</div></RadioGroup>)
  })

  it('ScrollArea', () => {
    render(<ScrollArea><div>Scroll</div></ScrollArea>)
  })

  it('Sheet', () => {
    render(<Sheet open />)
  })
})

export default Carousel
