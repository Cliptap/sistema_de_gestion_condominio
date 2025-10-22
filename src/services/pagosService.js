export async function fetchPagosDesglose(usuarioId, signal) {
  // Using Vite proxy: '/api' forwards to backend target, so final path must be '/api/v1/...'
  const res = await fetch(`/api/v1/pagos/residente/${usuarioId}`, { signal })
  if (!res.ok) {
    let detail = ''
    try { detail = await res.text() } catch {}
    throw new Error(`Error al cargar pagos (${res.status}): ${detail}`)
  }
  return res.json()
}
