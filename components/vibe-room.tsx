"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { EnhancedMusicPlayer } from "@/components/enhanced-music-player"
import { EnhancedReactionSystem } from "@/components/enhanced-reaction-system"
import { VibeIntensityMeter } from "@/components/vibe-intensity-meter"
import { ThoughtChat } from "@/components/thought-chat"
import { ConnectionIndicators } from "@/components/connection-indicators"
import { RoomHeader } from "@/components/room-header"
import { VibeWaveform } from "@/components/vibe-waveform"

interface VibeRoomProps {
  roomId: string
  userName: string
  onLeaveRoom: () => void
}

interface Reaction {
  id: string
  emoji: string
  user: string
  timestamp: number
  intensity: number
  x: number
  y: number
}

const mockSong = {
  title: "Midnight Vibes",
  artist: "Luna & The Dreamers",
  album: "Cosmic Feelings",
  duration: 240,
  cover: "/placeholder.svg?height=300&width=300",
}

// Initial users with the current user
const getInitialUsers = (currentUser: string) => [
  {
    id: "1",
    name: currentUser, // Use the actual name passed in
    avatar: "🌟",
    vibe: "excited",
    lastReaction: "🎵",
    joinedAt: Date.now() - 300000, // 5 minutes ago
    isHost: true,
  },
  {
    id: "2",
    name: "Alex",
    avatar: "🎵",
    vibe: "energetic",
    lastReaction: "🔥",
    joinedAt: Date.now() - 180000, // 3 minutes ago
    isHost: false,
  },
  {
    id: "3",
    name: "Sam",
    avatar: "🌙",
    vibe: "chill",
    lastReaction: "💫",
    joinedAt: Date.now() - 120000, // 2 minutes ago
    isHost: false,
  },
]

export function VibeRoom({ roomId, userName, onLeaveRoom }: VibeRoomProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [vibeIntensity, setVibeIntensity] = useState(0)
  const [users, setUsers] = useState(() => getInitialUsers(userName))

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= mockSong.duration) {
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const addReaction = (emoji: string, intensity: number) => {
    const newReaction: Reaction = {
      id: Math.random().toString(),
      emoji,
      user: userName,
      timestamp: Date.now(),
      intensity,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    }

    setReactions((prev) => [...prev, newReaction])

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id))
    }, 3000)
  }

  useEffect(() => {
    const now = Date.now()
    const recentReactions = reactions.filter((r) => now - r.timestamp < 30000)

    if (recentReactions.length === 0) {
      setVibeIntensity((prev) => Math.max(0, prev - 0.5))
      return
    }

    const baseIntensity = recentReactions.reduce((sum, reaction) => {
      const timeWeight = Math.max(0.1, 1 - (now - reaction.timestamp) / 30000)
      return sum + reaction.intensity * timeWeight
    }, 0)

    const participationRate = Math.min(recentReactions.length / users.length, 1)
    const participationBoost = participationRate * 20

    const finalIntensity = Math.min(100, baseIntensity + participationBoost)
    setVibeIntensity(finalIntensity)
  }, [reactions, users.length])

  return (
    <div className="min-h-screen p-4 space-y-4">
      <RoomHeader roomId={roomId} onLeaveRoom={onLeaveRoom} userCount={users.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 relative overflow-hidden">
            {reactions.map((reaction) => (
              <div
                key={reaction.id}
                className="absolute text-2xl animate-bounce pointer-events-none z-10"
                style={{
                  left: `${reaction.x}%`,
                  top: `${reaction.y}%`,
                  animation: "float 3s ease-out forwards",
                  fontSize: `${1 + reaction.intensity / 10}rem`,
                }}
              >
                {reaction.emoji}
              </div>
            ))}

            <EnhancedMusicPlayer
              roomId={roomId}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onTrackChange={(track) => {
                console.log("Now playing:", track)
              }}
            />
          </Card>

          <VibeWaveform currentTime={currentTime} duration={mockSong.duration} />

          <EnhancedReactionSystem onReaction={addReaction} currentIntensity={vibeIntensity} />
        </div>

        <div className="space-y-4">
          <VibeIntensityMeter reactions={reactions} userCount={users.length} />
          <ConnectionIndicators users={users} currentUser={userName} roomId={roomId} />
          <ThoughtChat roomId={roomId} userName={userName} />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
