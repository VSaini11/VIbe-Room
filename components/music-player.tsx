"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import Image from "next/image"

interface Song {
  title: string
  artist: string
  album: string
  duration: number
  cover: string
}

interface MusicPlayerProps {
  song: Song
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
}

export function MusicPlayer({ song, currentTime, isPlaying, onPlayPause }: MusicPlayerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentTime / song.duration) * 100

  return (
    <div className="space-y-6">
      {/* Album Art */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-300 via-orange-200 to-purple-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden border border-white/20">
            <Image src={song.cover || "/placeholder.svg"} alt={`${song.title} cover`} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">{song.title}</h2>
        <p className="text-sky-300">{song.artist}</p>
        <p className="text-orange-300 text-sm">{song.album}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-orange-300 to-purple-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-sky-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <Button variant="ghost" size="sm" className="text-sky-300 hover:text-white hover:bg-white/10">
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full gradient-bg-primary text-black hover:opacity-90 border-0 font-bold"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>

        <Button variant="ghost" size="sm" className="text-sky-300 hover:text-white hover:bg-white/10">
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center space-x-3">
        <Volume2 className="w-5 h-5 text-sky-300" />
        <div className="flex-1">
          <Slider defaultValue={[75]} max={100} step={1} className="w-full" />
        </div>
      </div>
    </div>
  )
}
