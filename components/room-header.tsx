"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Copy, Check, Users } from "lucide-react"
import { useState } from "react"

interface RoomHeaderProps {
  roomId: string
  onLeaveRoom: () => void
  userCount?: number
}

export function RoomHeader({ roomId, onLeaveRoom, userCount = 3 }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)

  const shareRoom = async () => {
    const roomUrl = `${window.location.origin}/room/${roomId}`
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card className="glass-effect p-4 border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sky-200 font-medium">Room {roomId}</span>
          </div>
          <div className="flex items-center space-x-1 text-sky-300 text-sm">
            <Users className="w-4 h-4" />
            <span>
              {userCount} listener{userCount !== 1 ? "s" : ""}
            </span>
            {userCount > 5 && <span className="text-orange-400">🔥</span>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareRoom}
            className="bg-black/20 border-white/20 text-sky-200 hover:bg-white/10 hover:border-sky-300/30"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLeaveRoom}
            className="bg-black/20 border-white/20 text-orange-200 hover:bg-white/10 hover:border-orange-300/30"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </div>
    </Card>
  )
}
