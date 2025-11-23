# PWA Torneos - Sistema de Gestión de Torneos Deportivos

Sistema completo para la administración de torneos en deportes como aguas abiertas, natación, acuatlón, triatlón y atletismo. La aplicación permite la inscripción de atletas, registro de tiempos en tiempo real y visualización de resultados con actualización ágil y eficiente.

## 🚀 Características Principales

- ✅ **Aplicación Web Progresiva (PWA)**: Instalable y funcional offline
- ⚡ **Actualizaciones en Tiempo Real**: Socket.IO para registro y actualización de tiempos
- 🏆 **Visualización de Resultados**: Ganadores por categoría y generales
- 👥 **Gestión Completa**: Administración de torneos, eventos, categorías y atletas
- 📱 **Diseño Responsive**: Mobile-first, optimizado para todos los dispositivos
- 🔐 **Autenticación y Autorización**: JWT con roles de usuario y administrador
- 🧪 **Testing**: Pruebas unitarias con Jest

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18.2
- Vite 5.2
- React Router DOM 6.14
- Socket.IO Client 4.8
- Axios 1.4
- Jest & Testing Library

### Backend
- Node.js
- Express 4.18
- MySQL2 3.2
- Socket.IO 4.8
- JWT 9.0
- Bcrypt 5.1
- Helmet 7.1 (Seguridad)
- Express Validator 7.0

## 📋 Requisitos Previos

- Node.js 16+ y npm
- MySQL 8.0+
- Git

## 🔧 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd Proyecto-Torneo-main
```

### 2. Configurar Base de Datos

El sistema creará automáticamente la base de datos y ejecutará el seeder al iniciar el servidor.

**Opción Manual:**
```bash
# Conectarse a MySQL
mysql -u root -p

# Ejecutar el script de esquema
mysql -u root -p < backend/pwa_torneos_schema.sql

# (Opcional) Ejecutar seeder manualmente
mysql -u root -p pwa_torneos < backend/seed_data.sql
```

### 3. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=tu_contraseña
# DB_NAME=pwa_torneos
# JWT_SECRET=tu_secreto_jwt_muy_seguro
# PORT=3000
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env
# VITE_API_URL=http://localhost:3000
```

### 5. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# El servidor estará en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# La aplicación estará en http://localhost:5173
```

## 📱 Instalación como PWA

1. Abre la aplicación en tu navegador (Chrome, Edge, Safari)
2. Busca el ícono de "Instalar" en la barra de direcciones
3. Haz clic en "Instalar" para agregar la aplicación a tu dispositivo
4. La aplicación funcionará offline con funcionalidad limitada

## 🧪 Testing

```bash
cd frontend
npm test
```

## 📚 Estructura del Proyecto

```
Proyecto-Torneo-main/
├── backend/
│   ├── routes/          # Rutas de la API
│   │   ├── athletes.js
│   │   ├── events.js
│   │   ├── inscriptions.js
│   │   ├── results.js
│   │   └── tournaments.js
│   ├── scripts/         # Scripts de utilidad
│   │   └── init-db.js   # Inicialización automática de BD
│   ├── server.js         # Servidor principal
│   ├── pwa_torneos_schema.sql
│   └── seed_data.sql     # Seeder completo con todos los datos
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── context/         # Context API (Auth)
│   │   ├── views/           # Vistas principales
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── public/
│   ├── sw.js              # Service Worker
│   ├── manifest.json      # Manifest PWA
│   └── icons/             # Íconos de la PWA
└── README.md
```

## 🔐 Usuarios por Defecto

Después de ejecutar el seeder (automático o manual):

- **Admin**: `admin@uvm.edu` / `admin123`
- **Usuarios de prueba**: `juan.perez@email.com` / `password123` (y otros 8 usuarios)

## 📡 API Endpoints

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Torneos
- `GET /tournaments` - Listar todos los torneos
- `GET /tournaments/:id` - Obtener torneo por ID
- `POST /tournaments` - Crear torneo (Admin)
- `PUT /tournaments/:id` - Actualizar torneo (Admin)
- `DELETE /tournaments/:id` - Eliminar torneo (Admin)

### Eventos
- `GET /events?tournament_id=:id` - Listar eventos de un torneo
- `POST /events` - Crear evento (Admin)
- `PUT /events/:id` - Actualizar evento (Admin)
- `DELETE /events/:id` - Eliminar evento (Admin)

### Atletas
- `GET /athletes` - Listar todos los atletas
- `POST /athletes` - Crear atleta
- `PUT /athletes/:id` - Actualizar atleta
- `DELETE /athletes/:id` - Eliminar atleta

### Inscripciones
- `GET /inscriptions?event_id=:id&bib=:bib` - Listar inscripciones
- `POST /inscriptions` - Crear inscripción
- `PUT /inscriptions/:id` - Actualizar inscripción
- `DELETE /inscriptions/:id` - Eliminar inscripción

### Resultados
- `GET /results?event_id=:id` - Listar resultados de un evento
- `POST /results` - Registrar tiempo
- `PUT /results/:id` - Actualizar resultado
- `DELETE /results/:id` - Eliminar resultado

## 🔄 Socket.IO Events

- `result_updated` - Emitido cuando se registra o actualiza un resultado

## 🎨 Funcionalidades

### Panel de Administración
- Gestión completa de torneos
- Creación y edición de eventos
- Gestión de categorías
- Visualización de estadísticas

### Registro de Tiempos
- Registro en tiempo real
- Actualización automática vía Socket.IO
- Validación de dorsales
- Historial de tiempos registrados

### Visualización de Resultados
- Resultados por categoría
- Ganadores generales (top 3)
- Filtros por género y club
- Ordenamiento automático

## 🚀 Despliegue

### Backend (Producción)

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend (Producción)

```bash
cd frontend
npm run build
# Los archivos estarán en frontend/dist
```

## 📝 Licencia

Este proyecto es parte de un trabajo académico.

## 👥 Contribuidores

- Equipo de desarrollo del proyecto

## 📞 Soporte

Para problemas o preguntas, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para la gestión eficiente de torneos deportivos**
