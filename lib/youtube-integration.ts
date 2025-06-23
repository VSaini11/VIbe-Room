// YouTube IFrame API integration

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT: any
  }
}

export class YouTubePlayer {
  private player: any = null
  private isReady = false

  async initialize(containerId: string) {
    return new Promise((resolve, reject) => {
      if (!window.YT) {
        // Load YouTube IFrame API
        const script = document.createElement("script")
        script.src = "https://www.youtube.com/iframe_api"
        document.body.appendChild(script)

        window.onYouTubeIframeAPIReady = () => {
          this.createPlayer(containerId).then(resolve).catch(reject)
        }
      } else {
        this.createPlayer(containerId).then(resolve).catch(reject)
      }
    })
  }

  private async createPlayer(containerId: string) {
    return new Promise((resolve, reject) => {
      this.player = new window.YT.Player(containerId, {
        height: "315",
        width: "560",
        playerVars: {
          playsinline: 1,
          controls: 1,
        },
        events: {
          onReady: () => {
            this.isReady = true
            console.log("YouTube player ready")
            resolve(this.player)
          },
          onError: (error: any) => {
            console.error("YouTube player error:", error)
            reject(error)
          },
        },
      })
    })
  }

  async loadVideo(videoId: string) {
    if (!this.isReady) {
      throw new Error("YouTube player not ready")
    }

    this.player.loadVideoById(videoId)
  }

  async play() {
    this.player.playVideo()
  }

  async pause() {
    this.player.pauseVideo()
  }

  async seekTo(seconds: number) {
    this.player.seekTo(seconds, true)
  }

  getCurrentTime() {
    return this.player.getCurrentTime()
  }

  getDuration() {
    return this.player.getDuration()
  }

  getPlayerState() {
    return this.player.getPlayerState()
  }
}
