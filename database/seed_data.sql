-- Seed data para PostgreSQL
-- Basado en condominio_db.sql de MySQL
-- Adaptado para la app móvil EspacioAdmin

BEGIN;

-- Limpiar datos existentes (opcional, comentar si no quieres borrar)
-- TRUNCATE TABLE reservas, pagos, gastos_comunes, multas, anuncios, residentes_viviendas, viviendas, espacios_comunes, usuarios, condominios RESTART IDENTITY CASCADE;

-- ========================================
-- 1. CONDOMINIOS
-- ========================================
INSERT INTO condominios (id, nombre, direccion, created_at, updated_at) 
VALUES (1, 'Condominio Los Alerces', 'Av. Siempre Viva 1234, Santiago', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Resetear secuencia
SELECT setval('condominios_id_seq', (SELECT MAX(id) FROM condominios));

-- ========================================
-- 2. ESPACIOS COMUNES (IMPORTANTE PARA MOBILE)
-- ========================================
-- Nota: Los IDs deben coincidir con los nombres que usa la app móvil:
-- 'multicancha', 'quincho', 'sala_eventos'

INSERT INTO espacios_comunes (id, condominio_id, nombre, requiere_pago, created_at) 
VALUES 
    (1, 1, 'quincho', true, NOW()),
    (2, 1, 'multicancha', true, NOW()),
    (3, 1, 'sala_eventos', true, NOW()),
    (4, 1, 'Gimnasio', false, NOW()),
    (5, 1, 'Piscina', false, NOW())
ON CONFLICT (condominio_id, nombre) DO NOTHING;

-- Resetear secuencia
SELECT setval('espacios_comunes_id_seq', (SELECT MAX(id) FROM espacios_comunes));

-- ========================================
-- 3. USUARIOS
-- ========================================
-- Password hash para 'demo123': $2b$12$QsXhxkm5xF0rnzO63VHanehDVzkPQgi4gfARKAvFpGfd3dgCwh2Ry
-- Password hash para 'mobile123': $2b$12$LHYs3L8mE5vZ5jK7qP9rXO8Gx8qF5nH6jK8lM9nO0pQ1rS2tU3vW4

-- Actualizar usuarios existentes y agregar nuevos sin especificar IDs
INSERT INTO usuarios (email, password_hash, nombre_completo, rol, is_active, created_at, updated_at, notificaciones_email, notificaciones_push) 
VALUES 
    ('residente@example.com', '$2b$12$QsXhxkm5xF0rnzO63VHanehDVzkPQgi4gfARKAvFpGfd3dgCwh2Ry', 'Juan Pérez', 'Residente', true, NOW(), NOW(), true, true),
    ('admin@example.com', '$2b$12$QsXhxkm5xF0rnzO63VHanehDVzkPQgi4gfARKAvFpGfd3dgCwh2Ry', 'María González', 'Administrador', true, NOW(), NOW(), true, true),
    ('conserje@example.com', '$2b$12$QsXhxkm5xF0rnzO63VHanehDVzkPQgi4gfARKAvFpGfd3dgCwh2Ry', 'Carlos Ramírez', 'Conserje', true, NOW(), NOW(), true, true)
ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    nombre_completo = EXCLUDED.nombre_completo,
    updated_at = NOW();

-- Resetear secuencia
SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

-- ========================================
-- 4. VIVIENDAS
-- ========================================
INSERT INTO viviendas (id, condominio_id, numero_vivienda, cargo_fijo_uf, created_at, updated_at) 
VALUES 
    (1, 1, 'Dpto 101', 0.00, NOW(), NOW()),
    (2, 1, 'Dpto 102', 0.00, NOW(), NOW()),
    (3, 1, 'Dpto 103', 0.50, NOW(), NOW()),
    (4, 1, 'Dpto 104', 0.50, NOW(), NOW()),
    (5, 1, 'Dpto 105', 0.50, NOW(), NOW()),
    (6, 1, 'Dpto 201', 0.50, NOW(), NOW()),
    (7, 1, 'Dpto 202', 0.50, NOW(), NOW()),
    (8, 1, 'Dpto 203', 0.50, NOW(), NOW())
ON CONFLICT (condominio_id, numero_vivienda) DO NOTHING;

-- Resetear secuencia
SELECT setval('viviendas_id_seq', (SELECT MAX(id) FROM viviendas));

-- ========================================
-- 5. RESIDENTES_VIVIENDAS
-- ========================================
-- Obtener IDs dinámicamente
DO $$
DECLARE
    residente_id bigint;
    testmobile_id bigint;
BEGIN
    -- Obtener ID de residente@example.com
    SELECT id INTO residente_id FROM usuarios WHERE email = 'residente@example.com';
    -- Obtener ID de test@mobile.com  
    SELECT id INTO testmobile_id FROM usuarios WHERE email = 'test@mobile.com';
    
    IF residente_id IS NOT NULL THEN
        INSERT INTO residentes_viviendas (usuario_id, vivienda_id) 
        VALUES (residente_id, 1)
        ON CONFLICT (usuario_id, vivienda_id) DO NOTHING;
    END IF;
    
    IF testmobile_id IS NOT NULL THEN
        INSERT INTO residentes_viviendas (usuario_id, vivienda_id) 
        VALUES (testmobile_id, 2)
        ON CONFLICT (usuario_id, vivienda_id) DO NOTHING;
    END IF;
END $$;

-- ========================================
-- 6. ANUNCIOS
-- ========================================
INSERT INTO anuncios (id, condominio_id, titulo, contenido, tipo, autor_id, fecha_publicacion, fecha_expiracion, is_active, created_at, updated_at) 
VALUES 
    (1, 1, 'Bienvenida a Nuevos Residentes', 'Damos la bienvenida a todos los nuevos residentes del condominio. Les recordamos revisar el reglamento interno y mantener las áreas comunes en orden.', 'general', 2, '2025-11-10', '2025-12-10', true, NOW(), NOW()),
    (2, 1, 'Mantenimiento de Piscina', 'Se informa que la piscina estará cerrada para mantenimiento el próximo lunes de 8:00 a 16:00 horas. Disculpen las molestias.', 'mantenimiento', 2, '2025-11-10', '2025-11-30', true, NOW(), NOW()),
    (3, 1, 'Asamblea de Copropietarios', 'Se convoca a todos los residentes a la asamblea de copropietarios que se realizará el próximo mes. Favor confirmar asistencia.', 'importante', 2, '2025-11-10', '2026-01-09', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Resetear secuencia
SELECT setval('anuncios_id_seq', (SELECT MAX(id) FROM anuncios));

-- ========================================
-- 7. GASTOS COMUNES
-- ========================================
-- Crear gastos comunes para algunas viviendas
INSERT INTO gastos_comunes (vivienda_id, mes, ano, monto_total, estado, vencimiento, created_at, updated_at) 
VALUES 
    -- Vivienda 1 (Juan Pérez)
    (1, 11, 2025, 150000.00, 'pendiente', '2025-11-30', NOW(), NOW()),
    (1, 10, 2025, 150000.00, 'pagado', '2025-10-31', NOW(), NOW()),
    (1, 9, 2025, 150000.00, 'pagado', '2025-09-30', NOW(), NOW()),
    
    -- Vivienda 2 (test@mobile.com)
    (2, 11, 2025, 150000.00, 'pendiente', '2025-11-30', NOW(), NOW()),
    (2, 10, 2025, 150000.00, 'pagado', '2025-10-31', NOW(), NOW()),
    
    -- Otras viviendas
    (3, 11, 2025, 150000.00, 'pendiente', '2025-11-30', NOW(), NOW()),
    (4, 11, 2025, 150000.00, 'pendiente', '2025-11-30', NOW(), NOW()),
    (5, 11, 2025, 150000.00, 'pendiente', '2025-11-30', NOW(), NOW())
ON CONFLICT (vivienda_id, mes, ano) DO NOTHING;

-- ========================================
-- 8. MULTAS
-- ========================================
INSERT INTO multas (vivienda_id, monto, descripcion, fecha_aplicada, created_at) 
VALUES 
    (1, 25000.00, 'Ruidos molestos', '2025-11-01', NOW()),
    (2, 15000.00, 'Basura fuera del horario', '2025-11-05', NOW()),
    (3, 35000.00, 'Basura fuera del horario', '2025-11-02', NOW())
ON CONFLICT DO NOTHING;

-- ========================================
-- 9. RESERVAS (EJEMPLOS)
-- ========================================
-- Algunas reservas de ejemplo para testing
DO $$
DECLARE
    residente_id bigint;
    testmobile_id bigint;
BEGIN
    SELECT id INTO residente_id FROM usuarios WHERE email = 'residente@example.com';
    SELECT id INTO testmobile_id FROM usuarios WHERE email = 'test@mobile.com';
    
    IF residente_id IS NOT NULL AND testmobile_id IS NOT NULL THEN
        INSERT INTO reservas (espacio_comun_id, usuario_id, fecha_hora_inicio, fecha_hora_fin, monto_pago, estado_pago, created_at) 
        VALUES 
            -- Reservas pasadas
            (1, residente_id, '2025-11-20 10:00:00', '2025-11-20 12:00:00', 10000.00, 'pagado', NOW()),
            (2, testmobile_id, '2025-11-21 14:00:00', '2025-11-21 16:00:00', 15000.00, 'pagado', NOW()),
            (3, residente_id, '2025-11-22 18:00:00', '2025-11-22 21:00:00', 20000.00, 'pendiente', NOW()),
            
            -- Reservas futuras
            (1, testmobile_id, '2025-11-28 10:00:00', '2025-11-28 12:00:00', 10000.00, 'pendiente', NOW()),
            (2, residente_id, '2025-11-29 15:00:00', '2025-11-29 17:00:00', 15000.00, 'pendiente', NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

COMMIT;

-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Mostrar resumen de datos insertados
SELECT 'Condominios' as tabla, COUNT(*) as total FROM condominios
UNION ALL
SELECT 'Espacios Comunes', COUNT(*) FROM espacios_comunes
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Viviendas', COUNT(*) FROM viviendas
UNION ALL
SELECT 'Anuncios', COUNT(*) FROM anuncios
UNION ALL
SELECT 'Gastos Comunes', COUNT(*) FROM gastos_comunes
UNION ALL
SELECT 'Multas', COUNT(*) FROM multas
UNION ALL
SELECT 'Reservas', COUNT(*) FROM reservas;

-- Mostrar espacios comunes específicamente
SELECT id, nombre, requiere_pago FROM espacios_comunes ORDER BY id;
