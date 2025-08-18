import { useState } from 'react';
import { Settings, Share2, MoreHorizontal, Grid3X3, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PinCard from './PinCard';
import React from 'react';

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
  userPins?: { total: number; pins: any[] };
  savedPins?: any[];
}

const UserProfile = ({ user, isOwnProfile = false, userPins = { total: 0, pins: [] }, savedPins = [] }: UserProfileProps) => {  const [isFollowing, setIsFollowing] = useState(false);

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
                className={isFollowing ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground' : 'bg-gradient-primary text-white hover:opacity-90'}
              >
                {isFollowing ? 'Siguiendo' : 'Seguir'}
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
            {(!Array.isArray(userPins.pins) || userPins.pins.length === 0) ? (
              <div className="text-center col-span-full text-muted-foreground py-8">No tienes pines creados.</div>
            ) : (
              userPins.pins.map((pin) => {
                // Adaptar estructura para PinCard
                const pinProps = {
                  ...pin,
                  author: {
                    name: pin.authorName || user.name,
                    avatar: pin.authorAvatar || user.avatar
                  }
                };
                return (
                  <div key={pin.id} className="break-inside-avoid mb-4">
                    <PinCard {...pinProps} />
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {savedPins.length === 0 ? (
              <div className="text-center col-span-full text-muted-foreground py-8">No tienes pines guardados.</div>
            ) : (
              savedPins.map((pin) => {
                const pinProps = {
                  ...pin,
                  author: {
                    name: pin.authorName || user.name,
                    avatar: pin.authorAvatar || user.avatar
                  }
                };
                return (
                  <div key={pin.id} className="break-inside-avoid mb-4">
                    <PinCard {...pinProps} />
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;