"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, MessageCircle, Users } from "lucide-react"

interface Message {
  id: string
  user: string
  text: string
  timestamp: number
  emoji?: string
  type?: "message" | "reaction" | "system"
}

interface RealTimeChatProps {
  roomId: string
  userName: string
  userCount: number
}

// Real-time chat service (would connect to WebSocket server)
class ChatService {
  private ws: WebSocket | null = null
  private listeners: ((message: Message) => void)[] = []
  private userListeners: ((users: string[]) => void)[] = []

  connect(roomId: string, userName: string) {
    // In real app: ws://your-server.com/chat/${roomId}
    console.log(`🔌 Connecting to chat room ${roomId} as ${userName}`)

    // Simulate WebSocket connection
    // this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/chat/${roomId}`)

    return {
      // Send message to all users in room
      sendMessage: (text: string) => {
        const message: Message = {
          id: Date.now().toString(),
          user: userName,
          text,
          timestamp: Date.now(),
          emoji: this.getRandomEmoji(),
          type: "message",
        }

        // In real app: this.ws.send(JSON.stringify({ type: 'message', data: message }))
        console.log(`📤 Sending message: ${text}`)

        // Simulate receiving the message back (in real app, server broadcasts to all)
        setTimeout(() => {
          this.notifyMessageListeners(message)
        }, 100)

        // Simulate other users responding
        this.simulateResponses(text)
      },

      // Listen for incoming messages
      onMessage: (callback: (message: Message) => void) => {
        this.listeners.push(callback)
        // In real app: this.ws.addEventListener('message', (event) => {
        //   const data = JSON.parse(event.data)
        //   if (data.type === 'message') callback(data.message)
        // })
      },

      // Send typing indicator
      sendTyping: () => {
        // In real app: this.ws.send(JSON.stringify({ type: 'typing', user: userName }))
        console.log(`⌨️ ${userName} is typing...`)
      },

      // Disconnect from chat
      disconnect: () => {
        // In real app: this.ws.close()
        console.log(`🔌 Disconnected from chat room ${roomId}`)
      },
    }
  }

  private getRandomEmoji() {
    const emojis = ["🌟", "🎵", "🌙", "✨", "🔥", "💫", "🎭", "🌈", "⚡", "💜"]
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  private notifyMessageListeners(message: Message) {
    this.listeners.forEach((listener) => listener(message))
  }

  // Simulate other users responding (for demo)
  private simulateResponses(originalMessage: string) {
    const responses = [
      "That's so true! 🎵",
      "I love this vibe ✨",
      "This song hits different 🔥",
      "Totally feeling it 💫",
      "Same energy! ⚡",
      "Perfect choice 🌟",
    ]

    const users = ["Alex", "Sam", "Jordan", "Maya", "Rio"]

    // 30% chance someone responds
    if (Math.random() < 0.3) {
      setTimeout(
        () => {
          const randomUser = users[Math.floor(Math.random() * users.length)]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          const responseMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            user: randomUser,
            text: randomResponse,
            timestamp: Date.now(),
            emoji: this.getRandomEmoji(),
            type: "message",
          }

          this.notifyMessageListeners(responseMessage)
        },
        1000 + Math.random() * 3000,
      ) // 1-4 seconds delay
    }
  }
}

const chatService = new ChatService()

export function RealTimeChat({ roomId, userName, userCount }: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Connect to real-time chat when component mounts
  useEffect(() => {
    const connection = chatService.connect(roomId, userName)
    setIsConnected(true)

    // Listen for incoming messages
    connection.onMessage((message: Message) => {
      setMessages((prev) => [...prev, message])

      // Show system notification for new users
      if (message.type === "system") {
        // Handle system messages (user joined, left, etc.)
      }
    })

    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      user: "System",
      text: `${userName} joined the chat! 🎉`,
      timestamp: Date.now(),
      type: "system",
    }
    setMessages((prev) => [...prev, welcomeMessage])

    // Cleanup on unmount
    return () => {
      connection.disconnect()
      setIsConnected(false)
    }
  }, [roomId, userName])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !isConnected) return

    const connection = chatService.connect(roomId, userName)
    connection.sendMessage(newMessage)
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleTyping = () => {
    const connection = chatService.connect(roomId, userName)
    connection.sendTyping()

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing indicator
    }, 2000)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageStyle = (message: Message) => {
    if (message.type === "system") {
      return "bg-blue-500/10 border border-blue-500/20 text-blue-300 text-center italic"
    }
    if (message.user === userName) {
      return "bg-purple-500/20 border border-purple-500/30 ml-8"
    }
    return "bg-white/5 mr-8"
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-purple-300" />
          <h3 className="text-purple-200 font-medium">Live Chat</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
          <span className="text-xs text-purple-400">{isConnected ? "Connected" : "Connecting..."}</span>
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-400">{userCount}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className={`p-3 rounded-lg ${getMessageStyle(message)}`}>
            {message.type !== "system" && (
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{message.emoji}</span>
                <span className="text-purple-300 text-sm font-medium">{message.user}</span>
                <span className="text-purple-400 text-xs">{formatTime(message.timestamp)}</span>
                {message.user === userName && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
            )}
            <p className={`text-sm ${message.type === "system" ? "text-blue-300" : "text-white"}`}>{message.text}</p>
          </div>
        ))}

        {/* Typing indicators */}
        {isTyping.length > 0 && (
          <div className="flex items-center space-x-2 text-purple-400 text-sm italic">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span>
              {isTyping.join(", ")} {isTyping.length === 1 ? "is" : "are"} typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          placeholder={isConnected ? "Share your thoughts..." : "Connecting..."}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            handleTyping()
          }}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 text-sm"
        />
        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim() || !isConnected}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-2 text-center">
          <span className="text-xs text-orange-400">Reconnecting to chat...</span>
        </div>
      )}
    </Card>
  )
}
