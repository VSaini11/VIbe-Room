"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Play, Pause } from "lucide-react"
import type { Track } from "@/lib/music-providers"
import Image from "next/image"

interface YouTubePlayerProps {
  onTrackSelect: (track: Track) => void
  currentTrack: Track | null
  isPlaying: boolean
  onPlayPause: () => void
}

export function YouTubePlayer({ onTrackSelect, currentTrack, isPlaying, onPlayPause }: YouTubePlayerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [player, setPlayer] = useState<any>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  // Initialize YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        initializeYouTubePlayer()
      }
    } else {
      initializeYouTubePlayer()
    }
  }, [])

  const initializeYouTubePlayer = () => {
    if (playerRef.current) {
      const ytPlayer = new window.YT.Player(playerRef.current, {
        height: "200",
        width: "100%",
        videoId: "jfKfPfyJRdk", // Default lofi video
        playerVars: {
          playsinline: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            console.log("YouTube player ready")
            setPlayer(ytPlayer)
          },
          onStateChange: (event: any) => {
            // Handle state changes
          },
        },
      })
    }
  }

  const searchYouTube = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Use YouTube Data API v3
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "your_youtube_api_key"
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
          searchQuery + " music",
        )}&type=video&key=${apiKey}`,
      )

      if (response.ok) {
        const data = await response.json()
        const tracks: Track[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          album: "",
          duration: 0, // Would need additional API call to get duration
          cover: item.snippet.thumbnails.medium.url,
          previewUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          externalUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }))
        setSearchResults(tracks)
      } else {
        console.error("YouTube search failed:", response.statusText)
      }
    } catch (error) {
      console.error("YouTube search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const playVideo = (track: Track) => {
    if (player) {
      player.loadVideoById(track.id)
      onTrackSelect(track)
    }
  }

  const togglePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
      onPlayPause()
    }
  }

  return (
    <div className="space-y-4">
      {/* YouTube Player */}
      <Card className="glass-effect p-4 border-white/10">
        <h3 className="text-white font-medium mb-3">🎵 YouTube Music Player</h3>
        <div className="relative rounded-lg overflow-hidden mb-4">
          <div ref={playerRef} className="w-full" />
        </div>

        {/* Custom Controls */}
        {currentTrack && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-sky-300 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <Button onClick={togglePlayPause} className="w-10 h-10 rounded-full gradient-bg-primary text-black ml-4">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </Card>

      {/* Search */}
      <Card className="glass-effect p-4 border-white/10">
        <h3 className="text-white font-medium mb-3">🔍 Search YouTube</h3>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search for music videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchYouTube()}
            className="bg-black/20 border-white/20 text-white placeholder:text-sky-300/70"
          />
          <Button onClick={searchYouTube} disabled={isSearching} className="gradient-bg-primary text-black">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-custom">
          {searchResults.map((track) => (
            <div
              key={track.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 hover:bg-white/10 transition-colors border border-white/10"
            >
              <Image
                src={track.cover || "/placeholder.svg"}
                alt={track.title}
                width={40}
                height={40}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{track.title}</p>
                <p className="text-sky-300 text-sm truncate">{track.artist}</p>
              </div>
              <Button size="sm" onClick={() => playVideo(track)} className="gradient-bg-primary text-black">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="text-center py-4 text-sky-400">No results found for "{searchQuery}"</div>
        )}
      </Card>

      {/* Connection Status */}
      <Card className="glass-effect p-3 border-red-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-red-300 text-sm">Connected to YouTube Music</span>
        </div>
      </Card>
    </div>
  )
}
