"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  user: string
  text: string
  timestamp: number
  emoji?: string
}

interface ThoughtChatProps {
  roomId: string
  userName: string
}

// Mock messages for demo
const mockMessages: Message[] = [
  { id: "1", user: "Alex", text: "This song hits different at night 🌙", timestamp: Date.now() - 120000, emoji: "🌟" },
  { id: "2", user: "Sam", text: "The bass line is incredible!", timestamp: Date.now() - 60000, emoji: "🎵" },
  { id: "3", user: "Jordan", text: "Getting major nostalgic vibes", timestamp: Date.now() - 30000, emoji: "🌙" },
]

export function ThoughtChat({ roomId, userName }: ThoughtChatProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      user: userName,
      text: newMessage,
      timestamp: Date.now(),
      emoji: ["🌟", "🎵", "🌙", "💫", "✨"][Math.floor(Math.random() * 5)],
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 h-96 flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-300" />
        <h3 className="text-purple-200 font-medium">Thoughts & Vibes</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{message.emoji}</span>
              <span className="text-purple-300 text-sm font-medium">{message.user}</span>
              <span className="text-purple-400 text-xs">{formatTime(message.timestamp)}</span>
            </div>
            <p className="text-white text-sm ml-6">{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Share your thoughts..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 text-sm"
        />
        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
