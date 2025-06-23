// Music provider interfaces and implementations

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  previewUrl?: string
  externalUrl?: string
}

export interface MusicProvider {
  name: string
  search(query: string): Promise<Track[]>
  getTrack(id: string): Promise<Track>
  play(track: Track): Promise<void>
  pause(): Promise<void>
  getCurrentTime(): number
  setCurrentTime(time: number): Promise<void>
}

// Mock Spotify Provider for demo
export class SpotifyProvider implements MusicProvider {
  name = "Spotify"

  async search(query: string): Promise<Track[]> {
    // Mock search results
    return [
      {
        id: "1",
        title: "Midnight City",
        artist: "M83",
        album: "Hurry Up, We're Dreaming",
        duration: 243,
        cover: "/placeholder.svg?height=300&width=300",
        previewUrl: "",
        externalUrl: "https://open.spotify.com/track/1",
      },
      {
        id: "2",
        title: "Synthwave Dreams",
        artist: "Neon Nights",
        album: "Digital Horizon",
        duration: 198,
        cover: "/placeholder.svg?height=300&width=300",
        previewUrl: "",
        externalUrl: "https://open.spotify.com/track/2",
      },
    ]
  }

  async getTrack(id: string): Promise<Track> {
    return {
      id,
      title: "Sample Track",
      artist: "Sample Artist",
      album: "Sample Album",
      duration: 180,
      cover: "/placeholder.svg?height=300&width=300",
    }
  }

  async play(track: Track): Promise<void> {
    console.log("Playing:", track.title)
  }

  async pause(): Promise<void> {
    console.log("Paused")
  }

  getCurrentTime(): number {
    return 0
  }

  async setCurrentTime(time: number): Promise<void> {
    console.log("Seek to:", time)
  }
}

// Mock YouTube Provider for demo
export class YouTubeProvider implements MusicProvider {
  name = "YouTube"

  async search(query: string): Promise<Track[]> {
    return [
      {
        id: "yt1",
        title: "Lofi Hip Hop Mix",
        artist: "ChillBeats Channel",
        album: "",
        duration: 3600,
        cover: "/placeholder.svg?height=300&width=300",
        externalUrl: "https://youtube.com/watch?v=yt1",
      },
      {
        id: "yt2",
        title: "Ambient Space Music",
        artist: "Cosmic Sounds",
        album: "",
        duration: 2400,
        cover: "/placeholder.svg?height=300&width=300",
        externalUrl: "https://youtube.com/watch?v=yt2",
      },
    ]
  }

  async getTrack(id: string): Promise<Track> {
    return {
      id,
      title: "YouTube Track",
      artist: "YouTube Artist",
      album: "",
      duration: 240,
      cover: "/placeholder.svg?height=300&width=300",
    }
  }

  async play(track: Track): Promise<void> {
    console.log("Playing YouTube:", track.title)
  }

  async pause(): Promise<void> {
    console.log("Paused YouTube")
  }

  getCurrentTime(): number {
    return 0
  }

  async setCurrentTime(time: number): Promise<void> {
    console.log("YouTube seek to:", time)
  }
}

// Mock Local File Provider for demo
export class LocalFileProvider implements MusicProvider {
  name = "Local Files"

  async search(query: string): Promise<Track[]> {
    return []
  }

  async getTrack(id: string): Promise<Track> {
    return {
      id,
      title: "Local Track",
      artist: "Local Artist",
      album: "My Collection",
      duration: 180,
      cover: "/placeholder.svg?height=300&width=300",
    }
  }

  async uploadFile(file: File): Promise<Track> {
    return {
      id: Math.random().toString(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      album: "Uploaded",
      duration: 180,
      cover: "/placeholder.svg?height=300&width=300",
      previewUrl: URL.createObjectURL(file),
    }
  }

  async play(track: Track): Promise<void> {
    console.log("Playing local file:", track.title)
  }

  async pause(): Promise<void> {
    console.log("Paused local file")
  }

  getCurrentTime(): number {
    return 0
  }

  async setCurrentTime(time: number): Promise<void> {
    console.log("Local file seek to:", time)
  }
}
