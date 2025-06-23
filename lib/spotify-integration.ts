// Real Spotify Web Playback SDK implementation

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: any
  }
}

export class SpotifyPlayer {
  private player: any = null
  private deviceId = ""
  private accessToken = ""

  async initialize(accessToken: string) {
    this.accessToken = accessToken

    return new Promise((resolve, reject) => {
      // Load Spotify Web Playback SDK
      if (!window.Spotify) {
        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true
        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
          this.createPlayer().then(resolve).catch(reject)
        }
      } else {
        this.createPlayer().then(resolve).catch(reject)
      }
    })
  }

  private async createPlayer() {
    this.player = new window.Spotify.Player({
      name: "Vibe Room Player",
      getOAuthToken: (cb: (token: string) => void) => {
        cb(this.accessToken)
      },
      volume: 0.5,
    })

    // Error handling
    this.player.addListener("initialization_error", ({ message }: any) => {
      console.error("Spotify initialization error:", message)
    })

    this.player.addListener("authentication_error", ({ message }: any) => {
      console.error("Spotify authentication error:", message)
    })

    this.player.addListener("account_error", ({ message }: any) => {
      console.error("Spotify account error:", message)
    })

    // Ready
    this.player.addListener("ready", ({ device_id }: any) => {
      console.log("Spotify player ready with Device ID", device_id)
      this.deviceId = device_id
    })

    // Connect to the player
    const connected = await this.player.connect()
    if (!connected) {
      throw new Error("Failed to connect to Spotify player")
    }

    return this.player
  }

  async playTrack(trackUri: string) {
    if (!this.deviceId) {
      throw new Error("Spotify player not ready")
    }

    // Use Spotify Web API to start playback
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: "PUT",
      body: JSON.stringify({
        uris: [trackUri],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to start playback")
    }
  }

  async pause() {
    await this.player.pause()
  }

  async resume() {
    await this.player.resume()
  }

  async seek(positionMs: number) {
    await this.player.seek(positionMs)
  }

  getCurrentState() {
    return this.player.getCurrentState()
  }
}
