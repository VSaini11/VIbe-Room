"use client"

import { useEffect } from "react"

export default function SpotifyAuthPage() {
  useEffect(() => {
    // Extract access token from URL hash
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const error = params.get("error")

    if (accessToken) {
      // Send token back to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "spotify-auth-success",
            accessToken: accessToken,
          },
          window.location.origin,
        )
      }
      window.close()
    } else if (error) {
      // Send error back to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "spotify-auth-error",
            error: error,
          },
          window.location.origin,
        )
      }
      window.close()
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-sky-300 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-white">Connecting to Spotify...</p>
      </div>
    </div>
  )
}
