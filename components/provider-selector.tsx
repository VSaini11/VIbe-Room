"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music, Youtube, Upload, Headphones } from "lucide-react"
import { type MusicProvider, SpotifyProvider, YouTubeProvider, LocalFileProvider } from "@/lib/music-providers"

interface ProviderSelectorProps {
  onProviderSelect: (provider: MusicProvider) => void
}

const providers = [
  {
    name: "Spotify",
    icon: Music,
    description: "Stream from Spotify Premium",
    color: "from-green-500 to-green-600",
    provider: SpotifyProvider,
  },
  {
    name: "YouTube",
    icon: Youtube,
    description: "Play from YouTube Music",
    color: "from-red-500 to-red-600",
    provider: YouTubeProvider,
  },
  {
    name: "Local Files",
    icon: Upload,
    description: "Upload your own music",
    color: "from-blue-500 to-blue-600",
    provider: LocalFileProvider,
  },
]

export function ProviderSelector({ onProviderSelect }: ProviderSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const handleProviderSelect = async (providerClass: any, name: string) => {
    setSelectedProvider(name)

    try {
      const provider = new providerClass()

      // Handle authentication if needed
      if (name === "Spotify") {
        await provider.authenticate()
      }

      onProviderSelect(provider)
    } catch (error) {
      console.error(`Failed to initialize ${name}:`, error)
      setSelectedProvider(null)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Headphones className="w-5 h-5 text-purple-300" />
        <h3 className="text-purple-200 font-medium">Choose Music Source</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const Icon = provider.icon
          const isSelected = selectedProvider === provider.name

          return (
            <Button
              key={provider.name}
              variant="outline"
              onClick={() => handleProviderSelect(provider.provider, provider.name)}
              disabled={isSelected}
              className={`h-auto p-4 flex flex-col items-center space-y-2 bg-white/5 border-white/20 hover:bg-white/10 ${
                isSelected ? "ring-2 ring-purple-400" : ""
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${provider.color} flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">{provider.name}</p>
                <p className="text-purple-300 text-xs">{provider.description}</p>
              </div>
              {isSelected && <div className="text-xs text-purple-400">Connecting...</div>}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
