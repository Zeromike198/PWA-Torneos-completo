# Frontend - PWA Torneos

Aplicación React con Vite, diseñada como PWA (Progressive Web App).

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (.env):
```
VITE_API_URL=http://localhost:3000
```

## Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm run preview
```

## Testing

```bash
npm test
```

## PWA

La aplicación está configurada como PWA:
- Service Worker en `/public/sw.js`
- Manifest en `/public/manifest.json`
- Funcionalidad offline básica
- Instalable en dispositivos móviles y desktop

## Estructura

- `src/views/` - Vistas principales
- `src/components/` - Componentes reutilizables
- `src/context/` - Context API (Autenticación)
- `src/styles.css` - Estilos globales

## Características

- Diseño responsive mobile-first
- Actualizaciones en tiempo real con Socket.IO
- Autenticación con JWT
- Rutas protegidas
- Service Worker para funcionalidad offline

