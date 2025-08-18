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
import { connectDB } from './config/database'; // <-- Importa la conexión

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});

// Middlewares
app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pins', pinRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

app.use(errorHandler);
// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar la conexión a la base y luego el servidor solo si no es test
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
    });
  })();
} else {
  // En test, solo conecta la base (sin levantar el servidor)
  (async () => {
    await connectDB();
  })();
}

export default app;