"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ConnectionIndicators } from "@/components/connection-indicators"

// Demo component showing how real users would join
export function RealTimeDemo() {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Jordan", // Use actual name instead of "You"
      avatar: "🌟",
      vibe: "excited",
      lastReaction: "🎵",
      joinedAt: Date.now() - 300000,
      isHost: true,
    },
  ])

  const [newUserName, setNewUserName] = useState("")

  // Simulate someone joining via shared link
  const simulateUserJoin = () => {
    if (!newUserName.trim()) return

    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: newUserName,
      avatar: ["🎵", "🌙", "✨", "🔥", "💫"][Math.floor(Math.random() * 5)],
      vibe: ["chill", "energetic", "dreamy", "excited"][Math.floor(Math.random() * 4)],
      lastReaction: ["🔥", "💫", "✨", "💜"][Math.floor(Math.random() * 4)],
      joinedAt: Date.now(),
      isHost: false,
    }

    // This simulates what happens when someone clicks your shared link
    setUsers((prev) => [...prev, newUser])
    setNewUserName("")
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
        <h3 className="text-white font-medium mb-3">🔗 Simulate Real User Joining</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter name to simulate join"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
          <Button
            onClick={simulateUserJoin}
            disabled={!newUserName.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Join via Link
          </Button>
        </div>
        <p className="text-purple-400 text-sm mt-2">
          This simulates what happens when someone clicks your shared room link
        </p>
      </Card>

      <ConnectionIndicators users={users} currentUser="Jordan" roomId="DEMO123" onUserUpdate={setUsers} />
    </div>
  )
}
