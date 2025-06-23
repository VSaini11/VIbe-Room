"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Plus, Upload } from "lucide-react"
import type { Track, MusicProvider } from "@/lib/music-providers"
import Image from "next/image"

interface MusicSearchProps {
  provider: MusicProvider
  onTrackSelect: (track: Track) => void
  onFileUpload?: (file: File) => void
}

export function MusicSearch({ provider, onTrackSelect, onFileUpload }: MusicSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const tracks = await provider.search(query)
      setResults(tracks)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onFileUpload) {
      onFileUpload(file)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-purple-200 font-medium">Add Music - {provider.name}</h3>
      </div>

      {/* Search */}
      <div className="flex space-x-2">
        <Input
          placeholder={`Search ${provider.name}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* File Upload (for local files) */}
      {provider.name === "Local Files" && (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
          <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" id="audio-upload" />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-purple-300 mx-auto mb-2" />
            <p className="text-purple-200">Upload audio file</p>
            <p className="text-purple-400 text-sm">MP3, WAV, FLAC supported</p>
          </label>
        </div>
      )}

      {/* Results */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {results.map((track) => (
          <div
            key={track.id}
            className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
              <p className="text-purple-300 text-sm truncate">{track.artist}</p>
            </div>

            <Button
              size="sm"
              onClick={() => onTrackSelect(track)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}
