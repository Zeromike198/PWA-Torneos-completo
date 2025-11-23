-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 01:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pwa_torneos`
--

-- --------------------------------------------------------

--
-- Table structure for table `athletes`
--

CREATE TABLE `athletes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `club` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `athletes`
--

INSERT INTO `athletes` (`id`, `user_id`, `first_name`, `last_name`, `birthdate`, `gender`, `club`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `tournament_id` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `distance` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `tournament_id`, `name`, `distance`, `category`) VALUES
(1, 1, '5K Aguas Abiertas', '5 km', 'Abierta'),
(2, 1, '10K Aguas Abiertas', '10 km', 'Abierta'),
(3, 1, '5K Aguas Abiertas', '5 km', 'Juvenil (15-18 años)'),
(4, 1, '10K Aguas Abiertas', '10 km', 'Master (40+ años)'),
(5, 2, '100m Libre', '100m', 'Masculino'),
(6, 2, '100m Libre', '100m', 'Femenino'),
(7, 2, '200m Libre', '200m', 'Masculino'),
(8, 2, '200m Libre', '200m', 'Femenino'),
(9, 2, '400m Libre', '400m', 'Masculino'),
(10, 2, '400m Libre', '400m', 'Femenino'),
(11, 2, '100m Espalda', '100m', 'Masculino'),
(12, 2, '100m Espalda', '100m', 'Femenino'),
(13, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Elite'),
(14, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Age Group 20-29'),
(15, 3, 'Triatlón Sprint', '750m nado, 20km bici, 5km carrera', 'Age Group 30-39'),
(16, 3, 'Triatlón Olímpico', '1.5km nado, 40km bici, 10km carrera', 'Elite'),
(17, 4, 'Maratón 10K', '10 km', 'Abierta'),
(18, 4, 'Maratón 25K', '25 km', 'Abierta'),
(19, 5, 'Acuatlón Sprint', '750m nado, 5km carrera', 'Masculino'),
(20, 5, 'Acuatlón Sprint', '750m nado, 5km carrera', 'Femenino'),
(21, 6, '5K Carrera', '5 km', 'Masculino'),
(22, 6, '5K Carrera', '5 km', 'Femenino'),
(23, 6, '10K Carrera', '10 km', 'Masculino'),
(24, 6, '10K Carrera', '10 km', 'Femenino');

-- --------------------------------------------------------

--
-- Table structure for table `inscriptions`
--

CREATE TABLE `inscriptions` (
  `id` int(11) NOT NULL,
  `athlete_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `bib` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inscriptions`
--

INSERT INTO `inscriptions` (`id`, `athlete_id`, `event_id`, `bib`, `category`, `created_at`) VALUES
(1, 1, 1, '101', 'Abierta', '2025-11-22 22:48:54'),
(2, 2, 1, '102', 'Abierta', '2025-11-22 22:48:54'),
(3, 3, 2, '201', 'Abierta', '2025-11-22 22:48:54'),
(4, 4, 2, '202', 'Abierta', '2025-11-22 22:48:54'),
(5, 5, 1, '103', 'Abierta', '2025-11-22 22:48:54'),
(6, 6, 3, '301', 'Juvenil (15-18 años)', '2025-11-22 22:48:54'),
(7, 7, 4, '401', 'Master (40+ años)', '2025-11-22 22:48:54'),
(8, 1, 5, '501', 'Masculino', '2025-11-22 22:48:54'),
(9, 2, 6, '601', 'Femenino', '2025-11-22 22:48:54'),
(10, 3, 7, '701', 'Masculino', '2025-11-22 22:48:54'),
(11, 4, 8, '801', 'Femenino', '2025-11-22 22:48:54'),
(12, 5, 9, '901', 'Masculino', '2025-11-22 22:48:54'),
(13, 6, 10, '1001', 'Femenino', '2025-11-22 22:48:54'),
(14, 7, 11, '1101', 'Masculino', '2025-11-22 22:48:54'),
(15, 8, 12, '1201', 'Femenino', '2025-11-22 22:48:54'),
(16, 9, 5, '502', 'Masculino', '2025-11-22 22:48:54'),
(17, 10, 6, '602', 'Femenino', '2025-11-22 22:48:54'),
(18, 1, 13, '1301', 'Elite', '2025-11-22 22:48:54'),
(19, 3, 13, '1302', 'Elite', '2025-11-22 22:48:54'),
(20, 5, 14, '1401', 'Age Group 20-29', '2025-11-22 22:48:54'),
(21, 7, 14, '1402', 'Age Group 20-29', '2025-11-22 22:48:54'),
(22, 9, 15, '1501', 'Age Group 30-39', '2025-11-22 22:48:54'),
(23, 2, 16, '1601', 'Elite', '2025-11-22 22:48:54'),
(24, 4, 16, '1602', 'Elite', '2025-11-22 22:48:54'),
(25, 1, 17, '1701', 'Abierta', '2025-11-22 22:48:54'),
(26, 3, 17, '1702', 'Abierta', '2025-11-22 22:48:54'),
(27, 5, 18, '1801', 'Abierta', '2025-11-22 22:48:54'),
(28, 7, 18, '1802', 'Abierta', '2025-11-22 22:48:54'),
(29, 1, 19, '1901', 'Masculino', '2025-11-22 22:48:54'),
(30, 3, 19, '1902', 'Masculino', '2025-11-22 22:48:54'),
(31, 2, 20, '2001', 'Femenino', '2025-11-22 22:48:54'),
(32, 4, 20, '2002', 'Femenino', '2025-11-22 22:48:54'),
(33, 1, 21, '2101', 'Masculino', '2025-11-22 22:48:54'),
(34, 3, 21, '2102', 'Masculino', '2025-11-22 22:48:54'),
(35, 5, 23, '2301', 'Masculino', '2025-11-22 22:48:54'),
(36, 2, 22, '2201', 'Femenino', '2025-11-22 22:48:54'),
(37, 4, 22, '2202', 'Femenino', '2025-11-22 22:48:54'),
(38, 6, 24, '2401', 'Femenino', '2025-11-22 22:48:54'),
(39, 15, 2, '0203', NULL, '2025-11-22 22:53:29'),
(40, 4, 17, '1703', NULL, '2025-11-22 23:16:22'),
(41, 17, 17, '1704', NULL, '2025-11-22 23:16:24');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `id` int(11) NOT NULL,
  `inscription_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`id`, `inscription_id`, `event_id`, `time`, `position`, `recorded_by`, `recorded_at`) VALUES
(1, 1, 1, '01:15:30', 1, 1, '2025-11-20 22:48:54'),
(2, 2, 1, '01:18:45', 2, 1, '2025-11-20 22:48:54'),
(3, 5, 1, '01:22:10', 3, 1, '2025-11-20 22:48:54'),
(4, 3, 2, '02:35:20', 1, 1, '2025-11-21 22:48:54'),
(5, 4, 2, '02:42:15', 2, 1, '2025-11-21 22:48:54'),
(6, 8, 5, '00:52:30', 1, 1, '2025-11-22 19:48:54'),
(7, 16, 5, '00:54:15', 2, 1, '2025-11-22 19:48:54'),
(8, 9, 6, '00:58:45', 1, 1, '2025-11-22 20:48:54'),
(9, 17, 6, '01:00:20', 2, 1, '2025-11-22 20:48:54'),
(10, 10, 7, '01:52:10', 1, 1, '2025-11-22 21:48:54'),
(11, 8, 7, '01:55:30', 2, 1, '2025-11-22 21:48:54'),
(12, 11, 8, '02:05:25', 1, 1, '2025-11-22 22:18:54'),
(13, 9, 8, '02:08:40', 2, 1, '2025-11-22 22:18:54'),
(14, 12, 9, '04:15:50', 1, 1, '2025-11-22 22:33:54'),
(15, 10, 9, '04:22:30', 2, 1, '2025-11-22 22:33:54'),
(16, 13, 10, '04:35:20', 1, 1, '2025-11-22 22:38:54'),
(17, 11, 10, '04:42:15', 2, 1, '2025-11-22 22:38:54'),
(18, 14, 11, '00:58:20', 1, 1, '2025-11-22 22:43:54'),
(19, 16, 11, '01:00:45', 2, 1, '2025-11-22 22:43:54'),
(20, 15, 12, '01:05:30', 1, 1, '2025-11-22 22:46:54'),
(21, 17, 12, '01:08:15', 2, 1, '2025-11-22 22:46:54'),
(22, 18, 13, '01:15:30', 1, 1, '2025-11-21 22:48:54'),
(23, 19, 13, '01:18:45', 2, 1, '2025-11-21 22:48:54'),
(24, 20, 14, '01:22:10', 1, 1, '2025-11-21 22:48:54'),
(25, 21, 14, '01:25:30', 2, 1, '2025-11-21 22:48:54'),
(26, 22, 15, '01:28:45', 1, 1, '2025-11-21 22:48:54'),
(27, 23, 16, '02:15:20', 1, 1, '2025-11-21 22:48:54'),
(28, 24, 16, '02:22:10', 2, 1, '2025-11-21 22:48:54'),
(29, 25, 17, '02:30:15', 1, 1, '2025-11-19 22:48:54'),
(30, 26, 17, '02:35:40', 2, 1, '2025-11-19 22:48:54'),
(31, 27, 18, '06:15:30', 1, 1, '2025-11-19 22:48:54'),
(32, 28, 18, '06:25:45', 2, 1, '2025-11-19 22:48:54'),
(33, 29, 19, '00:35:20', 1, 1, '2025-11-17 22:48:54'),
(34, 30, 19, '00:38:45', 2, 1, '2025-11-17 22:48:54'),
(35, 31, 20, '00:40:15', 1, 1, '2025-11-17 22:48:54'),
(36, 32, 20, '00:42:30', 2, 1, '2025-11-17 22:48:54'),
(37, 33, 21, '00:18:30', 1, 1, '2025-11-15 22:48:54'),
(38, 34, 21, '00:19:45', 2, 1, '2025-11-15 22:48:54'),
(39, 36, 22, '00:20:15', 1, 1, '2025-11-15 22:48:54'),
(40, 37, 22, '00:21:30', 2, 1, '2025-11-15 22:48:54'),
(41, 35, 23, '00:38:45', 1, 1, '2025-11-15 22:48:54'),
(42, 38, 24, '00:42:20', 1, 1, '2025-11-15 22:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `tournaments`
--

CREATE TABLE `tournaments` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `sport` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tournaments`
--

INSERT INTO `tournaments` (`id`, `name`, `sport`, `start_date`, `end_date`, `location`, `created_at`) VALUES
(1, 'Copa Nacional de Aguas Abiertas 2024', 'Aguas Abiertas', '2024-11-15', '2024-11-17', 'Playa del Carmen, Quintana Roo', '2025-11-22 22:48:54'),
(2, 'Campeonato Regional de Natación', 'Natación', '2024-11-20', '2024-11-22', 'Centro Acuático Nacional, CDMX', '2025-11-22 22:48:54'),
(3, 'Triatlón del Valle de México', 'Triatlón', '2024-12-01', '2024-12-01', 'Valle de Bravo, Estado de México', '2025-11-22 22:48:54'),
(4, 'Maratón Acuático Internacional', 'Aguas Abiertas', '2024-12-10', '2024-12-12', 'Cancún, Quintana Roo', '2025-11-22 22:48:54'),
(5, 'Copa de Acuatlón 2024', 'Acuatlón', '2024-12-15', '2024-12-15', 'Ixtapa, Guerrero', '2025-11-22 22:48:54'),
(6, 'Campeonato de Atletismo Acuático', 'Atletismo', '2024-12-20', '2024-12-22', 'Estadio Olímpico, CDMX', '2025-11-22 22:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Administrador Principal', 'admin@uvm.edu', '$2b$10$g3IEBJ/9uNkaJEsGikxCKOfFfkWhLVE/pVJ96m8TkjD5jACG7Z67u', 'admin', '2025-11-22 22:48:54'),
(2, 'Juan Pérez', 'juan.perez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(3, 'María González', 'maria.gonzalez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(4, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(5, 'Ana Martínez', 'ana.martinez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(6, 'Luis Fernández', 'luis.fernandez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(7, 'Laura Sánchez', 'laura.sanchez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(8, 'Pedro López', 'pedro.lopez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(9, 'Sofía Ramírez', 'sofia.ramirez@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54'),
(10, 'Diego Torres', 'diego.torres@email.com', '$2b$10$gdwYKaMx3IX7Ym9vTchckeQFuH7xV7wiDk7nb82KVQqqLLDpSMqhS', 'user', '2025-11-22 22:48:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `athletes`
--
ALTER TABLE `athletes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tournament_id` (`tournament_id`);

--
-- Indexes for table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `athlete_id` (`athlete_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inscription_id` (`inscription_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `tournaments`
--
ALTER TABLE `tournaments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `athletes`
--
ALTER TABLE `athletes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `inscriptions`
--
ALTER TABLE `inscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tournaments`
--
ALTER TABLE `tournaments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `athletes`
--
ALTER TABLE `athletes`
  ADD CONSTRAINT `athletes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `inscriptions_ibfk_1` FOREIGN KEY (`athlete_id`) REFERENCES `athletes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inscriptions_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`inscription_id`) REFERENCES `inscriptions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
