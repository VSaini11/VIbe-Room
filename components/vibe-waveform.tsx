"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface VibeWaveformProps {
  currentTime: number
  duration: number
}

export function VibeWaveform({ currentTime, duration }: VibeWaveformProps) {
  const [waveformData, setWaveformData] = useState<number[]>([])

  useEffect(() => {
    // Generate mock waveform data
    const data = Array.from({ length: 100 }, () => Math.random() * 100)
    setWaveformData(data)
  }, [])

  const progress = (currentTime / duration) * 100

  return (
    <Card className="glass-effect p-4 border-white/10">
      <h3 className="text-sky-200 font-medium mb-3">Vibe Waves</h3>

      <div className="relative h-20 flex items-end space-x-1 overflow-hidden">
        {waveformData.map((height, index) => {
          const barProgress = (index / waveformData.length) * 100
          const isActive = barProgress <= progress

          return (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-300 ${
                isActive ? "bg-gradient-to-t from-sky-400 via-orange-300 to-purple-400" : "bg-white/20"
              }`}
              style={{
                height: `${Math.max(height * 0.6, 10)}%`,
                transform: isActive ? "scaleY(1.2)" : "scaleY(1)",
              }}
            />
          )
        })}

        {/* Progress indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/60 transition-all duration-1000 ease-linear"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="mt-2 text-center">
        <span className="text-sky-300 text-sm">
          Collective vibe intensity: {Math.round((currentTime / duration) * 100)}%
        </span>
      </div>
    </Card>
  )
}
