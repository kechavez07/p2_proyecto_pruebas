import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  // Errores de desarrollo vs producción
  if (process.env.NODE_ENV === 'development') {
    console.error('💥 ERROR:', error);
    
    res.status(error.statusCode).json({
      success: false,
      error: error,
      message: error.message,
      stack: error.stack
    });
  } else {
    // Errores de producción (no mostrar stack trace)
    if (error.isOperational) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      console.error('💥 ERROR:', error);
      
      res.status(500).json({
        success: false,
        message: 'Algo salió mal!'
      });
    }
  }
};

// Crear error personalizado
export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
