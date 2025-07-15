import { Search, Bell, MessageCircle, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            PinBoard
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="font-medium" asChild>
            <Link to="/home">Inicio</Link>
          </Button>
          <Button variant="ghost" className="font-medium" asChild>
            <Link to="/profile">Perfil</Link>
          </Button>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ideas..."
              className="pl-10 bg-muted/50 border-none"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button size="icon" className="bg-gradient-primary text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
          </Button>
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="outline" onClick={handleLogout} className="ml-2">
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;