"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReactionSystemProps {
  onReaction: (emoji: string) => void
}

const reactions = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "💫", label: "Vibes" },
  { emoji: "✨", label: "Magic" },
  { emoji: "💜", label: "Love" },
  { emoji: "🌙", label: "Dreamy" },
  { emoji: "⚡", label: "Energy" },
  { emoji: "🎵", label: "Musical" },
  { emoji: "💭", label: "Thoughtful" },
]

export function ReactionSystem({ onReaction }: ReactionSystemProps) {
  return (
    <Card className="glass-effect p-4 border-white/10">
      <h3 className="text-sky-200 font-medium mb-3">Quick Reactions</h3>
      <div className="grid grid-cols-4 gap-2">
        {reactions.map((reaction) => (
          <Button
            key={reaction.emoji}
            variant="ghost"
            onClick={() => onReaction(reaction.emoji)}
            className="h-12 text-2xl hover:bg-white/20 hover:scale-110 transition-all duration-200 border border-white/10 hover:border-sky-300/30"
            title={reaction.label}
          >
            {reaction.emoji}
          </Button>
        ))}
      </div>
    </Card>
  )
}
