# Backend - PWA Torneos

Servidor Node.js/Express con MySQL para la gestión de torneos deportivos.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (.env):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=pwa_torneos
JWT_SECRET=tu_secreto_jwt_muy_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
```

3. Crear la base de datos:
```bash
mysql -u root -p < pwa_torneos_schema.sql
```

4. (Opcional) Ejecutar seeder manualmente:
```bash
mysql -u root -p pwa_torneos < seed_data.sql
# O usar el script de Node.js:
npm run seed
```

**Nota**: El seeder se ejecuta automáticamente al iniciar el servidor si la BD está vacía.

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Seguridad

- Helmet para headers de seguridad
- JWT para autenticación
- Bcrypt para hash de contraseñas
- Validación de datos en endpoints
- Protección contra inyección SQL (prepared statements)

## Endpoints

Ver documentación completa en el README principal.

## Socket.IO

El servidor incluye Socket.IO para actualizaciones en tiempo real:
- Evento `result_updated`: Se emite cuando se registra o actualiza un resultado

