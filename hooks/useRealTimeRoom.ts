"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: string
  name: string
  avatar: string
  vibe: string
  lastReaction: string
  joinedAt: number
  isHost?: boolean
}

interface UseRealTimeRoomProps {
  roomId: string
  currentUser: string
  initialUsers: User[]
}

export function useRealTimeRoom({ roomId, currentUser, initialUsers }: UseRealTimeRoomProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isConnected, setIsConnected] = useState(false)

  // In a real app, this would connect to your WebSocket server
  const connectToRoom = useCallback(async () => {
    try {
      // Real implementation would be:
      // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/rooms/${roomId}`)

      console.log(`🔌 Connecting to room ${roomId}...`)

      // Simulate connection
      setIsConnected(true)

      // In real app, you'd listen to WebSocket events:
      /*
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'user-joined':
            setUsers(prev => [...prev, data.user])
            break
          case 'user-left':
            setUsers(prev => prev.filter(u => u.id !== data.userId))
            break
          case 'users-updated':
            setUsers(data.users)
            break
          case 'reaction':
            // Handle real-time reactions
            break
        }
      }
      
      ws.onopen = () => {
        // Send join message
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId,
          user: {
            id: generateUserId(),
            name: currentUser,
            avatar: getRandomAvatar(),
            vibe: 'excited',
            lastReaction: '🎵',
            joinedAt: Date.now()
          }
        }))
      }
      */
    } catch (error) {
      console.error("Failed to connect to room:", error)
      setIsConnected(false)
    }
  }, [roomId, currentUser])

  // Join room when component mounts
  useEffect(() => {
    connectToRoom()

    // Cleanup: disconnect when component unmounts
    return () => {
      // In real app: ws.close()
      setIsConnected(false)
      console.log(`🔌 Disconnected from room ${roomId}`)
    }
  }, [connectToRoom, roomId])

  // Real-time user management functions
  const addUser = useCallback((newUser: User) => {
    // In real app: send WebSocket message
    // ws.send(JSON.stringify({ type: 'user-joined', user: newUser }))

    setUsers((prev) => {
      if (prev.find((u) => u.id === newUser.id)) return prev
      return [...prev, newUser]
    })
  }, [])

  const removeUser = useCallback((userId: string) => {
    // In real app: send WebSocket message
    // ws.send(JSON.stringify({ type: 'user-left', userId }))

    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  const updateUserReaction = useCallback((userId: string, reaction: string) => {
    // In real app: send WebSocket message
    // ws.send(JSON.stringify({ type: 'user-reaction', userId, reaction }))

    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, lastReaction: reaction } : u)))
  }, [])

  return {
    users,
    isConnected,
    addUser,
    removeUser,
    updateUserReaction,
    userCount: users.length,
  }
}
