Wireframes (estructura en texto) — PWA Torneos
=============================================

Nota: Estos wireframes están diseñados como esquemas (sin estilo visual),
para documentar la estructura de la interfaz y la ubicación de elementos.

1) Home (usuario público)
-------------------------
HEADER
[Logo]    [Inicio] [Resultados] [Login]

HERO
----------------------------------------
| Gestión de torneos                     |
| Gestiona tus torneos (titulo)           |
| [Ver resultados]  [Iniciar sesión]     |
----------------------------------------

CARACTERÍSTICAS (grid)
- Tiempo real  | - PWA instalado  | - Offline
- Resultados   | - Gestión        | - Instalable

TORNEOS RECIENTES (cards)
- Copa Aquathlon 2024
- Maratón Acuático Internacional
- Triatlón Valle México
- Campeonato Regional de Natación
- Copa Nacional Aguas 2024

FOOTER
Contacto | Sobre | Licencia

2) Resultados (público)
------------------------
HEADER (mismo)
FILTROS:
[Seleccionar Torneo] [Categoria] [Genero: M/F/X] [Buscar por nombre]

RESULTS LIST
- Carrera: 10K Masculino
  1. Luis Fernández — 00:35:12
  2. ...

BOTON: Ver todos los resultados (público)

3) Login
--------
HEADER
FORM
[ Email ] 
[ Password ]
[ Iniciar sesión ]

Si login exitoso → redirigir a Dashboard (admin)

4) Dashboard (admin)
--------------------
SIDEBAR:
- Dashboard (home)
- Torneos
- Atletas
- Inscripciones
- Tiempos
- Resultados
- Cerrar sesión

MAIN:
CARDS:
- Total Torneos
- Total Atletas
- Inscripciones hoy
- Eventos activos

LISTADO RÁPIDO: Torneos recientes + acciones (Editar / Eliminar)

5) Atletas (admin)
------------------
[ Botón: Registrar nuevo atleta ]
TABLE:
| Dorsal | Nombre completo | Club | Género | Categoría | Acciones (Editar/Borrar) |

6) Inscripciones (admin)
------------------------
FORM:
- Seleccionar Torneo
- Seleccionar Atleta
- Categoría
- Dorsal (opcional)
- Botón: Inscribir

TABLE: list of registrations (with status)

7) Registro de tiempos (admin / cronometrista)
----------------------------------------------
SELECT: Torneo → Evento → Serie
INPUT: Dorsal o Select Atleta
CONTROLES: [Start] [Stop] [Registrar manualmente]
LOG: Lista de tiempos enviados en la sesión (en vivo)

Observaciones:
- Los wireframes están diseñados para facilitar la implementación responsive (mobile-first).
- Componentes clave: formularios normalizados, tablas paginadas, filtros en tiempo real.