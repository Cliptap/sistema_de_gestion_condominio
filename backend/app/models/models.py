from sqlalchemy import BigInteger, Boolean, CheckConstraint, Column, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Condominio(Base):
    __tablename__ = "condominios"
    id = Column(BigInteger, primary_key=True)
    nombre = Column(String(200), nullable=False)
    direccion = Column(String(300), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Vivienda(Base):
    __tablename__ = "viviendas"
    id = Column(BigInteger, primary_key=True)
    condominio_id = Column(BigInteger, ForeignKey("condominios.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    numero_vivienda = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    cargo_fijo_uf = Column(Numeric(10,2), nullable=False, server_default="0")

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(BigInteger, primary_key=True)
    email = Column(String(254), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    nombre_completo = Column(String(200), nullable=False)
    rol = Column(String(30), nullable=False, server_default="Residente")
    is_active = Column(Boolean, nullable=False, server_default="true")
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class ResidenteVivienda(Base):
    __tablename__ = "residentes_viviendas"
    usuario_id = Column(BigInteger, ForeignKey("usuarios.id", onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
    vivienda_id = Column(BigInteger, ForeignKey("viviendas.id", onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)

class GastoComun(Base):
    __tablename__ = "gastos_comunes"
    id = Column(BigInteger, primary_key=True)
    vivienda_id = Column(BigInteger, ForeignKey("viviendas.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    mes = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    monto_total = Column(Numeric(14,2), nullable=False)
    estado = Column(String(20), nullable=False, server_default="pendiente")
    vencimiento = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Multa(Base):
    __tablename__ = "multas"
    id = Column(BigInteger, primary_key=True)
    vivienda_id = Column(BigInteger, ForeignKey("viviendas.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    monto = Column(Numeric(14,2), nullable=False)
    descripcion = Column(String(500))
    fecha_aplicada = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class EspacioComun(Base):
    __tablename__ = "espacios_comunes"
    id = Column(BigInteger, primary_key=True)
    condominio_id = Column(BigInteger, ForeignKey("condominios.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    nombre = Column(String(150), nullable=False)
    requiere_pago = Column(Boolean, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Reserva(Base):
    __tablename__ = "reservas"
    id = Column(BigInteger, primary_key=True)
    espacio_comun_id = Column(BigInteger, ForeignKey("espacios_comunes.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    usuario_id = Column(BigInteger, ForeignKey("usuarios.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    fecha_hora_inicio = Column(DateTime(timezone=True), nullable=False)
    fecha_hora_fin = Column(DateTime(timezone=True), nullable=False)
    monto_pago = Column(Numeric(14,2), nullable=False, server_default="0")
    estado_pago = Column(String(20), nullable=False, server_default="pendiente")
    google_event_id = Column(String(255), nullable=True)  # ID del evento en Google Calendar
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Pago(Base):
    __tablename__ = "pagos"
    id = Column(BigInteger, primary_key=True)
    gasto_comun_id = Column(BigInteger, ForeignKey("gastos_comunes.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    usuario_id = Column(BigInteger, ForeignKey("usuarios.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    monto_pagado = Column(Numeric(14,2), nullable=False)
    fecha_pago = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    metodo_pago = Column(String(30), nullable=False, server_default="webpay")
