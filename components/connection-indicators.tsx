"use client"

import { Card } from "@/components/ui/card"
import { Users, Crown, UserPlus, UserMinus } from "lucide-react"
import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  avatar: string
  vibe: string
  lastReaction: string
  joinedAt: number
  isHost: boolean
}

interface ConnectionIndicatorsProps {
  users: User[]
  currentUser: string
  roomId: string
  onUserUpdate?: (users: User[]) => void
}

const vibeColors = {
  chill: "from-blue-400 to-purple-400",
  energetic: "from-orange-400 to-red-400",
  dreamy: "from-purple-400 to-pink-400",
  focused: "from-green-400 to-blue-400",
  excited: "from-yellow-400 to-orange-400",
  relaxed: "from-indigo-400 to-blue-400",
}

// This would be replaced with real WebSocket/API calls
class RoomService {
  private listeners: ((users: User[]) => void)[] = []
  private users: User[] = []

  // Simulate WebSocket connection
  connect(roomId: string, currentUser: string) {
    console.log(`🔌 Connected to room ${roomId} as ${currentUser}`)

    // In real app: ws://your-server.com/rooms/${roomId}
    // const ws = new WebSocket(`ws://localhost:3001/rooms/${roomId}`)

    return {
      // Simulate receiving user updates
      onUserJoined: (callback: (user: User) => void) => {
        // In real app: ws.addEventListener('user-joined', callback)
        console.log("👂 Listening for user joins...")
      },

      onUserLeft: (callback: (userId: string) => void) => {
        // In real app: ws.addEventListener('user-left', callback)
        console.log("👂 Listening for user leaves...")
      },

      onUserUpdate: (callback: (users: User[]) => void) => {
        // In real app: ws.addEventListener('users-updated', callback)
        this.listeners.push(callback)
      },

      // Send user join event
      joinRoom: (user: User) => {
        // In real app: ws.send(JSON.stringify({ type: 'join', user }))
        this.users.push(user)
        this.notifyListeners()
        console.log(`✅ ${user.name} joined room ${roomId}`)
      },

      // Send user leave event
      leaveRoom: (userId: string) => {
        // In real app: ws.send(JSON.stringify({ type: 'leave', userId }))
        this.users = this.users.filter((u) => u.id !== userId)
        this.notifyListeners()
        console.log(`❌ User ${userId} left room ${roomId}`)
      },

      disconnect: () => {
        // In real app: ws.close()
        console.log(`🔌 Disconnected from room ${roomId}`)
      },
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.users]))
  }

  // Get current room users (API call)
  async getRoomUsers(roomId: string): Promise<User[]> {
    // In real app: fetch(`/api/rooms/${roomId}/users`)
    console.log(`📡 Fetching users for room ${roomId}`)
    return this.users
  }
}

const roomService = new RoomService()

export function ConnectionIndicators({
  users: initialUsers,
  currentUser,
  roomId,
  onUserUpdate,
}: ConnectionIndicatorsProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [recentJoins, setRecentJoins] = useState<string[]>([])
  const [recentLeaves, setRecentLeaves] = useState<string[]>([])

  useEffect(() => {
    // Connect to real-time room updates
    const connection = roomService.connect(roomId, currentUser)

    // Listen for real user joins (from shared links)
    connection.onUserJoined((newUser: User) => {
      setUsers((prev) => {
        const updated = [...prev, newUser]
        onUserUpdate?.(updated)
        return updated
      })

      // Show join notification
      setRecentJoins((prev) => [...prev, newUser.name])
      setTimeout(() => {
        setRecentJoins((prev) => prev.filter((name) => name !== newUser.name))
      }, 5000)
    })

    // Listen for user leaves
    connection.onUserLeft((userId: string) => {
      setUsers((prev) => {
        const userLeaving = prev.find((u) => u.id === userId)
        if (userLeaving) {
          setRecentLeaves((prevLeaves) => [...prevLeaves, userLeaving.name])
          setTimeout(() => {
            setRecentLeaves((prevLeaves) => prevLeaves.filter((name) => name !== userLeaving.name))
          }, 3000)
        }

        const updated = prev.filter((u) => u.id !== userId)
        onUserUpdate?.(updated)
        return updated
      })
    })

    // Listen for general user updates
    connection.onUserUpdate((updatedUsers: User[]) => {
      setUsers(updatedUsers)
      onUserUpdate?.(updatedUsers)
    })

    // Cleanup on unmount
    return () => {
      connection.disconnect()
    }
  }, [roomId, currentUser, onUserUpdate])

  const getVibeIntensity = (userCount: number) => {
    if (userCount >= 8) return { level: "LEGENDARY", color: "text-yellow-400", emoji: "🔥" }
    if (userCount >= 6) return { level: "EPIC", color: "text-orange-400", emoji: "⚡" }
    if (userCount >= 4) return { level: "HIGH", color: "text-purple-400", emoji: "💫" }
    if (userCount >= 2) return { level: "MEDIUM", color: "text-blue-400", emoji: "✨" }
    return { level: "CHILL", color: "text-gray-400", emoji: "🌙" }
  }

  const vibeData = getVibeIntensity(users.length)

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-300" />
          <h3 className="text-purple-200 font-medium">Vibe Check</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{vibeData.emoji}</span>
          <span className={`text-sm font-bold ${vibeData.color}`}>{vibeData.level}</span>
        </div>
      </div>

      {/* User Count Stats */}
      <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-xs text-purple-400">Total Listeners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {users.filter((u) => Date.now() - u.joinedAt < 300000).length}
            </div>
            <div className="text-xs text-purple-400">Active (5min)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{recentJoins.length}</div>
            <div className="text-xs text-purple-400">Just Joined</div>
          </div>
        </div>
      </div>

      {/* Real-time Join/Leave Notifications */}
      {recentJoins.length > 0 && (
        <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm">
              {recentJoins.slice(-2).join(", ")} joined via shared link! 🎉
            </span>
          </div>
        </div>
      )}

      {recentLeaves.length > 0 && (
        <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <UserMinus className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm">{recentLeaves.slice(-1)[0]} left the room</span>
          </div>
        </div>
      )}

      {/* Users List - Real people who joined */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-r ${vibeColors[user.vibe as keyof typeof vibeColors]} flex items-center justify-center text-lg animate-pulse`}
              >
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 text-sm">{user.lastReaction}</div>
              {user.isHost && (
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{user.name}</span>
                {user.name === currentUser && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">You</span>
                )}
                {user.isHost && user.name !== currentUser && (
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">Host</span>
                )}
                {user.isHost && user.name === currentUser && (
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">Host (You)</span>
                )}
                {Date.now() - user.joinedAt < 60000 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">New</span>
                )}
              </div>
              <div className="text-sm text-purple-300 capitalize">{user.vibe} vibes</div>
            </div>

            <div className="text-xs text-purple-400">
              {Date.now() - user.joinedAt < 60000
                ? "Just now"
                : Date.now() - user.joinedAt < 300000
                  ? `${Math.floor((Date.now() - user.joinedAt) / 60000)}m ago`
                  : "Active"}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Status */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-purple-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">
              {users.length === 1
                ? "Share the link to invite friends!"
                : users.length < 4
                  ? "Small group vibing"
                  : users.length < 8
                    ? "Great crowd energy!"
                    : "Epic vibe session! 🔥"}
            </span>
          </div>

          <div className="mt-2 text-xs text-purple-400">
            Room {roomId} • {users.length} listening • Share to grow the vibe!
          </div>
        </div>
      </div>
    </Card>
  )
}
