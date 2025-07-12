import PinCard from "./PinCard";

// Mock data for demonstration
const mockPins = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
    title: "Diseño UI moderno con gradientes",
    description: "Inspiración para interfaces con colores vibrantes",
    author: {
      name: "Ana García",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c75?w=100&h=100&fit=crop"
    }
  },
  {
    id: "2", 
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop",
    title: "Paisaje montañoso al amanecer",
    description: "Fotografía de naturaleza impresionante",
    author: {
      name: "Carlos López",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    }
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=700&fit=crop",
    title: "Comida saludable y colorida",
    description: "Ideas para presentaciones de platos",
    author: {
      name: "María Rodríguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=400&h=450&fit=crop",
    title: "Arquitectura contemporánea",
    description: "Líneas limpias y formas geométricas",
    author: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&h=800&fit=crop",
    title: "Arte digital abstracto",
    description: "Colores y formas que inspiran creatividad",
    author: {
      name: "Sofia Martín",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    }
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=550&fit=crop",
    title: "Plantas y decoración interior",
    description: "Ideas para espacios verdes en casa",
    author: {
      name: "Luis Fernández",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop"
    }
  }
];

const PinGrid = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {mockPins.map((pin) => (
          <div key={pin.id} className="break-inside-avoid mb-4">
            <PinCard {...pin} />
          </div>
        ))}
      </div>
    </div>
  );
};


export default PinGrid;