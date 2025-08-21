import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import pinRoutes from './routes/pin';
import 'dotenv/config';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MEJORA DE CORS ---
const allowedOrigins = [
  'http://localhost:5173', // URL común de Vite en desarrollo
  'http://localhost:3000', // URL común de Create React App
  'https://p2-proyecto-pruebas.vercel.app' // URL de tu frontend en producción
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// --- Middlewares ---

// Aplica el Rate Limiter SOLO si no estamos en entorno de pruebas
if (process.env.NODE_ENV !== 'test npm run dev') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // Límite de 500 peticiones por IP
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    // Omite el límite si la petición contiene el header 'x-k6-test' con el valor secreto.
    skip: (req) => req.headers['x-k6-test'] === process.env.K6_SECRET,
    standardHeaders: true, // Usa cabeceras estándar `RateLimit-*`
    legacyHeaders: false, // Deshabilita las cabeceras `X-RateLimit-*`
  });
  app.use(limiter);
  console.log('✅ Rate limiter está activado.');
} else {
  console.log('ℹ️ Rate limiter está DESACTIVADO para el entorno de pruebas.');
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/pins', pinRoutes);

// Ruta de Health Check para verificar que el servidor está vivo
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Middleware para manejar rutas no encontradas (404)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware centralizado para manejo de errores
app.use(errorHandler);

// --- Iniciar la conexión a la base de datos y el servidor ---
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
      });
    } catch (error) {
      console.error('❌ Error al iniciar el servidor:', error);
      process.exit(1);
    }
  })();
} else {
  // En 'test', solo asegura la conexión a la DB
  (async () => {
    await connectDB();
  })();
}

export default app;
