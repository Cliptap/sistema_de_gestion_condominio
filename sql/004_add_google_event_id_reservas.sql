-- Migración: Agregar google_event_id a tabla reservas
-- Descripción: Agregar columna para almacenar el ID del evento de Google Calendar

ALTER TABLE reservas
ADD COLUMN google_event_id VARCHAR(255) NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_reservas_google_event_id ON reservas(google_event_id);
