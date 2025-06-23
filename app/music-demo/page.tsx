"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MusicSearch } from "@/components/music-search"
import { SpotifyProvider, YouTubeProvider, LocalFileProvider } from "@/lib/music-providers"
import type { Track, MusicProvider } from "@/lib/music-providers"
import { Music, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MusicDemoPage() {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  const [currentProvider, setCurrentProvider] = useState<MusicProvider | null>(null)

  const handleTrackSelect = (track: Track) => {
    setSelectedTracks((prev) => [...prev, track])
  }

  const handleFileUpload = async (file: File) => {
    // Simulate file upload
    const mockTrack: Track = {
      id: Math.random().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Artist",
      album: "My Collection",
      duration: 180,
      cover: "/placeholder.svg?height=300&width=300",
      previewUrl: URL.createObjectURL(file),
    }
    handleTrackSelect(mockTrack)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vibe Room
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Music Integration Demo
            </h1>
            <p className="text-purple-200">Test different music sources for your Vibe Room</p>
          </div>
        </div>

        <Tabs defaultValue="spotify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger
              value="spotify"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
            >
              Spotify Integration
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
              YouTube Integration
            </TabsTrigger>
            <TabsTrigger value="local" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
              Local File Upload
            </TabsTrigger>
          </TabsList>

          {/* Spotify Demo */}
          <TabsContent value="spotify" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Spotify Integration</h2>
                  <p className="text-green-300">Stream from Spotify's 70+ million songs</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Features:</h3>
                  <ul className="space-y-2 text-purple-200">
                    <li>• Full catalog access with Spotify Premium</li>
                    <li>• Real-time playback synchronization</li>
                    <li>• Search by track, artist, or album</li>
                    <li>• High-quality audio streaming</li>
                    <li>• Playlist integration</li>
                  </ul>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-300 mb-2">Setup Required:</h4>
                    <ol className="text-sm text-green-200 space-y-1">
                      <li>1. Create Spotify Developer App</li>
                      <li>2. Add SPOTIFY_CLIENT_ID to environment</li>
                      <li>3. Configure OAuth redirect URLs</li>
                      <li>4. Users need Spotify Premium</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <MusicSearch provider={new SpotifyProvider()} onTrackSelect={handleTrackSelect} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* YouTube Demo */}
          <TabsContent value="youtube" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">YouTube Integration</h2>
                  <p className="text-red-300">Access YouTube's massive music library</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Features:</h3>
                  <ul className="space-y-2 text-purple-200">
                    <li>• Huge music catalog (free access)</li>
                    <li>• Music videos and audio tracks</li>
                    <li>• Great for discovering new artists</li>
                    <li>• Works with YouTube Music</li>
                    <li>• No premium subscription required</li>
                  </ul>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-red-300 mb-2">Setup Required:</h4>
                    <ol className="text-sm text-red-200 space-y-1">
                      <li>1. Enable YouTube Data API v3</li>
                      <li>2. Add YOUTUBE_API_KEY to environment</li>
                      <li>3. Configure API quotas</li>
                      <li>4. Handle content restrictions</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <MusicSearch provider={new YouTubeProvider()} onTrackSelect={handleTrackSelect} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Local Files Demo */}
          <TabsContent value="local" className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Local File Upload</h2>
                  <p className="text-blue-300">Upload and share your personal music collection</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Features:</h3>
                  <ul className="space-y-2 text-purple-200">
                    <li>• Upload MP3, WAV, FLAC files</li>
                    <li>• Perfect for rare or personal tracks</li>
                    <li>• No subscription required</li>
                    <li>• Full control over your music</li>
                    <li>• Automatic metadata extraction</li>
                  </ul>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-300 mb-2">Setup Required:</h4>
                    <ol className="text-sm text-blue-200 space-y-1">
                      <li>1. Configure file upload endpoint</li>
                      <li>2. Set up file storage (local/cloud)</li>
                      <li>3. Add metadata extraction</li>
                      <li>4. Implement streaming server</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <MusicSearch
                    provider={new LocalFileProvider()}
                    onTrackSelect={handleTrackSelect}
                    onFileUpload={handleFileUpload}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Tracks */}
        {selectedTracks.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Selected Tracks ({selectedTracks.length})</h3>
            <div className="grid gap-3 max-h-64 overflow-y-auto">
              {selectedTracks.map((track, index) => (
                <div key={`${track.id}-${index}`} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Image
                    src={track.cover || "/placeholder.svg"}
                    alt={track.title}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-purple-300 text-sm truncate">{track.artist}</p>
                    {track.album && <p className="text-purple-400 text-xs truncate">{track.album}</p>}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
