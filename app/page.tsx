"use client"

import { useState } from "react"
import { VibeLobby } from "@/components/vibe-lobby"
import { VibeRoom } from "@/components/vibe-room"

export default function Home() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [userName, setUserName] = useState("")

  const joinRoom = (roomId: string, name: string) => {
    setCurrentRoom(roomId)
    setUserName(name)
  }

  const leaveRoom = () => {
    setCurrentRoom(null)
    setUserName("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
      {!currentRoom ? (
        <VibeLobby onJoinRoom={joinRoom} />
      ) : (
        <VibeRoom roomId={currentRoom} userName={userName} onLeaveRoom={leaveRoom} />
      )}
    </div>
  )
}
