"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Copy, Check, MessageCircle, Mail, Twitter, Facebook, QrCode } from "lucide-react"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomUrl: string
}

export function ShareModal({ isOpen, onClose, roomId, roomUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join my Vibe Room - ${roomId}`)
    const body = encodeURIComponent(
      `Hey! Come listen to music with me in this awesome Vibe Room!\n\nJoin here: ${roomUrl}\n\nRoom Code: ${roomId}`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`🎵 Join my Vibe Room and let's listen to music together! Room: ${roomId}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(roomUrl)}`)
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(roomUrl)}`)
  }

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `🎵 Join my Vibe Room! Let's listen to music together. Room: ${roomId} Join: ${roomUrl}`,
    )
    window.open(`https://wa.me/?text=${text}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Share Vibe Room</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-purple-300 hover:text-white">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Room Info */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-purple-300">Room {roomId}</div>
            <div className="text-sm text-purple-400">Invite friends to listen together</div>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-200">Room Link</label>
            <div className="flex space-x-2">
              <Input value={roomUrl} readOnly className="bg-white/5 border-white/20 text-purple-200 text-sm" />
              <Button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* QR Code Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="bg-white/5 border-white/20 text-purple-200 hover:bg-white/10"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </Button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="flex justify-center">
              <QRCodeGenerator value={roomUrl} size={200} />
            </div>
          )}

          {/* Share Options */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-purple-200">Share via</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={shareViaWhatsApp}
                className="bg-green-500/10 border-green-500/20 text-green-300 hover:bg-green-500/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="bg-blue-500/10 border-blue-500/20 text-blue-300 hover:bg-blue-500/20"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>

              <Button
                variant="outline"
                onClick={shareViaTwitter}
                className="bg-sky-500/10 border-sky-500/20 text-sky-300 hover:bg-sky-500/20"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>

              <Button
                variant="outline"
                onClick={shareViaFacebook}
                className="bg-blue-600/10 border-blue-600/20 text-blue-300 hover:bg-blue-600/20"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="text-sm text-purple-300">
              <div className="font-medium mb-1">How to join:</div>
              <div>1. Click the link or scan QR code</div>
              <div>2. Enter your name</div>
              <div>3. Start vibing together! 🎵</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
