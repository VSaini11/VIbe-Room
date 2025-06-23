"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Music, Users, Heart, LinkIcon } from "lucide-react"

interface VibeLobbyProps {
  onJoinRoom: (roomId: string, userName: string) => void
}

export function VibeLobby({ onJoinRoom }: VibeLobbyProps) {
  const [userName, setUserName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const createRoom = () => {
    if (!userName.trim()) return
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    onJoinRoom(newRoomId, userName)
  }

  const joinExistingRoom = () => {
    if (!userName.trim() || !roomCode.trim()) return
    onJoinRoom(roomCode.toUpperCase(), userName)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-300 via-orange-200 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-sky-400 via-orange-300 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Music className="w-10 h-10 text-black font-bold" />
            </div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Vibe Room</h1>
          <p className="text-sky-200 text-lg">Listen together, feel together</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="glass-effect p-4 text-center border-sky-300/20">
            <Users className="w-6 h-6 text-sky-300 mx-auto mb-2" />
            <p className="text-sky-200 text-sm">Sync Listening</p>
          </Card>
          <Card className="glass-effect p-4 text-center border-orange-200/20">
            <Heart className="w-6 h-6 text-orange-300 mx-auto mb-2" />
            <p className="text-orange-200 text-sm">Live Reactions</p>
          </Card>
          <Card className="glass-effect p-4 text-center border-purple-400/20">
            <LinkIcon className="w-6 h-6 text-purple-300 mx-auto mb-2" />
            <p className="text-purple-200 text-sm">Easy Sharing</p>
          </Card>
        </div>

        <Card className="glass-effect p-6 space-y-4 border-white/10">
          <div className="space-y-2">
            <label className="text-sky-200 text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-black/20 border-white/20 text-white placeholder:text-sky-300/70 focus:border-sky-300/50"
            />
          </div>

          {!isCreating ? (
            <div className="space-y-3">
              <Button
                onClick={createRoom}
                disabled={!userName.trim()}
                className="w-full gradient-bg-primary text-black font-semibold hover:opacity-90 transition-opacity border-0"
              >
                Create New Room
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="w-full bg-black/20 border-white/20 text-sky-200 hover:bg-white/10 hover:border-sky-300/30"
              >
                Join Existing Room
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sky-200 text-sm font-medium">Room Code</label>
                <Input
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-black/20 border-white/20 text-white placeholder:text-sky-300/70 focus:border-sky-300/50"
                />
              </div>
              <Button
                onClick={joinExistingRoom}
                disabled={!userName.trim() || !roomCode.trim()}
                className="w-full gradient-bg-primary text-black font-semibold hover:opacity-90 transition-opacity border-0"
              >
                Join Room
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="w-full bg-black/20 border-white/20 text-sky-200 hover:bg-white/10 hover:border-sky-300/30"
              >
                Back
              </Button>
            </div>
          )}
        </Card>

        <Card className="glass-effect p-4 border-white/10">
          <h4 className="font-medium text-sky-300 mb-2">🔗 Easy Room Sharing</h4>
          <ul className="text-sm text-sky-200 space-y-1">
            <li>• Get a unique room link instantly</li>
            <li>• Share via WhatsApp, email, or social media</li>
            <li>• QR codes for quick mobile joining</li>
            <li>• No sign-up required for guests</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
