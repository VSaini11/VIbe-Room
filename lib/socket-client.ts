import io, { type Socket } from "socket.io-client"

interface User {
  name: string
  avatar: string
  isHost: boolean
  joinedAt: string
}

interface Room {
  _id: string
  name: string
  hostId: string
  users: User[]
  isActive: boolean
  createdAt: string
}

class SocketService {
  private socket: Socket | null = null
  private roomId: string | null = null
  private userName: string | null = null
  private isHost = false

  connect(serverUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001") {
    if (this.socket?.connected) return this.socket

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    })

    this.socket.on("connect", () => {
      console.log("✅ Connected to server:", this.socket?.id)
    })

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from server")
    })

    this.socket.on("connect_error", (error: any) => {
      console.error("🔌 Connection error:", error)
    })

    // Listen for host transfer events
    this.socket.on(
      "host-transferred",
      (data: { oldHost: string; newHost: string; reason?: string }) => {
        console.log(`👑 Host transferred from ${data.oldHost} to ${data.newHost}`)

        // Update local host status
        if (data.newHost === this.userName) {
          this.isHost = true
          console.log("🎉 You are now the host!")
        } else if (data.oldHost === this.userName) {
          this.isHost = false
          console.log("👤 You are no longer the host")
        }
      }
    )

    this.socket.on("error", (error: any) => {
      console.error("❌ Server error:", error.message)
    })

    return this.socket
  }

  joinRoom(roomId: string, userName: string, userAvatar = "🎵") {
    if (!this.socket) throw new Error("Socket not connected")

    this.roomId = roomId
    this.userName = userName

    this.socket.emit("join-room", {
      roomId,
      userName,
      userAvatar,
    })
  }

  sendMessage(message: string, emoji?: string) {
    if (!this.socket || !this.roomId || !this.userName) return

    this.socket.emit("send-message", {
      roomId: this.roomId,
      userName: this.userName,
      message,
      emoji,
    })
  }

  sendReaction(emoji: string, intensity: number, x?: number, y?: number) {
    if (!this.socket || !this.roomId || !this.userName) return

    this.socket.emit("send-reaction", {
      roomId: this.roomId,
      userName: this.userName,
      emoji,
      intensity,
      x,
      y,
    })
  }

  // Only host can update playback
  updatePlayback(track: any, isPlaying: boolean, currentTime: number) {
    if (!this.socket || !this.roomId || !this.userName) return

    if (!this.isHost) {
      console.warn("⚠️ Only the host can control playback")
      return
    }

    this.socket.emit("update-playback", {
      roomId: this.roomId,
      track,
      isPlaying,
      currentTime,
      updatedBy: this.userName,
    })
  }

  // Only host can transfer host role
  transferHost(newHostName: string) {
    if (!this.socket || !this.roomId || !this.isHost) return

    this.socket.emit("transfer-host", {
      roomId: this.roomId,
      newHostName,
    })
  }

  // Event listeners
  onUserJoined(callback: (data: { user: User; room: Room }) => void) {
    this.socket?.on("user-joined", callback)
  }

  onRoomJoined(callback: (data: { room: Room; isHost: boolean; hostId: string }) => void) {
    this.socket?.on("room-joined", (data: { room: Room; isHost: boolean; hostId: string }) => {
      this.isHost = data.isHost
      console.log(`🏠 Joined room as ${data.isHost ? "HOST" : "GUEST"}`)
      callback(data)
    })
  }

  onUserLeft(callback: (data: { userName: string; wasHost: boolean }) => void) {
    this.socket?.on("user-left", callback)
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on("new-message", callback)
  }

  onNewReaction(callback: (reaction: any) => void) {
    this.socket?.on("new-reaction", callback)
  }

  onPlaybackUpdated(callback: (playback: any) => void) {
    this.socket?.on("playback-updated", callback)
  }

  onRoomUpdated(callback: (room: Room) => void) {
    this.socket?.on("room-updated", callback)
  }

  onHostTransferred(callback: (data: { oldHost: string; newHost: string; reason?: string }) => void) {
    this.socket?.on("host-transferred", callback)
  }

  // Getters
  getIsHost(): boolean {
    return this.isHost
  }

  getUserName(): string | null {
    return this.userName
  }

  getRoomId(): string | null {
    return this.roomId
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.roomId = null
      this.userName = null
      this.isHost = false
    }
  }
}

export const socketService = new SocketService()
