import { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';

const UploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', selectedFile);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    // Obtener el nombre de usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.username) {
      formData.append('authorName', user.username);
    }

    try {
      const res = await fetch('https://proyecto-pruebas-api.onrender.com/api/pins/createPin', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        // Opcional: recargar pines o mostrar mensaje de éxito
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsOpen(false);
      } else {
        alert('Error al crear el pin');
      }
    } catch (err) {
      alert('Error de red al crear el pin');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAvatarFile(null);
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-white hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Crear Pin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Crear nuevo Pin</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div className="space-y-4">
              <Label>Imagen</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-auto rounded-lg max-h-80 object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null);
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor="file-upload"
                        className="cursor-pointer text-primary hover:text-primary/80"
                      >
                        Selecciona una imagen
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        O arrastra y suelta aquí
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Avatar Upload */}
              <Label className="mt-4 block">Avatar del autor</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {avatarPreview ? (
                  <div className="relative">
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setAvatarFile(null);
                        if (avatarPreview) {
                          URL.revokeObjectURL(avatarPreview);
                          setAvatarPreview(null);
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer text-primary hover:text-primary/80"
                      >
                        Selecciona un avatar
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        O arrastra y suelta aquí
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
              </div>
            </div>

            {/* Pin Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Agrega un título"
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cuenta a las personas de qué se trata tu Pin"
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>
          </div>



          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedFile || !title}
              className="bg-gradient-primary text-white hover:opacity-90"
            >
              Publicar Pin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;