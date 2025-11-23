-- pwa_torneos_schema.sql
CREATE DATABASE IF NOT EXISTS pwa_torneos;
USE pwa_torneos;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','timer','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  min_age INT,
  max_age INT,
  gender ENUM('M','F','X') DEFAULT 'X',
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

CREATE TABLE athletes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(150) NOT NULL,
  last_name VARCHAR(150),
  birth_date DATE,
  gender ENUM('M','F','X') DEFAULT 'X',
  club VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  athlete_id INT NOT NULL,
  tournament_id INT NOT NULL,
  category_id INT,
  bib_number VARCHAR(50),
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('registered','checked-in','cancelled') DEFAULT 'registered',
  FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  name VARCHAR(150),
  distance VARCHAR(50),
  start_time DATETIME,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

CREATE TABLE times (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT NOT NULL,
  event_id INT,
  time_ms BIGINT NOT NULL,
  time_str VARCHAR(50) DEFAULT NULL,
  recorded_by INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);
