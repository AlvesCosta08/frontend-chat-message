// Usa caminhos relativos → Nginx faz proxy automaticamente
export const checkConnection = async () => {
  try {
    const res = await fetch('/api/health', { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

export const fetchQRCode = async () => {
  const res = await fetch('/api/qr')
  if (!res.ok) throw new Error('Falha ao obter QR')
  return res.json()
}

export const validateQRCode = async (sessionId, deviceKey = 'web-client') => {
  const res = await fetch('/api/validate-qr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, deviceKey })
  })
  if (!res.ok) throw new Error('QR inválido ou expirado')
  return res.json()
}