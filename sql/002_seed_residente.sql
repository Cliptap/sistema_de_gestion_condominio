-- Seed de ejemplo para entorno de desarrollo
-- No usar en producción

-- Condominio
INSERT INTO public.condominios (nombre, direccion)
VALUES ('Condominio Los Alerces', 'Av. Siempre Viva 1234, Santiago')
ON CONFLICT DO NOTHING;

-- Tomar id del condominio recién insertado o existente
WITH c AS (
  SELECT id FROM public.condominios WHERE nombre = 'Condominio Los Alerces' LIMIT 1
)
-- Viviendas
INSERT INTO public.viviendas (condominio_id, numero_vivienda)
SELECT c.id, 'Dpto 101' FROM c
ON CONFLICT DO NOTHING;

WITH c AS (
  SELECT id FROM public.condominios WHERE nombre = 'Condominio Los Alerces' LIMIT 1
)
INSERT INTO public.viviendas (condominio_id, numero_vivienda)
SELECT c.id, 'Dpto 102' FROM c
ON CONFLICT DO NOTHING;

-- Usuario Residente
INSERT INTO public.usuarios (email, password_hash, nombre_completo, rol)
VALUES ('residente@example.com', '$2b$10$2V5NoQt9orJ8OAi4m9mG5.2bA3w3z7b6E9mSov4zh2a1Q6F3WfT7a', 'Juan Pérez', 'Residente')
ON CONFLICT (email) DO NOTHING;

-- Vincular residente a Dpto 101
WITH u AS (
  SELECT id FROM public.usuarios WHERE email = 'residente@example.com' LIMIT 1
), v AS (
  SELECT id FROM public.viviendas WHERE numero_vivienda = 'Dpto 101' LIMIT 1
)
INSERT INTO public.residentes_viviendas (usuario_id, vivienda_id)
SELECT u.id, v.id FROM u, v
ON CONFLICT DO NOTHING;

-- Gasto común Enero 2025
WITH v AS (
  SELECT id FROM public.viviendas WHERE numero_vivienda = 'Dpto 101' LIMIT 1
)
INSERT INTO public.gastos_comunes (vivienda_id, mes, ano, monto_total, estado, vencimiento)
SELECT v.id, 1, 2025, 150000, 'pendiente', '2025-01-31' FROM v
ON CONFLICT DO NOTHING;

-- Multa ejemplo
WITH v AS (
  SELECT id FROM public.viviendas WHERE numero_vivienda = 'Dpto 101' LIMIT 1
)
INSERT INTO public.multas (vivienda_id, monto, descripcion, fecha_aplicada)
SELECT v.id, 25000, 'Ruidos molestos', CURRENT_DATE - INTERVAL '10 days' FROM v
ON CONFLICT DO NOTHING;

-- Espacio común y reserva
WITH c AS (
  SELECT id FROM public.condominios WHERE nombre = 'Condominio Los Alerces' LIMIT 1
)
INSERT INTO public.espacios_comunes (condominio_id, nombre, requiere_pago)
SELECT c.id, 'Quincho', TRUE FROM c
ON CONFLICT DO NOTHING;

WITH e AS (
  SELECT id FROM public.espacios_comunes WHERE nombre = 'Quincho' LIMIT 1
), u AS (
  SELECT id FROM public.usuarios WHERE email = 'residente@example.com' LIMIT 1
)
INSERT INTO public.reservas (espacio_comun_id, usuario_id, fecha_hora_inicio, fecha_hora_fin, monto_pago, estado_pago)
SELECT e.id, u.id, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 4 hours', 10000, 'pendiente' FROM e, u
ON CONFLICT DO NOTHING;
