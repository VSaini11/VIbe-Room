"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Play, Pause, ExternalLink } from "lucide-react"
import type { Track } from "@/lib/music-providers"
import Image from "next/image"

interface SpotifyPlayerProps {
  onTrackSelect: (track: Track) => void
  currentTrack: Track | null
  isPlaying: boolean
  onPlayPause: () => void
}

export function SpotifyPlayer({ onTrackSelect, currentTrack, isPlaying, onPlayPause }: SpotifyPlayerProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [player, setPlayer] = useState<any>(null)

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token")
    if (token) {
      setAccessToken(token)
      initializeSpotifyPlayer(token)
    } else {
      // Need to authenticate first
      authenticateSpotify()
    }
  }, [])

  const authenticateSpotify = () => {
    // Real Spotify OAuth configuration
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "your_spotify_client_id"
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/spotify`)
    const scopes = encodeURIComponent("streaming user-read-email user-read-private user-modify-playback-state")

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`

    // Open popup for authentication
    const popup = window.open(
      authUrl,
      "spotify-auth",
      "width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
    )

    // Listen for popup messages
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "spotify-auth-success") {
        const token = event.data.accessToken
        setAccessToken(token)
        localStorage.setItem("spotify_access_token", token)
        initializeSpotifyPlayer(token)
        window.removeEventListener("message", messageListener)
      } else if (event.data.type === "spotify-auth-error") {
        console.error("Spotify authentication failed:", event.data.error)
        window.removeEventListener("message", messageListener)
      }
    }

    window.addEventListener("message", messageListener)

    // Check if popup was closed without authentication
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        window.removeEventListener("message", messageListener)
      }
    }, 1000)
  }

  const initializeSpotifyPlayer = async (token: string) => {
    // Load Spotify Web Playback SDK
    if (!window.Spotify) {
      const script = document.createElement("script")
      script.src = "https://sdk.scdn.co/spotify-player.js"
      script.async = true
      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = () => {
        createSpotifyPlayer(token)
      }
    } else {
      createSpotifyPlayer(token)
    }
  }

  const createSpotifyPlayer = (token: string) => {
    const spotifyPlayer = new window.Spotify.Player({
      name: "Vibe Room Player",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(token)
      },
      volume: 0.5,
    })

    // Error handling
    spotifyPlayer.addListener("initialization_error", ({ message }: any) => {
      console.error("Spotify initialization error:", message)
    })

    spotifyPlayer.addListener("authentication_error", ({ message }: any) => {
      console.error("Spotify authentication error:", message)
      // Clear invalid token and re-authenticate
      localStorage.removeItem("spotify_access_token")
      setAccessToken(null)
    })

    spotifyPlayer.addListener("ready", ({ device_id }: any) => {
      console.log("Spotify player ready with Device ID", device_id)
      setPlayer(spotifyPlayer)
    })

    // Connect to the player
    spotifyPlayer.connect()
  }

  const searchSpotify = async () => {
    if (!searchQuery.trim() || !accessToken) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (response.ok) {
        const data = await response.json()
        const tracks: Track[] = data.tracks.items.map((item: any) => ({
          id: item.id,
          title: item.name,
          artist: item.artists[0].name,
          album: item.album.name,
          duration: Math.floor(item.duration_ms / 1000),
          cover: item.album.images[0]?.url || "/placeholder.svg",
          previewUrl: item.preview_url,
          externalUrl: item.external_urls.spotify,
        }))
        setSearchResults(tracks)
      } else if (response.status === 401) {
        // Token expired, re-authenticate
        localStorage.removeItem("spotify_access_token")
        setAccessToken(null)
        authenticateSpotify()
      }
    } catch (error) {
      console.error("Spotify search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const playTrack = async (track: Track) => {
    if (!player || !accessToken) return

    try {
      // Use Spotify Web API to start playback
      const response = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        onTrackSelect(track)
      }
    } catch (error) {
      console.error("Failed to play track:", error)
    }
  }

  // If not authenticated, show authentication prompt
  if (!accessToken) {
    return (
      <Card className="glass-effect p-6 border-white/10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <ExternalLink className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Connect to Spotify</h3>
          <p className="text-sky-200">A popup will open for you to login with your Spotify Premium account</p>
          <Button onClick={authenticateSpotify} className="bg-green-500 hover:bg-green-600 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Login with Spotify
          </Button>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="text-sm text-green-300">⚠️ Requires Spotify Premium subscription</div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Current Track */}
      {currentTrack && (
        <Card className="glass-effect p-4 border-white/10">
          <div className="flex items-center space-x-4">
            <Image
              src={currentTrack.cover || "/placeholder.svg"}
              alt={currentTrack.title}
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold">{currentTrack.title}</h3>
              <p className="text-sky-300">{currentTrack.artist}</p>
              <p className="text-orange-300 text-sm">{currentTrack.album}</p>
            </div>
            <Button onClick={onPlayPause} className="w-12 h-12 rounded-full gradient-bg-primary text-black">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="glass-effect p-4 border-white/10">
        <h3 className="text-white font-medium mb-3">🎵 Search Spotify</h3>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchSpotify()}
            className="bg-black/20 border-white/20 text-white placeholder:text-sky-300/70"
          />
          <Button onClick={searchSpotify} disabled={isSearching} className="gradient-bg-primary text-black">
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
              <Button size="sm" onClick={() => playTrack(track)} className="gradient-bg-primary text-black">
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
      <Card className="glass-effect p-3 border-green-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-sm">Connected to Spotify Premium</span>
        </div>
      </Card>
    </div>
  )
}
