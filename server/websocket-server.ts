import { WebSocketServer, WebSocket } from "ws"

const wss = new WebSocketServer({ port: 3001 })
console.log("✅ WebSocket server running on ws://localhost:3001")

interface ClientInfo {
  userName: string
  roomId: string
}

const clients = new Map<WebSocket, ClientInfo>()

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString())

      switch (data.type) {
        case "join": {
          const roomId = data.room || "main"
          const userName = `User-${Math.floor(Math.random() * 1000)}`

          clients.set(ws, { userName, roomId })

          // Notify others
          broadcast({
            type: "user-joined",
            user: userName,
          }, ws)

          break
        }

        case "message": {
          broadcast({
            type: "message",
            message: data.message,
          })
          break
        }

        case "typing": {
          broadcast({
            type: "typing",
            user: data.user,
            timestamp: data.timestamp,
          }, ws)
          break
        }
      }
    } catch (err) {
      console.error("❌ WS parse error:", err)
    }
  })

  ws.on("close", () => {
    const userInfo = clients.get(ws)
    if (userInfo) {
      broadcast({
        type: "user-left",
        user: userInfo.userName,
      })
    }
    clients.delete(ws)
  })
})

function broadcast(data: any, exclude?: WebSocket) {
  const msg = JSON.stringify(data)
  for (const client of wss.clients as Set<WebSocket>) {
    if (client.readyState === 1 && client !== exclude) {
      client.send(msg)
    }
  }
}
