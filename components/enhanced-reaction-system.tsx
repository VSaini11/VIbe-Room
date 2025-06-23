"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Reaction {
  id: string
  emoji: string
  user: string
  timestamp: number
  intensity: number
}

interface EnhancedReactionSystemProps {
  onReaction: (emoji: string, intensity: number) => void
  currentIntensity: number
}

const reactions = [
  { emoji: "🔥", label: "Fire", intensity: 10, color: "hover:bg-orange-500/20" },
  { emoji: "⚡", label: "Energy", intensity: 9, color: "hover:bg-yellow-500/20" },
  { emoji: "💥", label: "Boom", intensity: 8, color: "hover:bg-red-500/20" },
  { emoji: "🎉", label: "Party", intensity: 7, color: "hover:bg-pink-500/20" },
  { emoji: "💫", label: "Vibes", intensity: 6, color: "hover:bg-purple-500/20" },
  { emoji: "✨", label: "Magic", intensity: 5, color: "hover:bg-blue-500/20" },
  { emoji: "💜", label: "Love", intensity: 4, color: "hover:bg-purple-400/20" },
  { emoji: "🎵", label: "Musical", intensity: 4, color: "hover:bg-indigo-500/20" },
  { emoji: "🌙", label: "Dreamy", intensity: 2, color: "hover:bg-blue-400/20" },
  { emoji: "💭", label: "Thoughtful", intensity: 1, color: "hover:bg-gray-500/20" },
]

export function EnhancedReactionSystem({ onReaction, currentIntensity }: EnhancedReactionSystemProps) {
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})
  const [lastReactionTime, setLastReactionTime] = useState<Record<string, number>>({})

  const handleReaction = (emoji: string, intensity: number) => {
    const now = Date.now()
    const lastTime = lastReactionTime[emoji] || 0

    // Prevent spam (max 1 reaction per second per emoji)
    if (now - lastTime < 1000) return

    setLastReactionTime((prev) => ({ ...prev, [emoji]: now }))
    setReactionCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }))

    onReaction(emoji, intensity)

    // Reset count after 5 seconds
    setTimeout(() => {
      setReactionCounts((prev) => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 0) - 1) }))
    }, 5000)
  }

  const getReactionScale = (baseIntensity: number) => {
    // Scale reaction buttons based on current vibe intensity
    if (currentIntensity >= 60) return "scale-110"
    if (currentIntensity >= 40) return "scale-105"
    return "scale-100"
  }

  const getReactionGlow = (intensity: number) => {
    if (currentIntensity >= intensity) {
      return "ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/25"
    }
    return ""
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-purple-200 font-medium">Quick Reactions</h3>
        <div className="text-xs text-purple-400">Boost the vibe with reactions! 🚀</div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {reactions.map((reaction) => {
          const count = reactionCounts[reaction.emoji] || 0
          const isActive = count > 0
          const canBoostVibe = currentIntensity < reaction.intensity * 8

          return (
            <div key={reaction.emoji} className="relative">
              <Button
                variant="ghost"
                onClick={() => handleReaction(reaction.emoji, reaction.intensity)}
                className={`
                  h-16 w-full text-2xl transition-all duration-200 
                  ${reaction.color} 
                  ${getReactionScale(reaction.intensity)} 
                  ${getReactionGlow(reaction.intensity)}
                  ${isActive ? "bg-white/20 animate-pulse" : ""}
                  ${canBoostVibe ? "border border-purple-400/30" : ""}
                `}
                title={`${reaction.label} (Intensity: ${reaction.intensity})`}
              >
                <div className="flex flex-col items-center">
                  <span className={isActive ? "animate-bounce" : ""}>{reaction.emoji}</span>
                  {count > 0 && <span className="text-xs text-purple-300 font-bold">+{count}</span>}
                </div>
              </Button>

              {/* Intensity indicator */}
              <div className="absolute -top-1 -right-1">
                <div
                  className={`
                  w-3 h-3 rounded-full text-xs flex items-center justify-center
                  ${
                    reaction.intensity >= 8
                      ? "bg-red-500"
                      : reaction.intensity >= 6
                        ? "bg-orange-500"
                        : reaction.intensity >= 4
                          ? "bg-yellow-500"
                          : reaction.intensity >= 2
                            ? "bg-blue-500"
                            : "bg-gray-500"
                  }
                `}
                >
                  <span className="text-white text-xs font-bold">{reaction.intensity}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reaction Tips */}
      <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="text-xs text-purple-300 space-y-1">
          <div className="flex items-center justify-between">
            <span>💡 Pro Tips:</span>
            <span className="text-purple-400">Current: {Math.round(currentIntensity)}%</span>
          </div>
          <div>• Higher intensity reactions boost the vibe more</div>
          <div>• Get everyone reacting to reach LEGENDARY status!</div>
          <div>• Different reactions create different vibes</div>
        </div>
      </div>
    </Card>
  )
}
