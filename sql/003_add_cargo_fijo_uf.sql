-- Add cargo_fijo_uf to viviendas and seed example value
ALTER TABLE public.viviendas
  ADD COLUMN IF NOT EXISTS cargo_fijo_uf DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Set example value for Dpto 101
UPDATE public.viviendas
SET cargo_fijo_uf = 7.60
WHERE numero_vivienda = 'Dpto 101';
