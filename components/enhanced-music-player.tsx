"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MusicConnectionFlow } from "./music-connection-flow"
import { SpotifyPlayer } from "@/components/spotify-player"
import { YouTubePlayer } from "@/components/youtube-player"
import { LocalFilePlayer } from "@/components/local-file-player"
import type { Track } from "@/lib/music-providers"
import { Music, Plus } from "lucide-react"

interface EnhancedMusicPlayerProps {
  roomId: string
  onTrackChange?: (track: Track) => void
  currentTime: number
  isPlaying: boolean
  onPlayPause: () => void
}

export function EnhancedMusicPlayer({
  roomId,
  onTrackChange,
  currentTime,
  isPlaying,
  onPlayPause,
}: EnhancedMusicPlayerProps) {
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)
  const [showConnectionFlow, setShowConnectionFlow] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)

  const handleProviderConnected = (provider: string) => {
    setConnectedProvider(provider)
    setShowConnectionFlow(false)
    console.log(`✅ Successfully connected to ${provider}`)
  }

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track)
    onTrackChange?.(track)
  }

  // If no provider connected, show connection button
  if (!connectedProvider) {
    return (
      <Card className="glass-effect p-6 border-white/10">
        <div className="text-center space-y-4">
          <Music className="w-12 h-12 text-sky-300 mx-auto" />
          <h3 className="text-sky-200 font-medium">No music connected</h3>
          <p className="text-sky-400 text-sm">Choose a music source to start the vibe</p>

          {!showConnectionFlow ? (
            <Button
              onClick={() => setShowConnectionFlow(true)}
              className="gradient-bg-primary text-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Music
            </Button>
          ) : (
            <div className="space-y-4">
              <MusicConnectionFlow onProviderConnected={handleProviderConnected} />
              <Button
                variant="outline"
                onClick={() => setShowConnectionFlow(false)}
                className="bg-black/20 border-white/20 text-sky-200 hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    )
  }

  // Show the appropriate player based on connected provider
  return (
    <div className="space-y-4">
      {connectedProvider === "spotify" && (
        <SpotifyPlayer
          onTrackSelect={handleTrackSelect}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
        />
      )}

      {connectedProvider === "youtube" && (
        <YouTubePlayer
          onTrackSelect={handleTrackSelect}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
        />
      )}

      {connectedProvider === "local" && (
        <LocalFilePlayer
          onTrackSelect={handleTrackSelect}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
        />
      )}

      {/* Add More Music Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowConnectionFlow(true)}
          variant="outline"
          className="bg-black/20 border-white/20 text-sky-200 hover:bg-white/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More Music
        </Button>
      </div>

      {/* Connection Flow Overlay */}
      {showConnectionFlow && (
        <Card className="glass-effect p-6 border-white/10">
          <MusicConnectionFlow onProviderConnected={handleProviderConnected} />
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowConnectionFlow(false)}
              className="bg-black/20 border-white/20 text-sky-200 hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
