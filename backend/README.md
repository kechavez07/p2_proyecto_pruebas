# Backend API - Proyecto

Backend desarrollado con Node.js, Express, TypeScript y MySQL para el sistema de autenticación de usuarios.

## 🚀 Características

- ✅ Registro y login de usuarios
- ✅ Autenticación con JWT
- ✅ Validación de datos con express-validator
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Rate limiting para prevenir ataques
- ✅ Middleware de manejo de errores
- ✅ CORS configurado
- ✅ Seguridad con Helmet
- ✅ TypeScript para tipado estático
- ✅ MySQL con Sequelize ORM

## 📋 Requisitos previos

- Node.js (v18 o superior)
- Cuenta en Clever Cloud
- npm o yarn

## 🛠️ Instalación

### Desarrollo Local

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` con las credenciales de tu base de datos Clever Cloud:
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

### Despliegue en Clever Cloud

Ver el archivo `CLEVER_CLOUD_SETUP.md` para instrucciones detalladas de despliegue.

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Autenticación

#### Registro de usuario
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@email.com",
  "password": "MiPassword123",
  "confirmPassword": "MiPassword123"
}
```

#### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "usuario@email.com",
  "password": "MiPassword123"
}
```

#### Obtener perfil (requiere autenticación)
- **GET** `/api/auth/profile`
- **Headers:**
```
Authorization: Bearer <token>
```

### Respuestas de la API

#### Respuesta exitosa:
```json
{
  "success": true,
  "message": "Operación exitosa",
  "token": "jwt_token_aqui",
  "user": {
    "id": "user_id",
    "username": "usuario123",
    "email": "usuario@email.com",
    "avatar": "",
    "bio": "",
    "followers": [],
    "following": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Respuesta de error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [] // Solo en errores de validación
}
```

## 🗂️ Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # Configuración de MongoDB
│   ├── controllers/
│   │   └── authController.ts   # Controladores de autenticación
│   ├── middleware/
│   │   ├── auth.ts            # Middleware de autenticación JWT
│   │   └── errorHandler.ts    # Manejo global de errores
│   ├── models/
│   │   └── User.ts            # Modelo de usuario
│   ├── routes/
│   │   └── auth.ts            # Rutas de autenticación
│   ├── types/
│   │   └── auth.ts            # Tipos TypeScript
│   ├── utils/
│   │   └── validation.ts      # Validaciones con express-validator
│   └── index.ts               # Archivo principal del servidor
├── .env                       # Variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts disponibles

- `npm run dev` - Ejecutar en modo desarrollo con auto-reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar en modo producción
- `npm run build:watch` - Compilar en modo watch

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 12)
- JWT para autenticación segura
- Rate limiting para prevenir ataques de fuerza bruta
- Validación estricta de entrada de datos
- Headers de seguridad con Helmet
- CORS configurado para el frontend

## 🛡️ Validaciones

### Registro:
- Username: 3-20 caracteres, solo letras, números y guiones bajos
- Email: formato válido
- Password: mínimo 6 caracteres, debe contener al menos una mayúscula, una minúscula y un número

### Login:
- Email: formato válido
- Password: requerido

## 📝 Notas importantes

1. **MongoDB**: Asegúrate de tener MongoDB ejecutándose antes de iniciar el servidor
2. **JWT Secret**: Cambia la clave secreta en producción por una más segura
3. **CORS**: Configura la URL del frontend en las variables de entorno
4. **Rate Limiting**: Por defecto permite 100 requests por 15 minutos por IP

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
