Manual Técnico — PWA Torneos
Formato: Detallado (para entrega académica, estilo profesional)

1. Introducción
PWA Torneos es una aplicación para gestión de competiciones deportivas con...
(Documento extenso resumido aquí; el ZIP contiene la versión completa en markdown.)

2. Requisitos del sistema
- Node.js >= 16
- npm o yarn
- MySQL 8
- Git
- Navegador moderno (soporte PWA)

3. Estructura del proyecto (sugerida)
- /frontend (Vite + React)
  - src/
    - components/
    - pages/
    - services/
    - hooks/
- /backend (Node/Express)
  - src/
    - controllers/
    - routes/
    - models/
    - services/
- /scripts (DB)
- /public (manifest, sw.js, icons)

4. Variables de entorno (ejemplo .env)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=pwa_torneos
JWT_SECRET=un_secret
PORT=3000

5. API — Endpoints principales (resumen)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/tournaments
- POST /api/tournaments
- GET /api/tournaments/:id/registrations
- POST /api/registrations
- POST /api/times
(Ver 08_OpenAPI.yaml para especificación)

6. Despliegue
- Build frontend: npm run build
- Ejecutar backend: pm2 start dist/index.js --name pwa-torneos
- Configurar Nginx para servir frontend estático y proxy a backend.

7. Mantenimiento y backups
- Backup periódico de la base de datos (mysqldump)
- Versionado en Git con ramas: main, develop, feature/*

8. Anexos
- Script SQL incluido: scripts/pwa_torneos_schema.sql