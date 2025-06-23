"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RealTimeChat } from "@/components/real-time-chat"

export function ChatDemo() {
  const [userName, setUserName] = useState("You")
  const [roomId] = useState("DEMO123")
  const [userCount, setUserCount] = useState(3)

  const simulateUserJoin = () => {
    setUserCount((prev) => prev + 1)
  }

  const simulateUserLeave = () => {
    setUserCount((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
        <h3 className="text-white font-medium mb-3">💬 Real-Time Chat Demo</h3>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
          <Button onClick={simulateUserJoin} size="sm" className="bg-green-500 hover:bg-green-600">
            +User
          </Button>
          <Button onClick={simulateUserLeave} size="sm" className="bg-red-500 hover:bg-red-600">
            -User
          </Button>
        </div>
        <div className="text-sm text-purple-400">
          Try sending messages - others will respond automatically to simulate real-time chat!
        </div>
      </Card>

      <RealTimeChat roomId={roomId} userName={userName} userCount={userCount} />
    </div>
  )
}
