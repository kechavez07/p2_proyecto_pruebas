# Configuración para Clever Cloud

## Variables de entorno requeridas en Clever Cloud:

### Base de datos
- `DB_HOST`: Host de tu base de datos MySQL de Clever Cloud
- `DB_PORT`: Puerto (generalmente 3306)
- `DB_NAME`: Nombre de tu base de datos
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos

### Aplicación
- `PORT`: Puerto donde correrá la aplicación (Clever Cloud lo asigna automáticamente)
- `NODE_ENV`: production
- `JWT_SECRET`: Tu clave secreta para JWT
- `JWT_EXPIRES_IN`: 7d
- `FRONTEND_URL`: URL de tu frontend en producción

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS`: 900000
- `RATE_LIMIT_MAX`: 100

## Pasos para configurar en Clever Cloud:

1. **Crear aplicación Node.js** en Clever Cloud
2. **Crear base de datos MySQL** en Clever Cloud  
3. **Configurar variables de entorno** en el panel de Clever Cloud
4. **Conectar repositorio Git** para deployment automático
5. **Configurar el dominio** para tu API

## Scripts de build para Clever Cloud:

El proyecto ya está configurado con los scripts necesarios:
- `npm run build`: Compila TypeScript a JavaScript
- `npm start`: Inicia la aplicación en producción

## Notas importantes:

- Clever Cloud ejecutará automáticamente `npm install` y `npm run build`
- La aplicación se iniciará con `npm start`
- Las conexiones a la base de datos usan SSL automáticamente en producción
- Los logs estarán disponibles en el panel de Clever Cloud
