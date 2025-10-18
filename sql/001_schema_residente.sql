-- PostgreSQL DDL - MVP Residente
-- Schema: public (default)
-- Note: Uses BIGSERIAL for PKs, TIMESTAMPTZ for timestamps, DECIMAL for money

-- 1) condominios
CREATE TABLE IF NOT EXISTS public.condominios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  direccion VARCHAR(300) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) viviendas
CREATE TABLE IF NOT EXISTS public.viviendas (
  id BIGSERIAL PRIMARY KEY,
  condominio_id BIGINT NOT NULL REFERENCES public.condominios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  numero_vivienda VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (condominio_id, numero_vivienda)
);

-- 3) usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(200) NOT NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'Residente',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) residentes_viviendas (M2M)
CREATE TABLE IF NOT EXISTS public.residentes_viviendas (
  usuario_id BIGINT NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
  vivienda_id BIGINT NOT NULL REFERENCES public.viviendas(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, vivienda_id)
);

-- 5) gastos_comunes
CREATE TABLE IF NOT EXISTS public.gastos_comunes (
  id BIGSERIAL PRIMARY KEY,
  vivienda_id BIGINT NOT NULL REFERENCES public.viviendas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INT NOT NULL CHECK (ano >= 2000),
  monto_total DECIMAL(14,2) NOT NULL CHECK (monto_total >= 0),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente|pagado
  vencimiento DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vivienda_id, mes, ano)
);

-- 6) multas
CREATE TABLE IF NOT EXISTS public.multas (
  id BIGSERIAL PRIMARY KEY,
  vivienda_id BIGINT NOT NULL REFERENCES public.viviendas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  monto DECIMAL(14,2) NOT NULL CHECK (monto >= 0),
  descripcion VARCHAR(500),
  fecha_aplicada DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7) espacios_comunes
CREATE TABLE IF NOT EXISTS public.espacios_comunes (
  id BIGSERIAL PRIMARY KEY,
  condominio_id BIGINT NOT NULL REFERENCES public.condominios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  nombre VARCHAR(150) NOT NULL,
  requiere_pago BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (condominio_id, nombre)
);

-- 8) reservas
CREATE TABLE IF NOT EXISTS public.reservas (
  id BIGSERIAL PRIMARY KEY,
  espacio_comun_id BIGINT NOT NULL REFERENCES public.espacios_comunes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  usuario_id BIGINT NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  fecha_hora_inicio TIMESTAMPTZ NOT NULL,
  fecha_hora_fin TIMESTAMPTZ NOT NULL,
  monto_pago DECIMAL(14,2) NOT NULL DEFAULT 0,
  estado_pago VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente|pagado
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (fecha_hora_fin > fecha_hora_inicio)
);

-- 9) pagos
CREATE TABLE IF NOT EXISTS public.pagos (
  id BIGSERIAL PRIMARY KEY,
  gasto_comun_id BIGINT NOT NULL REFERENCES public.gastos_comunes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  usuario_id BIGINT NOT NULL REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  monto_pagado DECIMAL(14,2) NOT NULL CHECK (monto_pagado >= 0),
  fecha_pago TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metodo_pago VARCHAR(30) NOT NULL DEFAULT 'webpay'
);

-- Indexes on FKs for performance
CREATE INDEX IF NOT EXISTS idx_viviendas_condominio_id ON public.viviendas (condominio_id);
CREATE INDEX IF NOT EXISTS idx_resviv_usuario_id ON public.residentes_viviendas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_resviv_vivienda_id ON public.residentes_viviendas (vivienda_id);
CREATE INDEX IF NOT EXISTS idx_gastos_vivienda_id ON public.gastos_comunes (vivienda_id);
CREATE INDEX IF NOT EXISTS idx_multas_vivienda_id ON public.multas (vivienda_id);
CREATE INDEX IF NOT EXISTS idx_espacios_condominio_id ON public.espacios_comunes (condominio_id);
CREATE INDEX IF NOT EXISTS idx_reservas_espacio_id ON public.reservas (espacio_comun_id);
CREATE INDEX IF NOT EXISTS idx_reservas_usuario_id ON public.reservas (usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagos_gasto_id ON public.pagos (gasto_comun_id);
CREATE INDEX IF NOT EXISTS idx_pagos_usuario_id ON public.pagos (usuario_id);
