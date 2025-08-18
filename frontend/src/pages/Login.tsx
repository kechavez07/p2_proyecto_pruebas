import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    toast({
      title: 'Error',
      description: 'Por favor completa todos los campos',
      variant: 'destructive'
    });
    return;
  }

  try {
    const url = isSignUp
      ? 'http://localhost:5000/api/auth/register'    // Cambia por tu endpoint de registro
      : 'http://localhost:5000/api/auth/login';      // Cambia por tu endpoint de login

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: isSignUp
        ? JSON.stringify({ username, email, password, confirmPassword })
        : JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
  // Busca el mensaje en diferentes campos
  const errorMsg = data.message || data.msg || data.error || JSON.stringify(data) || 'Error';
  throw new Error(errorMsg);
}

    toast({
      title: '¡Bienvenido!',
      description: isSignUp ? 'Cuenta creada exitosamente' : 'Inicio de sesión exitoso'
    });

    // Guarda el token y el usuario en localStorage si el backend lo devuelve
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    navigate('/home');
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive'
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PinBoard
          </h1>
          <p className="text-muted-foreground mt-2">
            Descubre y guarda ideas increíbles
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Únete a nuestra comunidad creativa'
                : 'Accede a tu cuenta para continuar'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-2.5 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
              </p>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-accent transition-colors duration-200 font-medium"
              >
                {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;