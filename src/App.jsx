import { useState, useEffect } from 'react'
import QRScreen from './components/QRScreen'
import ChatScreen from './components/ChatScreen'

export default function App() {
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    // Detecta a sessionId na URL (ex: ?session=abc123)
    const urlParams = new URLSearchParams(window.location.search)
    const session = urlParams.get('session')
    if (session) {
      setSessionId(session)
    }
  }, [])

  if (sessionId) {
    return <ChatScreen sessionId={sessionId} />
  }

  return <QRScreen onConnect={setSessionId} />
}