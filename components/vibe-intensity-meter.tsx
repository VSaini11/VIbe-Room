"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Reaction {
  id: string
  emoji: string
  user: string
  timestamp: number
  intensity: number
}

interface VibeIntensityMeterProps {
  reactions: Reaction[]
  userCount: number
}

// Reaction intensity values
const REACTION_INTENSITY = {
  "🔥": 10,
  "⚡": 9,
  "💥": 8,
  "🎉": 7,
  "💫": 6,
  "✨": 5,
  "💜": 4,
  "🎵": 4,
  "🌙": 2,
  "💭": 1,
}

export function VibeIntensityMeter({ reactions, userCount }: VibeIntensityMeterProps) {
  const [currentIntensity, setCurrentIntensity] = useState(0)
  const [peakIntensity, setPeakIntensity] = useState(0)
  const [recentReactions, setRecentReactions] = useState<Reaction[]>([])

  useEffect(() => {
    // Calculate intensity based on recent reactions (last 30 seconds)
    const now = Date.now()
    const recent = reactions.filter((r) => now - r.timestamp < 30000)
    setRecentReactions(recent)

    if (recent.length === 0) {
      // Gradually decrease intensity when no reactions
      setCurrentIntensity((prev) => Math.max(0, prev - 1))
      return
    }

    // Calculate base intensity from reactions
    const baseIntensity = recent.reduce((sum, reaction) => {
      const intensity = REACTION_INTENSITY[reaction.emoji as keyof typeof REACTION_INTENSITY] || 3
      // More recent reactions have higher weight
      const timeWeight = Math.max(0.1, 1 - (now - reaction.timestamp) / 30000)
      return sum + intensity * timeWeight
    }, 0)

    // Boost intensity based on user participation rate
    const participationRate = Math.min(recent.length / userCount, 1)
    const participationBoost = participationRate * 20

    // Calculate final intensity (0-100)
    const finalIntensity = Math.min(100, baseIntensity + participationBoost)

    setCurrentIntensity(finalIntensity)
    setPeakIntensity((prev) => Math.max(prev, finalIntensity))
  }, [reactions, userCount])

  const getIntensityLevel = (intensity: number) => {
    if (intensity >= 80) return { level: "LEGENDARY", color: "from-yellow-400 to-orange-500", emoji: "🔥" }
    if (intensity >= 60) return { level: "EPIC", color: "from-orange-400 to-red-500", emoji: "⚡" }
    if (intensity >= 40) return { level: "HIGH", color: "from-purple-400 to-pink-500", emoji: "💫" }
    if (intensity >= 20) return { level: "MEDIUM", color: "from-blue-400 to-purple-400", emoji: "✨" }
    return { level: "CHILL", color: "from-gray-400 to-blue-400", emoji: "🌙" }
  }

  const intensityData = getIntensityLevel(currentIntensity)

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-purple-200 font-medium">Vibe Intensity</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{intensityData.emoji}</span>
            <span className={`text-sm font-bold bg-gradient-to-r ${intensityData.color} bg-clip-text text-transparent`}>
              {intensityData.level}
            </span>
          </div>
        </div>

        {/* Intensity Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-purple-300">Current Vibe</span>
            <span className="text-white font-bold">{Math.round(currentIntensity)}%</span>
          </div>

          <div className="relative">
            <Progress value={currentIntensity} className="h-3" />
            <div
              className="absolute top-0 h-3 w-1 bg-white/60 rounded-full transition-all duration-300"
              style={{ left: `${peakIntensity}%` }}
              title={`Peak: ${Math.round(peakIntensity)}%`}
            />
          </div>

          <div className="flex justify-between text-xs text-purple-400">
            <span>Chill</span>
            <span>Peak: {Math.round(peakIntensity)}%</span>
            <span>Legendary</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-300">Recent Activity</span>
            <span className="text-xs text-purple-400">{recentReactions.length} reactions</span>
          </div>

          {recentReactions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {recentReactions.slice(-8).map((reaction) => (
                <div
                  key={reaction.id}
                  className="flex items-center space-x-1 bg-white/10 rounded-full px-2 py-1 text-xs animate-pulse"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-purple-300">{reaction.user}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-purple-400 text-sm">Send reactions to boost the vibe! 🚀</span>
            </div>
          )}
        </div>

        {/* Intensity Milestones */}
        <div className="grid grid-cols-5 gap-1 text-center">
          {[
            { threshold: 20, emoji: "🌙", label: "Chill" },
            { threshold: 40, emoji: "✨", label: "Medium" },
            { threshold: 60, emoji: "💫", label: "High" },
            { threshold: 80, emoji: "⚡", label: "Epic" },
            { threshold: 100, emoji: "🔥", label: "Legendary" },
          ].map((milestone) => (
            <div
              key={milestone.threshold}
              className={`p-2 rounded-lg transition-all ${
                currentIntensity >= milestone.threshold
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110"
                  : "bg-white/5 text-purple-400"
              }`}
            >
              <div className="text-lg">{milestone.emoji}</div>
              <div className="text-xs">{milestone.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
