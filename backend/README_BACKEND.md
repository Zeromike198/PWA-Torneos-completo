# Backend - PWA Torneos

## Requisitos
- Node.js >= 18
- MySQL server

## Instalación
1. Copiar `.env.example` a `.env` y configurar variables.
2. Crear la base de datos y tablas:
   - mysql -u root -p < pwa_torneos_schema.sql
3. Instalar dependencias:
   - npm install
4. Ejecutar server:
   - npm run start

## Endpoints
- POST /auth/register
- POST /auth/login
- GET /users (protected)
- CRUD /tournaments
- /athletes, /inscriptions, /results