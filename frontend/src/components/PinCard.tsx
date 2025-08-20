import { useState, useEffect } from 'react';
import { Heart, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PinCardProps {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  author: {
    name: string;
    avatar?: string;
  };
  saved?: boolean;
  className?: string;
}

const PinCard = ({ id, imageUrl, title, description, author, saved = false, className }: PinCardProps) => {
  const [isSaved, setIsSaved] = useState(saved);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return;
    try {
      const res = await fetch('http://localhost:5000/api/pins/savePin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, pinId: id })
      });
      if (res.ok) {
        setIsSaved(true);
      }
    } catch (err) {
      // Puedes mostrar un toast de error si lo deseas
    }
  };

  return (
    <div 
      className={cn(
        'group relative bg-card rounded-xl overflow-hidden shadow-pin hover:shadow-hover transition-all duration-300 cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-start justify-end p-3">
            <Button
              onClick={handleSave}
              disabled={isSaved}
              className={cn(
                'bg-accent hover:bg-accent/90 text-accent-foreground',
                isSaved && 'bg-primary hover:bg-primary/90 text-primary-foreground'
              )}
            >
              <Bookmark className={cn('h-4 w-4 mr-2', isSaved && 'fill-current')} />
              {isSaved ? 'Guardado' : 'Guardar'}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{description}</p>
        )}
        
        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="text-xs">
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{author.name}</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <Share2 className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;