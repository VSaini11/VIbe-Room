"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Play, Pause, Music, X } from "lucide-react"
import type { Track } from "@/lib/music-providers"
import Image from "next/image"

interface LocalFilePlayerProps {
  onTrackSelect: (track: Track) => void
  currentTrack: Track | null
  isPlaying: boolean
  onPlayPause: () => void
}

export function LocalFilePlayer({ onTrackSelect, currentTrack, isPlaying, onPlayPause }: LocalFilePlayerProps) {
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!file.type.startsWith("audio/")) {
        console.error("Invalid file type:", file.type)
        continue
      }

      // Create object URL for playback
      const audioUrl = URL.createObjectURL(file)

      // Create audio element to get duration
      const audio = new Audio(audioUrl)

      const track: Track = {
        id: Math.random().toString(36).substring(7),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local Artist",
        album: "My Collection",
        duration: 0, // Will be updated when audio loads
        cover: "/placeholder.svg?height=300&width=300",
        previewUrl: audioUrl,
      }

      // Get duration when audio loads
      audio.addEventListener("loadedmetadata", () => {
        track.duration = Math.floor(audio.duration)
        setUploadedTracks((prev) => prev.map((t) => (t.id === track.id ? { ...t, duration: track.duration } : t)))
      })

      setUploadedTracks((prev) => [...prev, track])
    }

    setIsUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const playTrack = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.previewUrl || ""
      audioRef.current.play()
    }
    onTrackSelect(track)
  }

  const removeTrack = (trackId: string) => {
    setUploadedTracks((prev) => prev.filter((t) => t.id !== trackId))
    if (currentTrack?.id === trackId) {
      onTrackSelect(null as any)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} onPlay={() => onPlayPause()} onPause={() => onPlayPause()} controls className="hidden" />

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
            <Button
              onClick={() => {
                if (audioRef.current) {
                  if (isPlaying) {
                    audioRef.current.pause()
                  } else {
                    audioRef.current.play()
                  }
                }
              }}
              className="w-12 h-12 rounded-full gradient-bg-primary text-black"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Area */}
      <Card className="glass-effect p-6 border-white/10">
        <h3 className="text-white font-medium mb-4">📁 Upload Music Files</h3>

        <div
          className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-sky-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {!isUploading ? (
            <>
              <Upload className="w-12 h-12 text-sky-300 mx-auto mb-4" />
              <h4 className="text-white font-medium mb-2">Drop your music files here</h4>
              <p className="text-sky-200 text-sm mb-4">or click to browse your computer</p>
              <div className="flex justify-center space-x-4 text-sm text-sky-400">
                <span>• MP3</span>
                <span>• WAV</span>
                <span>• FLAC</span>
                <span>• M4A</span>
              </div>
            </>
          ) : (
            <>
              <div className="animate-spin w-8 h-8 border-2 border-sky-300 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">Uploading files...</p>
            </>
          )}
        </div>
      </Card>

      {/* Uploaded Tracks */}
      {uploadedTracks.length > 0 && (
        <Card className="glass-effect p-4 border-white/10">
          <h3 className="text-white font-medium mb-3">🎵 Your Music Library ({uploadedTracks.length})</h3>
          <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-custom">
            {uploadedTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-black/20 hover:bg-white/10 transition-colors border border-white/10"
              >
                <Music className="w-8 h-8 text-sky-300" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-sky-300 text-sm">
                    {track.duration > 0 ? formatDuration(track.duration) : "Loading..."}
                  </p>
                </div>
                <Button size="sm" onClick={() => playTrack(track)} className="gradient-bg-primary text-black">
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTrack(track.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Connection Status */}
      <Card className="glass-effect p-3 border-blue-500/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-300 text-sm">Local Files Ready</span>
        </div>
      </Card>
    </div>
  )
}
