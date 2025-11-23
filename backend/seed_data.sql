-- ============================================
-- SEEDER DE DATOS PARA PWA TORNEOS
-- Inserta datos de ejemplo en todas las tablas
-- ============================================

USE pwa_torneos;

-- Limpiar datos existentes (opcional, comentar si quieres mantener datos)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE results;
-- TRUNCATE TABLE inscriptions;
-- TRUNCATE TABLE athletes;
-- TRUNCATE TABLE events;
-- TRUNCATE TABLE tournaments;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. USUARIOS (users)
-- ============================================
-- Contraseñas:
-- Admin (id=1): admin123
-- Usuarios (id=2-10): password123
-- Nota: El admin se inserta primero. Si ya existe, se actualiza.
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'Administrador Principal', 'admin@uvm.edu', '$2b$10$g3IEBJ/9uNkaJEsGikxCKOfFfkWhLVE/pVJ96m8TkjD5jACG7Z67u', 'admin', NOW())
ON DUPLICATE KEY UPDATE 
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);

INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(2, 'Juan Pérez', 'juan.perez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(3, 'María González', 'maria.gonzalez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(4, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(5, 'Ana Martínez', 'ana.martinez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(6, 'Luis Fernández', 'luis.fernandez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(7, 'Laura Sánchez', 'laura.sanchez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(8, 'Pedro López', 'pedro.lopez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(9, 'Sofía Ramírez', 'sofia.ramirez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW()),
(10, 'Diego Torres', 'diego.torres@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', NOW());

-- ============================================
-- 2. TORNEOS (tournaments)
-- ============================================
INSERT INTO tournaments (id, name, sport, start_date, end_date, location, created_at) VALUES
(1, 'Copa Nacional de Aguas Abiertas 2024', 'Aguas Abiertas', '2024-11-15', '2024-11-17', 'Playa del Carmen, Quintana Roo', NOW()),
(2, 'Campeonato Regional de Natación', 'Natación', '2024-11-20', '2024-11-22', 'Centro Acuático Nacional, CDMX', NOW()),
(3, 'Triatlón del Valle de México', 'Triatlón', '2024-12-01', '2024-12-01', 'Valle de Bravo, Estado de México', NOW()),
(4, 'Maratón Acuático Internacional', 'Aguas Abiertas', '2024-12-10', '2024-12-12', 'Cancún, Quintana Roo', NOW()),
(5, 'Copa de Acuatlón 2024', 'Acuatlón', '2024-12-15', '2024-12-15', 'Ixtapa, Guerrero', NOW()),
(6, 'Campeonato de Atletismo Acuático', 'Atletismo', '2024-12-20', '2024-12-22', 'Estadio Olímpico, CDMX', NOW());

-- ============================================
-- 3. EVENTOS (events)
-- ============================================
-- Nota: La tabla events NO tiene columna created_at según el schema
INSERT INTO events (id, tournament_id, name, distance, category) VALUES
-- Eventos para Torneo 1: Copa Nacional de Aguas Abiertas
(1, 1, '5K Aguas Abiertas', '5 km', 'Abierta'),
(2, 1, '10K Aguas Abiertas', '10 km', 'Abierta'),
(3, 1, '5K Aguas Abiertas', '5 km', 'Juvenil (15-18 años)'),
(4, 1, '10K Aguas Abiertas', '10 km', 'Master (40+ años)'),

-- Eventos para Torneo 2: Campeonato Regional de Natación
(5, 2, '100m Libre', '100m', 'Masculino'),
(6, 2, '100m Libre', '100m', 'Femenino'),
(7, 2, '200m Libre', '200m', 'Masculino'),
(8, 2, '200m Libre', '200m', 'Femenino'),
(9, 2, '400m Libre', '400m', 'Masculino'),
(10, 2, '400m Libre', '400m', 'Femenino'),
(11, 2, '100m Espalda', '100m', 'Masculino'),
(12, 2, '100m Espalda', '100m', 'Femenino'),

-- Eventos para Torneo 3: Triatlón del Valle de México
(13, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Elite'),
(14, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Age Group 20-29'),
(15, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Age Group 30-39'),
(16, 3, 'Triatlón Olímpico', '1.5km nado, 40km bici, 10km carrera', 'Elite'),

-- Eventos para Torneo 4: Maratón Acuático Internacional
(17, 4, 'Maratón 10K', '10 km', 'Abierta'),
(18, 4, 'Maratón 25K', '25 km', 'Abierta'),

-- Eventos para Torneo 5: Copa de Acuatlón
(19, 5, 'Acuatlón Sprint', '750m nado, 5km carrera', 'Masculino'),
(20, 5, 'Acuatlón Sprint', '750m nado, 5km carrera', 'Femenino'),

-- Eventos para Torneo 6: Campeonato de Atletismo Acuático
(21, 6, '5K Carrera', '5 km', 'Masculino'),
(22, 6, '5K Carrera', '5 km', 'Femenino'),
(23, 6, '10K Carrera', '10 km', 'Masculino'),
(24, 6, '10K Carrera', '10 km', 'Femenino');

-- ============================================
-- 4. ATLETAS (athletes)
-- ============================================
-- Nota: La tabla athletes NO tiene columna created_at según el schema
INSERT INTO athletes (id, user_id, first_name, last_name, birthdate, gender, club) VALUES
(1, 2, 'Juan', 'Pérez', '1995-03-15', 'Masculino', 'Club Acuático México'),
(2, 3, 'María', 'González', '1998-07-22', 'Femenino', 'Nadadores Elite'),
(3, 4, 'Carlos', 'Rodríguez', '1992-11-08', 'Masculino', 'Aqua Sports Club'),
(4, 5, 'Ana', 'Martínez', '1996-05-30', 'Femenino', 'Club Acuático México'),
(5, 6, 'Luis', 'Fernández', '1994-09-12', 'Masculino', 'Nadadores Elite'),
(6, 7, 'Laura', 'Sánchez', '1999-01-25', 'Femenino', 'Aqua Sports Club'),
(7, 8, 'Pedro', 'López', '1991-12-18', 'Masculino', 'Club Acuático México'),
(8, 9, 'Sofía', 'Ramírez', '1997-06-05', 'Femenino', 'Nadadores Elite'),
(9, 10, 'Diego', 'Torres', '1993-08-20', 'Masculino', 'Aqua Sports Club'),
(10, NULL, 'Roberto', 'Hernández', '1990-04-14', 'Masculino', 'Club Acuático México'),
(11, NULL, 'Carmen', 'Díaz', '1995-10-28', 'Femenino', 'Nadadores Elite'),
(12, NULL, 'Fernando', 'Morales', '1998-02-11', 'Masculino', 'Aqua Sports Club'),
(13, NULL, 'Patricia', 'Jiménez', '1994-12-03', 'Femenino', 'Club Acuático México'),
(14, NULL, 'Ricardo', 'Vargas', '1996-07-19', 'Masculino', 'Nadadores Elite'),
(15, NULL, 'Gabriela', 'Castro', '1999-03-07', 'Femenino', 'Aqua Sports Club'),
(16, NULL, 'Miguel', 'Ortega', '1992-09-21', 'Masculino', 'Club Acuático México'),
(17, NULL, 'Isabel', 'Mendoza', '1997-05-16', 'Femenino', 'Nadadores Elite'),
(18, NULL, 'Javier', 'Ruiz', '1993-11-29', 'Masculino', 'Aqua Sports Club'),
(19, NULL, 'Elena', 'Moreno', '1995-08-04', 'Femenino', 'Club Acuático México'),
(20, NULL, 'Andrés', 'García', '1991-01-13', 'Masculino', 'Nadadores Elite');

-- ============================================
-- 5. INSCRIPCIONES (inscriptions)
-- ============================================
INSERT INTO inscriptions (id, athlete_id, event_id, bib, category, created_at) VALUES
-- Inscripciones para Torneo 1 (Aguas Abiertas)
(1, 1, 1, '101', 'Abierta', NOW()),
(2, 2, 1, '102', 'Abierta', NOW()),
(3, 3, 2, '201', 'Abierta', NOW()),
(4, 4, 2, '202', 'Abierta', NOW()),
(5, 5, 1, '103', 'Abierta', NOW()),
(6, 6, 3, '301', 'Juvenil (15-18 años)', NOW()),
(7, 7, 4, '401', 'Master (40+ años)', NOW()),

-- Inscripciones para Torneo 2 (Natación)
(8, 1, 5, '501', 'Masculino', NOW()),
(9, 2, 6, '601', 'Femenino', NOW()),
(10, 3, 7, '701', 'Masculino', NOW()),
(11, 4, 8, '801', 'Femenino', NOW()),
(12, 5, 9, '901', 'Masculino', NOW()),
(13, 6, 10, '1001', 'Femenino', NOW()),
(14, 7, 11, '1101', 'Masculino', NOW()),
(15, 8, 12, '1201', 'Femenino', NOW()),
(16, 9, 5, '502', 'Masculino', NOW()),
(17, 10, 6, '602', 'Femenino', NOW()),

-- Inscripciones para Torneo 3 (Triatlón)
(18, 1, 13, '1301', 'Elite', NOW()),
(19, 3, 13, '1302', 'Elite', NOW()),
(20, 5, 14, '1401', 'Age Group 20-29', NOW()),
(21, 7, 14, '1402', 'Age Group 20-29', NOW()),
(22, 9, 15, '1501', 'Age Group 30-39', NOW()),
(23, 2, 16, '1601', 'Elite', NOW()),
(24, 4, 16, '1602', 'Elite', NOW()),

-- Inscripciones para Torneo 4 (Maratón Acuático)
(25, 1, 17, '1701', 'Abierta', NOW()),
(26, 3, 17, '1702', 'Abierta', NOW()),
(27, 5, 18, '1801', 'Abierta', NOW()),
(28, 7, 18, '1802', 'Abierta', NOW()),

-- Inscripciones para Torneo 5 (Acuatlón)
(29, 1, 19, '1901', 'Masculino', NOW()),
(30, 3, 19, '1902', 'Masculino', NOW()),
(31, 2, 20, '2001', 'Femenino', NOW()),
(32, 4, 20, '2002', 'Femenino', NOW()),

-- Inscripciones para Torneo 6 (Atletismo)
(33, 1, 21, '2101', 'Masculino', NOW()),
(34, 3, 21, '2102', 'Masculino', NOW()),
(35, 5, 23, '2301', 'Masculino', NOW()),
(36, 2, 22, '2201', 'Femenino', NOW()),
(37, 4, 22, '2202', 'Femenino', NOW()),
(38, 6, 24, '2401', 'Femenino', NOW());

-- ============================================
-- 6. RESULTADOS (results)
-- ============================================
INSERT INTO results (id, inscription_id, event_id, time, position, recorded_by, recorded_at) VALUES
-- Resultados para Evento 1: 5K Aguas Abiertas
(1, 1, 1, '01:15:30', 1, 1, NOW() - INTERVAL 2 DAY),
(2, 2, 1, '01:18:45', 2, 1, NOW() - INTERVAL 2 DAY),
(3, 5, 1, '01:22:10', 3, 1, NOW() - INTERVAL 2 DAY),

-- Resultados para Evento 2: 10K Aguas Abiertas
(4, 3, 2, '02:35:20', 1, 1, NOW() - INTERVAL 1 DAY),
(5, 4, 2, '02:42:15', 2, 1, NOW() - INTERVAL 1 DAY),

-- Resultados para Evento 5: 100m Libre Masculino
(6, 8, 5, '00:52:30', 1, 1, NOW() - INTERVAL 3 HOUR),
(7, 16, 5, '00:54:15', 2, 1, NOW() - INTERVAL 3 HOUR),

-- Resultados para Evento 6: 100m Libre Femenino
(8, 9, 6, '00:58:45', 1, 1, NOW() - INTERVAL 2 HOUR),
(9, 17, 6, '01:00:20', 2, 1, NOW() - INTERVAL 2 HOUR),

-- Resultados para Evento 7: 200m Libre Masculino
(10, 10, 7, '01:52:10', 1, 1, NOW() - INTERVAL 1 HOUR),
(11, 8, 7, '01:55:30', 2, 1, NOW() - INTERVAL 1 HOUR),

-- Resultados para Evento 8: 200m Libre Femenino
(12, 11, 8, '02:05:25', 1, 1, NOW() - INTERVAL 30 MINUTE),
(13, 9, 8, '02:08:40', 2, 1, NOW() - INTERVAL 30 MINUTE),

-- Resultados para Evento 9: 400m Libre Masculino
(14, 12, 9, '04:15:50', 1, 1, NOW() - INTERVAL 15 MINUTE),
(15, 10, 9, '04:22:30', 2, 1, NOW() - INTERVAL 15 MINUTE),

-- Resultados para Evento 10: 400m Libre Femenino
(16, 13, 10, '04:35:20', 1, 1, NOW() - INTERVAL 10 MINUTE),
(17, 11, 10, '04:42:15', 2, 1, NOW() - INTERVAL 10 MINUTE),

-- Resultados para Evento 11: 100m Espalda Masculino
(18, 14, 11, '00:58:20', 1, 1, NOW() - INTERVAL 5 MINUTE),
(19, 16, 11, '01:00:45', 2, 1, NOW() - INTERVAL 5 MINUTE),

-- Resultados para Evento 12: 100m Espalda Femenino
(20, 15, 12, '01:05:30', 1, 1, NOW() - INTERVAL 2 MINUTE),
(21, 17, 12, '01:08:15', 2, 1, NOW() - INTERVAL 2 MINUTE),

-- Resultados para Evento 13: Triatlón Sprint Elite
(22, 18, 13, '01:15:30', 1, 1, NOW() - INTERVAL 1 DAY),
(23, 19, 13, '01:18:45', 2, 1, NOW() - INTERVAL 1 DAY),

-- Resultados para Evento 14: Triatlón Sprint Age Group 20-29
(24, 20, 14, '01:22:10', 1, 1, NOW() - INTERVAL 1 DAY),
(25, 21, 14, '01:25:30', 2, 1, NOW() - INTERVAL 1 DAY),

-- Resultados para Evento 15: Triatlón Sprint Age Group 30-39
(26, 22, 15, '01:28:45', 1, 1, NOW() - INTERVAL 1 DAY),

-- Resultados para Evento 16: Triatlón Olímpico Elite
(27, 23, 16, '02:15:20', 1, 1, NOW() - INTERVAL 1 DAY),
(28, 24, 16, '02:22:10', 2, 1, NOW() - INTERVAL 1 DAY),

-- Resultados para Evento 17: Maratón 10K
(29, 25, 17, '02:30:15', 1, 1, NOW() - INTERVAL 3 DAY),
(30, 26, 17, '02:35:40', 2, 1, NOW() - INTERVAL 3 DAY),

-- Resultados para Evento 18: Maratón 25K
(31, 27, 18, '06:15:30', 1, 1, NOW() - INTERVAL 3 DAY),
(32, 28, 18, '06:25:45', 2, 1, NOW() - INTERVAL 3 DAY),

-- Resultados para Evento 19: Acuatlón Sprint Masculino
(33, 29, 19, '00:35:20', 1, 1, NOW() - INTERVAL 5 DAY),
(34, 30, 19, '00:38:45', 2, 1, NOW() - INTERVAL 5 DAY),

-- Resultados para Evento 20: Acuatlón Sprint Femenino
(35, 31, 20, '00:40:15', 1, 1, NOW() - INTERVAL 5 DAY),
(36, 32, 20, '00:42:30', 2, 1, NOW() - INTERVAL 5 DAY),

-- Resultados para Evento 21: 5K Carrera Masculino
(37, 33, 21, '00:18:30', 1, 1, NOW() - INTERVAL 7 DAY),
(38, 34, 21, '00:19:45', 2, 1, NOW() - INTERVAL 7 DAY),

-- Resultados para Evento 22: 5K Carrera Femenino
(39, 36, 22, '00:20:15', 1, 1, NOW() - INTERVAL 7 DAY),
(40, 37, 22, '00:21:30', 2, 1, NOW() - INTERVAL 7 DAY),

-- Resultados para Evento 23: 10K Carrera Masculino
(41, 35, 23, '00:38:45', 1, 1, NOW() - INTERVAL 7 DAY),

-- Resultados para Evento 24: 10K Carrera Femenino
(42, 38, 24, '00:42:20', 1, 1, NOW() - INTERVAL 7 DAY);

-- ============================================
-- VERIFICACIÓN DE DATOS (comentado para evitar ejecución en init-db.js)
-- ============================================
-- SELECT 'Usuarios insertados:' as Info, COUNT(*) as Total FROM users
-- UNION ALL
-- SELECT 'Torneos insertados:', COUNT(*) FROM tournaments
-- UNION ALL
-- SELECT 'Eventos insertados:', COUNT(*) FROM events
-- UNION ALL
-- SELECT 'Atletas insertados:', COUNT(*) FROM athletes
-- UNION ALL
-- SELECT 'Inscripciones insertadas:', COUNT(*) FROM inscriptions
-- UNION ALL
-- SELECT 'Resultados insertados:', COUNT(*) FROM results;

