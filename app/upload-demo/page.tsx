"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Music, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UploadedTrack {
  id: string
  title: string
  artist: string
  duration: number
  size: string
  cover: string
  file: File
}

export default function UploadDemoPage() {
  const [uploadedTracks, setUploadedTracks] = useState<UploadedTrack[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Create mock track data
      const track: UploadedTrack = {
        id: Math.random().toString(36).substring(7),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        duration: Math.floor(Math.random() * 300) + 60, // Random duration 1-6 minutes
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        cover: "/placeholder.svg?height=300&width=300",
        file: file,
      }

      setUploadedTracks((prev) => [...prev, track])
    }

    setIsUploading(false)
    setUploadProgress(0)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const removeTrack = (id: string) => {
    setUploadedTracks((prev) => prev.filter((track) => track.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/music-demo">
            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Music Demo
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Local File Upload Demo
            </h1>
            <p className="text-purple-200">Upload your music files to share in Vibe Rooms</p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8">
          <div
            className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-purple-400 transition-colors cursor-pointer"
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
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {!isUploading ? (
              <>
                <Upload className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Drop your music files here</h3>
                <p className="text-purple-300 mb-4">or click to browse your computer</p>
                <div className="flex justify-center space-x-4 text-sm text-purple-400">
                  <span>• MP3</span>
                  <span>• WAV</span>
                  <span>• FLAC</span>
                  <span>• M4A</span>
                </div>
              </>
            ) : (
              <>
                <div className="animate-spin w-12 h-12 border-2 border-purple-300 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-white mb-4">Uploading your music...</h3>
                <Progress value={uploadProgress} className="w-full max-w-md mx-auto" />
                <p className="text-purple-300 mt-2">{uploadProgress}% complete</p>
              </>
            )}
          </div>
        </Card>

        {/* Uploaded Tracks */}
        {uploadedTracks.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Uploaded Tracks ({uploadedTracks.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadedTracks([])}
                className="bg-white/5 border-white/20 text-purple-200 hover:bg-white/10"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {uploadedTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Image
                    src={track.cover || "/placeholder.svg"}
                    alt={track.title}
                    width={56}
                    height={56}
                    className="rounded-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{track.title}</h4>
                    <p className="text-purple-300 text-sm">{track.artist}</p>
                    <div className="flex items-center space-x-4 text-xs text-purple-400 mt-1">
                      <span>{formatDuration(track.duration)}</span>
                      <span>{track.size}</span>
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Ready</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Music className="w-4 h-4 mr-1" />
                      Add to Room
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrack(track.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Stats */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-300">{uploadedTracks.length}</p>
                  <p className="text-sm text-purple-400">Tracks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-300">
                    {uploadedTracks.reduce((acc, track) => acc + track.duration, 0)} min
                  </p>
                  <p className="text-sm text-purple-400">Total Duration</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-300">
                    {uploadedTracks.reduce((acc, track) => acc + Number.parseFloat(track.size), 0).toFixed(1)} MB
                  </p>
                  <p className="text-sm text-purple-400">Total Size</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300">For Users:</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>• Drag & drop audio files or click to browse</li>
                <li>• Supported formats: MP3, WAV, FLAC, M4A</li>
                <li>• Files are processed and ready instantly</li>
                <li>• Add tracks directly to your Vibe Room</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-purple-300">Technical Features:</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li>• Automatic metadata extraction</li>
                <li>• Audio format conversion if needed</li>
                <li>• Streaming-optimized encoding</li>
                <li>• Secure file storage and access</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
