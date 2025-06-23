"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Crown, UserPlus, UserMinus, Settings } from "lucide-react"
import { socketService } from "@/lib/socket-client"

export interface User {
  id?: string // Make id optional since it might not always be present
  name: string
  avatar: string
  vibe?: string
  isHost: boolean
  joinedAt: string
  socketId?: string
  lastReaction?: string
}

interface Room {
  _id: string
  name: string
  hostId: string
  users: User[]
  isActive: boolean
  createdAt: string
}

interface RealConnectionIndicatorsProps {
  roomId: string
  currentUser: string
  users?: User[] // Add users prop as optional
  onUserUpdate?: (users: User[]) => void
}

export function RealConnectionIndicators({
  roomId,
  currentUser,
  users: propUsers = [], // Accept users from props with default empty array
  onUserUpdate,
}: RealConnectionIndicatorsProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [users, setUsers] = useState<User[]>(propUsers) // Initialize with prop users
  const [isHost, setIsHost] = useState(false)
  const [recentJoins, setRecentJoins] = useState<string[]>([])
  const [recentLeaves, setRecentLeaves] = useState<string[]>([])
  const [showHostControls, setShowHostControls] = useState(false)

  // Update local users when prop users change
  useEffect(() => {
    if (propUsers.length > 0) {
      setUsers(propUsers)
    }
  }, [propUsers])

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect()

    // Join the room
    socketService.joinRoom(roomId, currentUser)

    // Listen for room joined event
    socketService.onRoomJoined((data) => {
      console.log("🏠 Room joined:", data)
      setRoom(data.room)

      // Ensure users have proper structure with fallback IDs
      const usersWithIds = (data.room.users || []).map((user: any, index: number) => ({
        ...user,
        id: user.id || user.name || `user-${index}`, // Fallback ID generation
      }))

      setUsers(usersWithIds)
      setIsHost(data.isHost)
      onUserUpdate?.(usersWithIds)
    })

    // Listen for user joined
    socketService.onUserJoined((data) => {
      console.log("👤 User joined:", data.user.name)
      setRoom(data.room)

      // Ensure users have proper structure with fallback IDs
      const usersWithIds = (data.room.users || []).map((user: any, index: number) => ({
        ...user,
        id: user.id || user.name || `user-${index}`,
      }))

      setUsers(usersWithIds)
      onUserUpdate?.(usersWithIds)

      // Show join notification
      setRecentJoins((prev) => [...prev, data.user.name])
      setTimeout(() => {
        setRecentJoins((prev) => prev.filter((name) => name !== data.user.name))
      }, 5000)
    })

    // Listen for user left
    socketService.onUserLeft((data) => {
      console.log("👋 User left:", data.userName)

      // Show leave notification
      setRecentLeaves((prev) => [...prev, data.userName])
      setTimeout(() => {
        setRecentLeaves((prev) => prev.filter((name) => name !== data.userName))
      }, 3000)

      // Update users list (will be updated by room update event)
    })

    // Listen for host transfer
    socketService.onHostTransferred((data) => {
      console.log("👑 Host transferred:", data)

      if (data.newHost === currentUser) {
        setIsHost(true)
      } else if (data.oldHost === currentUser) {
        setIsHost(false)
      }

      // Update users list to reflect new host status
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isHost: user.name === data.newHost,
        })),
      )
    })

    // Listen for room updates
    socketService.onRoomUpdated((updatedRoom) => {
      setRoom(updatedRoom)

      // Ensure users have proper structure with fallback IDs
      const usersWithIds = (updatedRoom.users || []).map((user: any, index: number) => ({
        ...user,
        id: user.id || user.name || `user-${index}`,
      }))

      setUsers(usersWithIds)
      onUserUpdate?.(usersWithIds)
    })

    return () => {
      // Don't disconnect here - let the parent component handle it
    }
  }, [roomId, currentUser, onUserUpdate, propUsers])

  // Rest of the component remains the same...
  const transferHost = (newHostName: string) => {
    if (isHost) {
      socketService.transferHost(newHostName)
      setShowHostControls(false)
    }
  }

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
          <h3 className="text-purple-200 font-medium">Live Room</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{vibeData.emoji}</span>
          <span className={`text-sm font-bold ${vibeData.color}`}>{vibeData.level}</span>
          {isHost && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHostControls(!showHostControls)}
              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Host Controls */}
      {isHost && showHostControls && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h4 className="font-medium text-yellow-300 mb-2">👑 Host Controls</h4>
          <div className="space-y-2">
            {users
              .filter((user) => !user.isHost)
              .map((user) => (
                <div key={user.id || user.name} className="flex items-center justify-between">
                  <span className="text-sky-200 text-sm">{user.name}</span>
                  <Button
                    size="sm"
                    onClick={() => transferHost(user.name)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs"
                  >
                    Make Host
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Room Stats */}
      <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-xs text-purple-400">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {users.filter((u) => Date.now() - new Date(u.joinedAt).getTime() < 300000).length}
            </div>
            <div className="text-xs text-purple-400">Active (5min)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">1</div>
            <div className="text-xs text-purple-400">Host</div>
          </div>
        </div>
      </div>

      {/* Real-time Notifications */}
      {recentJoins.length > 0 && (
        <div className="mb-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg animate-pulse">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm">{recentJoins.slice(-2).join(", ")} joined the room! 🎉</span>
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

      {/* Users List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id || user.name}
            className="flex items-center space-x-3 group hover:bg-white/5 p-2 rounded-lg transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                {user.avatar}
              </div>
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
                {user.isHost && (
                  <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                    {user.name === currentUser ? "Host (You)" : "Host"}
                  </span>
                )}
                {Date.now() - new Date(user.joinedAt).getTime() < 60000 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">New</span>
                )}
              </div>
              <div className="text-sm text-purple-300">
                {user.isHost ? "Room Host" : "Guest"} •{" "}
                {Date.now() - new Date(user.joinedAt).getTime() < 60000
                  ? "Just now"
                  : Date.now() - new Date(user.joinedAt).getTime() < 300000
                    ? `${Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / 60000)}m ago`
                    : "Active"}
              </div>
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
              {room?.hostId === currentUser ? "You're hosting this room!" : `Hosted by ${room?.hostId}`}
            </span>
          </div>

          <div className="mt-2 text-xs text-purple-400">
            Room {roomId} • {users.length} connected • Real-time sync active
          </div>
        </div>
      </div>
    </Card>
  )
}
