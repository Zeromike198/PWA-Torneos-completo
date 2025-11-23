-- pwa_torneos_final.sql
-- Importable MySQL script for PWA Torneos (Fase 1)
DROP DATABASE IF EXISTS pwa_torneos;
CREATE DATABASE pwa_torneos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pwa_torneos;

-- Users table (demo passwords in plain text for evaluation)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_raw VARCHAR(255) NOT NULL,
  role ENUM('admin','official','coach','athlete') DEFAULT 'official',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Athletes table
CREATE TABLE IF NOT EXISTS athletes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  dob DATE,
  sex ENUM('M','F','Other') DEFAULT 'M',
  country VARCHAR(120),
  category VARCHAR(80),
  club VARCHAR(150),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  discipline VARCHAR(100) NOT NULL,
  date DATE,
  start_time TIME,
  distance VARCHAR(80),
  location VARCHAR(255),
  capacity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  athlete_id INT NOT NULL,
  event_id INT NOT NULL,
  bib_number VARCHAR(30),
  status ENUM('registered','cancelled','checked_in') DEFAULT 'registered',
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Results table
CREATE TABLE IF NOT EXISTS results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  time_ms BIGINT NOT NULL,
  time_display VARCHAR(50),
  lap_data JSON NULL,
  recorded_by INT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Indexes
CREATE INDEX idx_results_time ON results(time_ms);
CREATE INDEX idx_events_date ON events(date);

-- Demo data
INSERT INTO users (name, email, password_raw, role) VALUES
('Richard Quintero','amind@uvm.edu','admin123','admin'),
('Organizador Demo','organizador@demo.com','OrgPass2025!','official');

INSERT INTO athletes (first_name,last_name,dob,sex,country,category,club) VALUES
('Juan','Pérez','1990-05-12','M','ARG','Senior','Club A'),
('María','Gómez','1995-09-01','F','ESP','Senior','Club B'),
('Carlos','Santos','2002-01-20','M','BRA','Junior','Club C');

INSERT INTO events (name,discipline,date,start_time,distance,location,capacity) VALUES
('Maratón Aguas Abiertas - 5K','Aguas Abiertas','2026-03-20','08:00:00','5K','Playa Central',200),
('Carrera Atletismo - 10K','Atletismo','2026-04-12','09:00:00','10K','Pista Principal',150);

INSERT INTO registrations (athlete_id,event_id,bib_number) VALUES
(1,1,'A101'),
(2,1,'A102'),
(3,2,'B201');

INSERT INTO results (registration_id,time_ms,time_display,lap_data,recorded_by) VALUES
(1,1200000,'00:20:00.000', NULL, 1),
(2,1250000,'00:20:50.000', NULL, 1);
