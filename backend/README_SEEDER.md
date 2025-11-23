# Seeder de Datos - PWA Torneos

Este archivo contiene datos de ejemplo para poblar la base de datos con información de prueba.

## Contenido del Seeder

El archivo `seed_data.sql` incluye:

- **10 Usuarios**: 1 administrador y 9 usuarios regulares
- **6 Torneos**: Diferentes deportes (Aguas Abiertas, Natación, Triatlón, Acuatlón, Atletismo)
- **24 Eventos**: Distribuidos entre los diferentes torneos
- **20 Atletas**: Con información completa
- **38 Inscripciones**: Atletas inscritos en diferentes eventos
- **42 Resultados**: Tiempos registrados para diferentes eventos

## Cómo Usar

El seeder se ejecuta automáticamente cuando inicias el servidor con `npm run dev` si la base de datos está vacía.

### Ejecución Manual

#### Opción 1: Ejecutar directamente
```bash
mysql -u root -p < backend/seed_data.sql
```

#### Opción 2: Desde MySQL
```sql
source backend/seed_data.sql;
```

#### Opción 3: Solo si la BD ya existe
```bash
mysql -u root -p pwa_torneos < backend/seed_data.sql
```

#### Opción 4: Usando el script de Node.js
```bash
cd backend
npm run seed
```

## Credenciales de Prueba

### Administrador
- **Email**: `admin@uvm.edu`
- **Contraseña**: `admin123`
- **Rol**: Administrador (acceso completo al dashboard)

### Usuarios Regulares
- **Email**: `juan.perez@email.com` (y otros usuarios del 2 al 10)
- **Contraseña**: `password123`
- **Rol**: Usuario (pueden inscribirse y ver resultados)

## Notas Importantes

1. **IDs Fijos**: El seeder usa IDs específicos para mantener relaciones. Si ya tienes datos, puede haber conflictos.

2. **Limpiar Datos**: Si quieres limpiar datos existentes antes de insertar, descomenta las líneas al inicio del archivo:
```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE results;
-- ... etc
SET FOREIGN_KEY_CHECKS = 1;
```

3. **Contraseñas**: Todas las contraseñas están hasheadas con bcrypt. Los usuarios regulares usan `password123` y el admin usa `admin123`.

4. **Fechas**: Los resultados tienen fechas relativas (NOW() - INTERVAL X) para simular eventos recientes.

## Estructura de Datos

### Torneos Incluidos
1. Copa Nacional de Aguas Abiertas 2024
2. Campeonato Regional de Natación
3. Triatlón del Valle de México
4. Maratón Acuático Internacional
5. Copa de Acuatlón 2024
6. Campeonato de Atletismo Acuático

### Eventos por Tipo
- **Aguas Abiertas**: 5K, 10K con diferentes categorías
- **Natación**: 100m, 200m, 400m Libre y Espalda
- **Triatlón**: Sprint y Olímpico con categorías por edad
- **Acuatlón**: Sprint masculino y femenino
- **Atletismo**: 5K y 10K carrera

## Verificación

Al final del script se ejecuta una consulta que muestra el total de registros insertados en cada tabla.

