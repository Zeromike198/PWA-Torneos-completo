PWA Torneos — Documento SCRUM (Completo y profesional)

Proyecto: PWA Torneos
Autor: Estudiante
Fecha: 2025-11-22

Resumen ejecutivo
-----------------
PWA Torneos es una Aplicación Web Progresiva (PWA) desarrollada con React y Vite en el frontend,
Node.js y Express en el backend y MySQL como base de datos. Permite gestionar torneos deportivos,
registrar inscripciones de atletas, captura de tiempos en vivo y visualización de resultados por
categoría y generales. El propósito del presente documento es dejar evidencia clara de la metodología
ágil (SCRUM) aplicada al proyecto, incluyendo roles, product backlog, sprint planning, artefactos y
ceremonias.

1. Metodología y marco de trabajo
---------------------------------
Se implementó SCRUM adaptado a desarrollo individual (autor asume todos los roles).
SCRUM es un marco ágil de gestión iterativa que facilita entregas incrementales y la mejora continua.

Roles (proyecto individual)
- Product Owner: [Autor] — define objetivos, prioridades, recibe la entrega.
- Scrum Master: [Autor] — facilita el proceso, elimina impedimentos.
- Development Team: [Autor] — desarrolla frontend, backend, BD, pruebas.
- QA (role implícito): [Autor] — ejecuta pruebas unitarias y de endpoints.

Nota: En proyectos académicos con desarrollador único, es válido asignar todos los roles a la misma persona;
se documenta el cumplimiento de cada función en las secciones de actividades y evidencias.

2. Artefactos
-------------
- Product Backlog: lista priorizada de historias de usuario (ver sección 4).
- Sprint Backlog: tareas planificadas por sprint (ver sección 6).
- Incremento: versión ejecutable con frontend y backend integrados, base de datos con esquema SQL.
- Definition of Done (DoD): cada historia se considera "Done" cuando:
  * Código implementado y revisado localmente
  * Tests unitarios básicos ejecutados (si aplica)
  * Documentación mínima asociada (API, manual de usuario)
  * Integración con la base de datos y verificación de queries principales
  * Demostración funcional en local (capturas / video opcional)

3. Ceremonias
-------------
- Sprint Planning: definición de alcance del sprint y tareas.
- Daily Scrum: registro de progreso diario (en proyecto individual, se realiza anotación diaria).
- Sprint Review: demostración del incremento y recopilación de feedback (documentado en entregas).
- Sprint Retrospective: análisis de mejoras para el siguiente sprint.

4. Product Backlog (Historias de Usuario priorizadas)
----------------------------------------------------
Formato: ID — Título — Como / Quiero / Para — Prioridad — Est. (story points) — Criterios de Aceptación

HU-01 — Autenticación (Registro/Login)
Como: usuario/administrador
Quiero: poder registrarme e iniciar sesión
Para: acceder a las áreas protegidas (dashboard, inscripciones)
Prioridad: Alta — Est: 5
Criterios:
- Registro con email y contraseña.
- Inicio de sesión con JWT.
- Rutas protegidas en backend.

HU-02 — Dashboard administrativo
Como: administrador
Quiero: ver indicadores y acceso rápido a gestión de torneos
Para: supervisar el estado del sistema
Prioridad: Alta — Est: 8
Criterios:
- Cards con totales (atletas, torneos, inscripciones).
- Enlace a secciones de gestión.

HU-03 — Gestión de torneos (CRUD)
Como: administrador
Quiero: crear, editar y eliminar torneos
Para: administrar competencias disponibles
Prioridad: Alta — Est: 5
Criterios:
- Formulario para crear torneo (nombre, deporte, fecha inicio/fin).
- Listado editable y eliminable.

HU-04 — Gestión de atletas
Como: administrador
Quiero: registrar, editar y listar atletas
Para: inscribirlos en competencias
Prioridad: Alta — Est: 5
Criterios:
- Formulario: nombre, apellido, club, género, fecha de nacimiento.
- Listado con búsqueda por nombre o dorsal.

HU-05 — Inscripciones
Como: administrador / usuario
Quiero: inscribir atletas en un torneo y categoría
Para: que puedan competir y registrar tiempos
Prioridad: Alta — Est: 5
Criterios:
- Registro de inscripción con referencia a atleta y torneo.
- Estado: registered, checked-in, cancelled.

HU-06 — Registro de tiempos en vivo
Como: cronometrista
Quiero: capturar y enviar tiempos en tiempo real
Para: actualizar resultados de manera inmediata
Prioridad: Alta — Est: 13
Criterios:
- Uso de socket.io para envío de tiempos.
- Endpoint para recepción de marcas y almacenamiento.

HU-07 — Resultados y filtrado
Como: usuario público / admin
Quiero: ver resultados por torneo y por categoría
Para: consultar ganadores y tiempos
Prioridad: Alta — Est: 5
Criterios:
- Filtrado por torneo, categoría, género y búsqueda por atleta.

HU-08 — PWA (instalación y offline)
Como: usuario
Quiero: instalar la aplicación en el dispositivo
Para: usarla incluso con conectividad limitada
Prioridad: Media — Est: 8
Criterios:
- manifest.json y service worker mínimos.
- Caching para páginas críticas.

HU-09 — Seguridad básica
Como: administrador
Quiero: protección de endpoints
Para: asegurar datos sensible
Prioridad: Alta — Est: 5
Criterios:
- Validaciones de inputs, uso de JWT.

(Se pueden ampliar las historias con sub-tareas y tests específicos.)

5. Priorización y estrategia MoSCoW
-----------------------------------
- Must: Autenticación, Gestión torneos, Inscripciones, Registro tiempos, Resultados.
- Should: Dashboard, PWA, Seguridad.
- Could: Export CSV, Reportes avanzados.
- Won't (por ahora): Integración con pasarelas de pago, pagos en línea.

6. Sprint Planning (Propuesta: 2 sprints)
-----------------------------------------
Duración sugerida: 2 semanas por sprint (ajustable).

Sprint 1 — Objetivo: Entorno preparado, autenticación, estructura, vistas públicas
Tareas (ejemplos con estimaciones):
- Configuración Vite + React — 1 día
- Estructura backend (Express, env) — 1 día
- Conexión a MySQL y modelos iniciales — 1 día
- Implementación login/register — 2 días
- Home y Resultados (vistas públicas) — 2 días
- Wireframes y diagrama de BD inicial — 1.5 días
- Documentación SCRUM inicial — 1 día

Sprint 2 — Objetivo: Funcionalidad completa y PWA
Tareas:
- CRUD torneos y atletas — 3 días
- Inscripciones y gestión — 2 días
- Registro de tiempos (sockets) — 3 días
- Dashboard y vistas admin — 2 días
- PWA: manifest + sw.js básico — 1 día
- Tests unitarios y endpoints (básicos) — 1.5 días
- Preparación de manuales y entrega final — 1 día

7. Reporting y evidencias
-------------------------
Evidencias a incluir en la entrega:
- Documento SCRUM (este documento)
- Product backlog exportado (CSV / Markdown)
- Sprint backlog
- Wireframes (texto o imagen)
- Diagrama ER (texto / SQL)
- Manual técnico y manual de usuario
- Archivo SQL para la base de datos
- Capturas y/o video demo (opcional)

8. Riesgos y acciones de mitigación
-----------------------------------
- Riesgo: falta de tiempo para integrar sockets → Mitigación: priorizar registro manual de tiempos como fallback.
- Riesgo: errores en import SQL → Mitigación: entregar script SQL limpio sin DROP DATABASE y con CREATE TABLE.

9. Conclusión
-------------
Este documento cumple la evidencia de metodología ágil solicitada: roles, backlog, sprints, planificación,
artefactos y criterios de aceptación. Está diseñado para acompañar la entrega técnica y cubrir las observaciones
indicadas por el profesor.