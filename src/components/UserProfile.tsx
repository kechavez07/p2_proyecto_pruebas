import { useState } from "react";
import { Settings, Share2, MoreHorizontal, Grid3X3, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PinCard from "./PinCard";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    pinsCount: number;
  };
  isOwnProfile?: boolean;
}

const UserProfile = ({ user, isOwnProfile = false }: UserProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user pins
  const userPins = [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
      title: "Diseño UI moderno",
      author: { name: user.name, avatar: user.avatar }
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=500&fit=crop",
      title: "Paisaje inspirador",
      author: { name: user.name, avatar: user.avatar }
    }
  ];

  const savedPins = [
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=700&fit=crop",
      title: "Comida saludable",
      author: { name: "Otro Usuario", avatar: "" },
      saved: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <Avatar className="w-32 h-32 mx-auto mb-4">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-4xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-muted-foreground mb-1">@{user.username}</p>
        
        {user.bio && (
          <p className="text-foreground max-w-md mx-auto mb-4">{user.bio}</p>
        )}

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-6 text-sm">
          <div className="text-center">
            <div className="font-semibold">{user.followersCount}</div>
            <div className="text-muted-foreground">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{user.followingCount}</div>
            <div className="text-muted-foreground">Siguiendo</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{user.pinsCount}</div>
            <div className="text-muted-foreground">Pines</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          {isOwnProfile ? (
            <>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar perfil
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={isFollowing ? "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : "bg-gradient-primary text-white hover:opacity-90"}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="created" className="flex items-center space-x-2">
            <Grid3X3 className="h-4 w-4" />
            <span>Creado</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4" />
            <span>Guardado</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="created">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {userPins.map((pin) => (
              <div key={pin.id} className="break-inside-avoid mb-4">
                <PinCard {...pin} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {savedPins.map((pin) => (
              <div key={pin.id} className="break-inside-avoid mb-4">
                <PinCard {...pin} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;