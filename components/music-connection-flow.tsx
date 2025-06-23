"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

interface MusicConnectionFlowProps {
  onProviderConnected: (provider: string) => void
}

export function MusicConnectionFlow({ onProviderConnected }: MusicConnectionFlowProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle")

  // Handle Spotify OAuth popup
  const connectSpotify = () => {
    setSelectedProvider("spotify")
    setConnectionStatus("connecting")

    // Check if we have environment variables
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    if (!clientId || clientId === "your_spotify_client_id") {
      console.warn("Spotify Client ID not configured. Using demo mode.")
      // Simulate connection for demo
      setTimeout(() => {
        setConnectionStatus("connected")
        onProviderConnected("spotify")
      }, 2000)
      return
    }

    // Real Spotify OAuth URL
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/spotify`)
    const scopes = encodeURIComponent("streaming user-read-email user-read-private user-modify-playback-state")
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}&show_dialog=true`

    // Open popup window
    const popup = window.open(
      authUrl,
      "spotify-auth",
      "width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
    )

    if (!popup) {
      setConnectionStatus("error")
      return
    }

    // Listen for popup messages
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "spotify-auth-success") {
        setConnectionStatus("connected")
        onProviderConnected("spotify")
        window.removeEventListener("message", messageListener)
      } else if (event.data.type === "spotify-auth-error") {
        setConnectionStatus("error")
        window.removeEventListener("message", messageListener)
      }
    }

    window.addEventListener("message", messageListener)

    // Check if popup was closed without authentication
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed)
        if (connectionStatus === "connecting") {
          setConnectionStatus("error")
        }
        window.removeEventListener("message", messageListener)
      }
    }, 1000)
  }

  // Handle YouTube connection
  const connectYouTube = () => {
    setSelectedProvider("youtube")
    setConnectionStatus("connecting")

    // YouTube doesn't need OAuth for basic playback
    // Just simulate loading the YouTube IFrame API
    setTimeout(() => {
      setConnectionStatus("connected")
      onProviderConnected("youtube")
    }, 1500)
  }

  // Handle local file upload
  const connectLocalFiles = () => {
    setSelectedProvider("local")
    setConnectionStatus("connected")
    onProviderConnected("local")
  }

  const resetConnection = () => {
    setSelectedProvider(null)
    setConnectionStatus("idle")
  }

  // Provider Selection Screen
  if (connectionStatus === "idle") {
    return (
      <Card className="glass-effect p-6 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">🎵 Connect Music Source</h3>
        <p className="text-sky-200 mb-6">Choose how you want to add music to your Vibe Room:</p>

        <div className="grid gap-4">
          {/* Spotify Option */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Spotify Premium</h4>
                <p className="text-sm text-green-300">70M+ songs • High quality • Real-time sync</p>
                <p className="text-xs text-green-400">Opens popup for login (no redirect)</p>
              </div>
            </div>
            <Button onClick={connectSpotify} className="bg-green-500 hover:bg-green-600 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>

          {/* YouTube Option */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">YouTube Music</h4>
                <p className="text-sm text-red-300">Free access • Music videos • Huge library</p>
                <p className="text-xs text-red-400">No login required • Instant connection</p>
              </div>
            </div>
            <Button onClick={connectYouTube} className="bg-red-500 hover:bg-red-600 text-white">
              Connect
            </Button>
          </div>

          {/* Local Files Option */}
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Upload Files</h4>
                <p className="text-sm text-blue-300">Your music • MP3, WAV, FLAC • Full control</p>
                <p className="text-xs text-blue-400">No external accounts needed</p>
              </div>
            </div>
            <Button onClick={connectLocalFiles} className="bg-blue-500 hover:bg-blue-600 text-white">
              Connect
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Connecting State
  if (connectionStatus === "connecting") {
    return (
      <Card className="glass-effect p-6 border-white/10 text-center">
        <div className="space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-sky-300 border-t-transparent rounded-full mx-auto"></div>
          <h3 className="text-xl font-bold text-white">
            Connecting to{" "}
            {selectedProvider === "spotify" ? "Spotify" : selectedProvider === "youtube" ? "YouTube" : "Local Files"}
            ...
          </h3>

          {selectedProvider === "spotify" && (
            <div className="space-y-2">
              <p className="text-sky-200">A popup window has opened for Spotify login</p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="text-sm text-green-300 space-y-1">
                  <div>1. 🔐 Login with your Spotify Premium account</div>
                  <div>2. ✅ Authorize Vibe Room to control playback</div>
                  <div>3. 🎵 Start adding music to your room!</div>
                </div>
              </div>
              <p className="text-xs text-green-400">Don't see the popup? Check if it was blocked by your browser</p>
            </div>
          )}

          {selectedProvider === "youtube" && (
            <div className="space-y-2">
              <p className="text-sky-200">Setting up YouTube Music integration...</p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="text-sm text-red-300 space-y-1">
                  <div>1. 🔄 Loading YouTube IFrame API</div>
                  <div>2. 🎵 Preparing embedded player</div>
                  <div>3. ✅ Ready to search and play!</div>
                </div>
              </div>
            </div>
          )}

          <Button onClick={resetConnection} variant="outline" className="bg-black/20 border-white/20 text-sky-200">
            Cancel
          </Button>
        </div>
      </Card>
    )
  }

  // Connected State
  if (connectionStatus === "connected") {
    return (
      <Card className="glass-effect p-6 border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h3 className="text-xl font-bold text-white">
              Connected to{" "}
              {selectedProvider === "spotify" ? "Spotify" : selectedProvider === "youtube" ? "YouTube" : "Local Files"}!
            </h3>
            <p className="text-sky-200">You can now search and add music to your room</p>
          </div>
        </div>

        {/* Connection Info */}
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-sm text-green-300">✅ Music will play directly in this room - no redirects needed!</div>
        </div>
      </Card>
    )
  }

  // Error State
  if (connectionStatus === "error") {
    return (
      <Card className="glass-effect p-6 border-red-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Connection Failed</h3>
            <p className="text-red-300">
              Unable to connect to {selectedProvider === "spotify" ? "Spotify" : "YouTube"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedProvider === "spotify" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="text-sm text-red-300 space-y-1">
                <div>• Make sure you have Spotify Premium</div>
                <div>• Check if popup was blocked by browser</div>
                <div>• Verify Spotify Client ID is configured</div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={resetConnection} className="gradient-bg-primary text-black">
              Try Again
            </Button>
            <Button
              onClick={() => {
                setSelectedProvider(null)
                setConnectionStatus("idle")
              }}
              variant="outline"
              className="bg-black/20 border-white/20 text-sky-200"
            >
              Choose Different Provider
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return null
}
