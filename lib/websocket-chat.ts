// Real WebSocket implementation for chat

interface ChatMessage {
  id: string
  user: string
  text: string
  timestamp: number
  emoji?: string
  type: "message" | "reaction" | "system" | "typing"
}

export class WebSocketChat {
  private ws: WebSocket | null = null
  private roomId: string
  private userName: string
  private messageListeners: ((message: ChatMessage) => void)[] = []
  private statusListeners: ((status: "connected" | "disconnected" | "error") => void)[] = []

  constructor(roomId: string, userName: string) {
    this.roomId = roomId
    this.userName = userName
  }

  connect() {
    try {
      // Connect to WebSocket server
      this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);


      this.ws.onopen = () => {
        console.log(`🔌 Connected to chat room ${this.roomId}`)
        this.notifyStatusListeners("connected")

        // Send join message
        this.send({
          type: "join",
          room: this.roomId,
          payload: null,
          timestamp: Date.now(),
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          switch (data.type) {
            case "message":
              this.notifyMessageListeners(data.message)
              break
            case "user-joined":
              this.notifyMessageListeners({
                id: Date.now().toString(),
                user: "System",
                text: `${data.user} joined the chat! 🎉`,
                timestamp: Date.now(),
                type: "system",
              })
              break
            case "user-left":
              this.notifyMessageListeners({
                id: Date.now().toString(),
                user: "System",
                text: `${data.user} left the chat`,
                timestamp: Date.now(),
                type: "system",
              })
              break
            case "typing":
              // Handle typing indicators
              break
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log(`🔌 Disconnected from chat room ${this.roomId}`)
        this.notifyStatusListeners("disconnected")

        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CLOSED) {
            this.connect()
          }
        }, 3000)
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.notifyStatusListeners("error")
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      this.notifyStatusListeners("error")
    }
  }

  sendMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected")
      return
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: this.userName,
      text,
      timestamp: Date.now(),
      emoji: this.getRandomEmoji(),
      type: "message",
    }

    this.send({
      type: "message",
      message,
    })
  }

  sendTyping() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

    this.send({
      type: "typing",
      user: this.userName,
      timestamp: Date.now(),
    })
  }

  onMessage(callback: (message: ChatMessage) => void) {
    this.messageListeners.push(callback)
  }

  onStatusChange(callback: (status: "connected" | "disconnected" | "error") => void) {
    this.statusListeners.push(callback)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private notifyMessageListeners(message: ChatMessage) {
    this.messageListeners.forEach((listener) => listener(message))
  }

  private notifyStatusListeners(status: "connected" | "disconnected" | "error") {
    this.statusListeners.forEach((listener) => listener(status))
  }

  private getRandomEmoji() {
    const emojis = ["🌟", "🎵", "🌙", "✨", "🔥", "💫", "🎭", "🌈", "⚡", "💜"]
    return emojis[Math.floor(Math.random() * emojis.length)]
  }
}
