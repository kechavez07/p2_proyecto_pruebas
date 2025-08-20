import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User } from '../models/User';
import { AuthResponse, RegisterRequest, LoginRequest } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRES_IN: string = typeof process.env.JWT_EXPIRES_IN === 'string' && process.env.JWT_EXPIRES_IN.length > 0 ? process.env.JWT_EXPIRES_IN : '7d';


// Función auxiliar para generar token JWT
const generateToken = (userId: number, username: string, email: string): string => {
  const payload = { id: userId, username, email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Función auxiliar para formatear datos del usuario
const formatUserResponse = (user: any) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar || '',
  createdAt: user.createdAt
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
      return;
    }

    const { username, email, password, confirmPassword }: RegisterRequest = req.body;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Las contraseñas no coinciden'
      });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'nombre de usuario';
      res.status(409).json({
        success: false,
        message: `Ya existe un usuario con ese ${field}`
      });
      return;
    }

    // Crear nuevo usuario (el modelo se encarga de hashear la contraseña)
    const newUser = await User.create({
      username,
      email,
      password
    });

    const response = {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: formatUserResponse(newUser)
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
      return;
    }

    const { email, password }: LoginRequest = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Logs para depuración
    console.log('Email recibido:', email);
    console.log('Password recibido:', password);
    console.log('Password en BD:', user.password);

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Resultado bcrypt.compare:', isPasswordValid);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Generar token
    const token = generateToken(user.id, user.username, user.email);

    const response: AuthResponse = {
      success: true,
      message: 'Login exitoso',
      token,
      user: formatUserResponse(user)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // El middleware de autenticación debe haber añadido el usuario al request
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
