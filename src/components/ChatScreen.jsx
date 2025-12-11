import React, { useState, useEffect, useRef } from 'react'
import { connectWebSocket, sendMessage } from '../services/ws'

export default function ChatScreen({ sessionId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const ws = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    ws.current = connectWebSocket(sessionId, setMessages)
    return () => ws.current?.close()
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(ws.current, input)
      setMessages(prev => [...prev, { from: 'eu', text: input }])
      setInput('')
    }
  }

  return (
    <div style={c.container}>
      <header style={c.header}>
        <h2>Chat Ativo</h2>
        <small>Sessão: {sessionId.slice(0,8)}...</small>
      </header>
      <div style={c.messages}>
        {messages.map((m, i) => (
          <div key={i} style={m.from === 'eu' ? c.myMsg : c.otherMsg}>
            <strong>{m.from === 'eu' ? 'Você' : 'Outro'}:</strong> {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={c.inputBar}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Digite uma mensagem..."
          style={c.input}
        />
        <button onClick={handleSend} style={c.sendBtn}>Enviar</button>
      </div>
    </div>
  )
}

const c = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' },
  header: { background: '#1e293b', color: 'white', padding: '1rem', textAlign: 'center' },
  messages: { flex: 1, overflowY: 'auto', padding: '1rem' },
  myMsg: { textAlign: 'right', margin: '0.5rem 1rem', padding: '0.75rem', background: '#dbeafe', borderRadius: 12, maxWidth: '80%', marginLeft: 'auto' },
  otherMsg: { textAlign: 'left', margin: '0.5rem 1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: 12, maxWidth: '80%' },
  inputBar: { display: 'flex', padding: '1rem', background: 'white', borderTop: '1px solid #e5e7eb' },
  input: { flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: 8, marginRight: '0.5rem' },
  sendBtn: { padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }
}