# Proyecto Full Stack - Frontend + Backend

Este proyecto está dividido en dos partes principales: un frontend desarrollado con React + TypeScript + Vite y un backend desarrollado con Node.js + Express + TypeScript + MongoDB.

## 📁 Estructura del proyecto

```
proyecto/
├── frontend/           # Aplicación React con Vite
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/            # API REST con Express
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md          # Este archivo
```

## 🚀 Guía de inicio rápido

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (local o remoto)
- npm o yarn

### 1. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar en modo desarrollo
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

### 2. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📚 APIs disponibles

### Autenticación

- **POST** `/api/auth/register` - Registro de usuario
- **POST** `/api/auth/login` - Login de usuario
- **GET** `/api/auth/profile` - Obtener perfil (requiere autenticación)
- **GET** `/api/health` - Estado del servidor

## 🛠️ Tecnologías utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router DOM
- React Hook Form
- Zod (validaciones)

### Backend
- Node.js
- Express
- TypeScript
- MySQL (Clever Cloud)
- Sequelize ORM
- JWT (autenticación)
- Bcrypt (hash de contraseñas)
- Express Validator
- CORS
- Helmet (seguridad)
- Rate Limiting

## 📝 Scripts disponibles

### Frontend
```bash
cd frontend
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Linter
```

### Backend
```bash
cd backend
npm run dev        # Servidor de desarrollo con auto-reload
npm run build      # Compilar TypeScript
npm start          # Ejecutar en producción
```

## 🔧 Configuración

### Variables de entorno del Backend

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=5000
NODE_ENV=development
DB_HOST=tu-host-clever-cloud.mysql.clever-cloud.com
DB_PORT=3306
DB_NAME=tu_nombre_base_datos
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_clever_cloud
DB_SSL=true
JWT_SECRET=tu-clave-secreta-muy-segura-aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8081
```

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
# Los archivos estáticos estarán en dist/
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
