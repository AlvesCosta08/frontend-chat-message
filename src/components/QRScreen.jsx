import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode.react'
import { fetchQRCode, checkConnection, validateQRCode } from '../services/api'

export default function QRScreen({ onConnect }) {
  const [qrData, setQrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [online, setOnline] = useState(false)

  useEffect(() => {
    checkConnection().then(setOnline)
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchQRCode()
        // Agora o backend retorna uma URL completa, então não precisa mais fazer parse
        setQrData({ qr: data.qr }) // Exemplo: "http://192.168.100.25:3000/chat/abc123"
        setError(null)
      } catch (err) {
        setError('Servidor offline')
        setQrData({ qr: '', sessionId: 'demo-' + Date.now(), isMock: true })
      } finally {
        setLoading(false)
      }
    }
    load()
    const int = setInterval(load, 20000)
    return () => clearInterval(int)
  }, [])

  const simulateScan = async () => {
    // Extrai o sessionId da URL gerada pelo backend
    const sessionId = qrData?.qr?.split('/').pop()
    if (!sessionId) return

    try {
      await validateQRCode(sessionId)
      onConnect(sessionId)
    } catch {
      setError('QR expirado. Atualizando...')
      setTimeout(() => location.reload(), 2000)
    }
  }

  const qrValue = qrData?.qr || '' // Usa diretamente a URL completa do backend

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1>MeuChat</h1>
        <div style={s.status}>
          <span style={{...s.dot, backgroundColor: online ? '#4ade80' : '#ef4444'}}></span>
          <span>{online ? 'Online' : 'Offline'}</span>
        </div>
      </header>

      <main style={s.main}>
        {loading ? (
          <div style={s.loading}>
            <div style={s.spinner}></div>
            <p>Carregando...</p>
          </div>
        ) : error ? (
          <div style={s.errorBox}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div style={s.qrBox}>
              <QRCode value={qrValue} size={256} level="H" includeMargin />
              <p style={s.hint}>Escaneie com o celular para abrir o chat</p>
              {import.meta.env.DEV && (
                <button onClick={simulateScan} style={s.simBtn}>
                  Simular Escaneamento
                </button>
              )}
            </div>
            <div style={s.info}>
              <p><strong>Sessão:</strong> {qrValue.split('/').pop()?.slice(0,12)}...</p>
              {qrData.isMock && <p style={s.mock}>Modo offline</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const s = {
  container: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'system-ui, sans-serif' },
  header: { background: '#1e293b', color: 'white', padding: '1rem', textAlign: 'center' },
  status: { marginTop: '0.5rem', fontSize: '0.9rem' },
  dot: { display: 'inline-block', width: 10, height: 10, borderRadius: '50%', marginRight: 8 },
  main: { padding: '2rem', maxWidth: 480, margin: '0 auto' },
  loading: { textAlign: 'center', padding: '4rem 0' },
  spinner: { width: 50, height: 50, border: '5px solid #e2e8f0', borderTop: '5px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' },
  qrBox: { background: 'white', padding: '2rem', borderRadius: 16, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  hint: { marginTop: '1rem', color: '#64748b' },
  simBtn: { marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' },
  info: { marginTop: '2rem', textAlign: 'center', color: '#475569' },
  mock: { color: '#f59e0b', fontWeight: 'bold' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: 8, textAlign: 'center' }
}

const style = document.createElement('style')
style.textContent = '@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }'
document.head.appendChild(style)