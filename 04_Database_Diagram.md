Diagrama de Base de Datos — PWA Torneos (ER y explicación)

Entidades principales:
- users
- tournaments
- categories
- athletes
- registrations
- events
- times

ER (texto):
Tournaments (1) --- (N) Categories
Tournaments (1) --- (N) Events
Athletes (1) --- (N) Registrations
Registrations (1) --- (N) Times
Events (1) --- (N) Times

Descripción de tablas y campos (resumen):
- users: id, name, email, password, role, created_at
- tournaments: id, name, location, start_date, end_date, description
- categories: id, tournament_id, name, min_age, max_age, gender
- athletes: id, first_name, last_name, birth_date, gender, club
- registrations: id, athlete_id, tournament_id, category_id, bib_number, status, registered_at
- events: id, tournament_id, name, distance, start_time
- times: id, registration_id, event_id, time_ms, time_str, recorded_by, recorded_at

SQL: archivo separado (pwa_torneos_schema.sql) incluido en ZIP.