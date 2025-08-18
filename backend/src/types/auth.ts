import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  }
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
  };
}

export interface JWTPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
  exp?: number;
}
