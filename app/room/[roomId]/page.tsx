"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VibeRoom } from "@/components/vibe-room"
import { Music, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const [userName, setUserName] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [roomExists, setRoomExists] = useState(true)

  useEffect(() => {
    // Check if room exists (in real app, this would be an API call)
    if (!roomId || roomId.length < 4) {
      setRoomExists(false)
    }
  }, [roomId])

  const joinRoom = async () => {
    if (!userName.trim()) return

    setIsJoining(true)

    try {
      // Simulate joining room
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHasJoined(true)
    } catch (error) {
      console.error("Failed to join room:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const leaveRoom = () => {
    setHasJoined(false)
    setUserName("")
    router.push("/")
  }

  // Room not found page - with consistent background
  if (!roomExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mx-auto">
            <Music className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Room Not Found</h2>
            <p className="text-purple-300">The room "{roomId}" doesn't exist or has ended.</p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Create New Room
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-white/5 border-white/20 text-purple-200 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // If user has joined, show the full VibeRoom with consistent background
  if (hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800">
        <VibeRoom roomId={roomId} userName={userName} onLeaveRoom={leaveRoom} />
      </div>
    )
  }

  // Join room page - with consistent background
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 max-w-md w-full space-y-6">
        {/* Room Info */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Music className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Join Vibe Room</h1>
            <div className="text-lg font-mono bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              {roomId}
            </div>
            <p className="text-purple-300">Someone invited you to listen together!</p>
          </div>
        </div>

        {/* Room Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-3 text-center">
            <Users className="w-5 h-5 text-purple-300 mx-auto mb-1" />
            <div className="text-white font-medium">3</div>
            <div className="text-purple-400 text-xs">Listeners</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-3 text-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1 animate-pulse"></div>
            <div className="text-green-300 font-medium text-sm">Live</div>
            <div className="text-purple-400 text-xs">Now Playing</div>
          </Card>
        </div>

        {/* Join Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-purple-200 text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your name to join"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && joinRoom()}
              className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
              disabled={isJoining}
            />
          </div>

          <Button
            onClick={joinRoom}
            disabled={!userName.trim() || isJoining}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
          >
            {isJoining ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Joining Room...
              </>
            ) : (
              "Join the Vibe 🎵"
            )}
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full bg-white/5 border-white/20 text-purple-200 hover:bg-white/10">
              Create Your Own Room
            </Button>
          </Link>
        </div>

        {/* What to Expect */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-medium text-purple-300 mb-2">What to expect:</h4>
          <ul className="text-sm text-purple-200 space-y-1">
            <li>• Listen to music in perfect sync</li>
            <li>• React and chat in real-time</li>
            <li>• Share the vibe with everyone</li>
            <li>• Discover new music together</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
