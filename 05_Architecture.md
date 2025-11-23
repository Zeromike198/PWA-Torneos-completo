Arquitectura del sistema — PWA Torneos

Resumen
-------
La arquitectura está planteada en tres capas principales:
1. Presentación (Frontend) — React + Vite (PWA)
2. Lógica de negocio (Backend) — Node.js + Express
3. Persistencia (Base de datos) — MySQL

Componentes y flujo de datos
---------------------------
1. Usuario (navegador)
   - Interactúa con la PWA (React).
   - Realiza peticiones HTTP a la API o recibe eventos via socket.io.

2. Frontend (React + Vite)
   - Rutas públicas: /, /results, /login
   - Rutas privadas: /dashboard, /athletes, /registrations, /times
   - Manejo de estado local y consumo de API REST.
   - Uso de Service Worker (sw.js) y manifest.json para PWA.

3. Backend (Node.js / Express)
   - Endpoints REST para autenticación y CRUD.
   - Socket.io server para actualización de tiempos en vivo.
   - Validación de entrada y protección con JWT.

4. MySQL
   - Almacena usuarios, torneos, atletas, inscripciones, eventos y tiempos.
   - Scripts SQL de creación incluidos.

Diagrama lógico (texto)
[Usuario] -> [Frontend React (PWA)] -> [API REST Node/Express + socket.io] -> [MySQL]

Seguridad y despliegue
---------------------
- Autenticación con JWT. Tokens enviados en header Authorization: Bearer <token>.
- Validación de inputs en backend (sanitize / prepared statements).
- Recomendación de despliegue: servidor Linux, PM2 para proceso Node, Nginx como reverse proxy y SSL (Let's Encrypt).