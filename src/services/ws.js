export const connectWebSocket = (sessionId, setMessages) => {
  const ws = new WebSocket(`ws://${window.location.host}/ws`)

  ws.onopen = () => {
    console.log('WebSocket conectado')
    ws.send(JSON.stringify({ type: 'register', sessionId }))
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type === 'message') {
      setMessages(prev => [...prev, { from: data.from || 'outro', text: data.content }])
    }
  }

  ws.onerror = (err) => console.error('WS Error:', err)
  ws.onclose = () => console.log('WebSocket fechado')

  return ws
}

export const sendMessage = (ws, text) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'message',
      content: text
    }))
  }
}