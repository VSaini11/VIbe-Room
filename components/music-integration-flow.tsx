"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, ExternalLink, Play, Volume2, AlertCircle } from "lucide-react"

export function MusicIntegrationFlow() {
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">🎵 How Music Integration Works</h2>
        <p className="text-purple-200 mb-6">
          Different music providers work in different ways. Here's how each one handles playback:
        </p>

        <Tabs defaultValue="spotify" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="spotify" className="data-[state=active]:bg-green-500/20">
              Spotify
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-red-500/20">
              YouTube
            </TabsTrigger>
            <TabsTrigger value="local" className="data-[state=active]:bg-blue-500/20">
              Local Files
            </TabsTrigger>
          </TabsList>

          {/* Spotify Integration */}
          <TabsContent value="spotify">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Spotify Web Playback SDK</h3>
                  <p className="text-green-300">Plays music directly in your browser</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-green-300 mb-2">How it works:</h4>
                  <ol className="text-sm text-green-200 space-y-2">
                    <li>1. 🔐 You authenticate with Spotify (OAuth popup)</li>
                    <li>2. 🎵 Music plays directly in the browser (no redirect)</li>
                    <li>3. 🔄 All users hear the same song at the same time</li>
                    <li>4. 🎛️ Host controls playback for everyone</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">✅ Pros:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• High-quality audio streaming</li>
                      <li>• Huge music catalog (70M+ songs)</li>
                      <li>• No downloads needed</li>
                      <li>• Perfect sync across all users</li>
                      <li>• Official Spotify integration</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">❌ Requirements:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Spotify Premium subscription</li>
                      <li>• Active Spotify session</li>
                      <li>• Developer app setup</li>
                      <li>• OAuth authentication</li>
                    </ul>
                  </div>
                </div>

                {!spotifyConnected ? (
                  <Button
                    onClick={() => {
                      const clientId = "d7ad01f7810a45f197aa12f4b24c2f59"; // Replace this with your actual Spotify Client ID
                      const redirectUri = "http://127.0.0.1:3000/callback";
                      const scopes = [
                        "streaming",
                        "user-read-email",
                        "user-read-private"
                      ];

                      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}`;

                      // Open OAuth popup
                      window.open(authUrl, "spotify-auth", "width=500,height=600");

                      // Simulate successful connection after popup (for now)
                      setTimeout(() => setSpotifyConnected(true), 2000);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect to Spotify (Opens Popup)
                  </Button>
                ) : (
                  <div className="bg-green-500/20 border border-green-500/40 rounded-lg p-4 text-center">
                    <div className="text-green-300 font-medium mb-2">✅ Connected to Spotify!</div>
                    <div className="text-sm text-green-200">Music will play directly in this browser tab</div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* YouTube Integration */}
          <TabsContent value="youtube">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">YouTube Embedded Player</h3>
                  <p className="text-red-300">Embeds YouTube videos directly in the app</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-red-300 mb-2">How it works:</h4>
                  <ol className="text-sm text-red-200 space-y-2">
                    <li>1. 🔍 Search YouTube via API (no redirect)</li>
                    <li>2. 📺 Embed YouTube player in the app</li>
                    <li>3. 🎵 Music/videos play directly in the room</li>
                    <li>4. 🔄 JavaScript controls sync playback</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">✅ Pros:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Completely free to use</li>
                      <li>• Massive music library</li>
                      <li>• Music videos included</li>
                      <li>• No subscription required</li>
                      <li>• Works for everyone</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">⚠️ Limitations:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• May have ads (YouTube ads)</li>
                      <li>• Some videos geo-blocked</li>
                      <li>• Quality depends on video</li>
                      <li>• Copyright restrictions</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4">
                  <div className="text-red-300 font-medium mb-2">📺 YouTube Player Preview</div>
                  <div className="bg-black rounded-lg p-4 text-center">
                    <div className="text-white mb-2">🎵 Now Playing: "Lofi Hip Hop Mix"</div>
                    <div className="flex items-center justify-center space-x-4">
                      <Button size="sm" variant="ghost" className="text-white">
                        <Play className="w-4 h-4" />
                      </Button>
                      <div className="text-sm text-gray-400">2:34 / 45:22</div>
                      <Button size="sm" variant="ghost" className="text-white">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Embedded YouTube player - no redirect needed</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Local Files */}
          <TabsContent value="local">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Direct File Upload & Streaming</h3>
                  <p className="text-blue-300">Upload and stream your own music files</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-300 mb-2">How it works:</h4>
                  <ol className="text-sm text-blue-200 space-y-2">
                    <li>1. 📁 Upload MP3/WAV files to the server</li>
                    <li>2. 🎵 Files are stored and streamed from your server</li>
                    <li>3. 🔄 All users stream the same file simultaneously</li>
                    <li>4. 🎛️ Perfect sync using server timestamps</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">✅ Pros:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Complete control over music</li>
                      <li>• No subscription fees</li>
                      <li>• Perfect for rare tracks</li>
                      <li>• No copyright issues</li>
                      <li>• Works offline</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium text-white">⚠️ Considerations:</h5>
                    <ul className="text-sm text-purple-200 space-y-1">
                      <li>• Need to own the music files</li>
                      <li>• Upload time for large files</li>
                      <li>• Server storage costs</li>
                      <li>• Limited to uploaded library</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4">
                  <div className="text-blue-300 font-medium mb-2">📁 File Upload Process</div>
                  <div className="space-y-2 text-sm text-blue-200">
                    <div>1. Drag & drop MP3 file → Uploads to server</div>
                    <div>2. Server processes → Creates streaming endpoint</div>
                    <div>3. All users connect → Stream from same source</div>
                    <div>4. Perfect synchronization → Everyone hears same moment</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Technical Implementation Details */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🛠️ Technical Implementation</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-green-300">Spotify Implementation</h4>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
              <div className="text-green-200 space-y-1">
                <div>• Spotify Web Playback SDK</div>
                <div>• OAuth 2.0 authentication</div>
                <div>• Premium account required</div>
                <div>• Browser-based playback</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-red-300">YouTube Implementation</h4>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
              <div className="text-red-200 space-y-1">
                <div>• YouTube IFrame API</div>
                <div>• YouTube Data API v3</div>
                <div>• Embedded player</div>
                <div>• Free with ads</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-blue-300">Local Files Implementation</h4>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm">
              <div className="text-blue-200 space-y-1">
                <div>• File upload API</div>
                <div>• Audio streaming server</div>
                <div>• HTML5 Audio API</div>
                <div>• WebSocket sync</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="bg-orange-500/10 border border-orange-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-orange-300 mb-2">Important Notes:</h4>
            <ul className="text-sm text-orange-200 space-y-1">
              <li>
                • <strong>No redirects:</strong> Music plays directly in the Vibe Room
              </li>
              <li>
                • <strong>Synchronized playback:</strong> Everyone hears the same moment
              </li>
              <li>
                • <strong>Host controls:</strong> Room creator controls play/pause/skip
              </li>
              <li>
                • <strong>Real-time sync:</strong> WebSocket ensures perfect timing
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
