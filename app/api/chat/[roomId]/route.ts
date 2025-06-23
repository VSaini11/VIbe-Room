import { type NextRequest, NextResponse } from "next/server"

// Real-time chat API endpoint
export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { message, userName, type = "message" } = await request.json()
    const roomId = params.roomId

    // In real app, you'd:
    // 1. Validate the room exists
    // 2. Save message to database
    // 3. Broadcast to WebSocket clients
    // 4. Handle different message types

    const chatMessage = {
      id: Date.now().toString(),
      user: userName,
      text: message,
      timestamp: Date.now(),
      emoji: getRandomEmoji(),
      type,
      roomId,
    }

    // Save to database
    // await db.messages.create(chatMessage)

    // Broadcast to all room members via WebSocket
    // broadcastToRoom(roomId, {
    //   type: 'new-message',
    //   message: chatMessage
    // })

    console.log(`💬 New message in room ${roomId}: ${message}`)

    return NextResponse.json({
      success: true,
      message: chatMessage,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

// Get chat history
export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const roomId = params.roomId

    // In real app: fetch from database
    // const messages = await db.messages.findMany({
    //   where: { roomId },
    //   orderBy: { timestamp: 'asc' },
    //   take: 50 // Last 50 messages
    // })

    const mockMessages = [
      {
        id: "1",
        user: "Alex",
        text: "This song hits different at night 🌙",
        timestamp: Date.now() - 120000,
        emoji: "🌟",
        type: "message",
      },
    ]

    return NextResponse.json({
      success: true,
      messages: mockMessages,
    })
  } catch (error) {
    console.error("Get chat history error:", error)
    return NextResponse.json({ error: "Failed to get messages" }, { status: 500 })
  }
}

function getRandomEmoji() {
  const emojis = ["🌟", "🎵", "🌙", "✨", "🔥", "💫", "🎭", "🌈", "⚡", "💜"]
  return emojis[Math.floor(Math.random() * emojis.length)]
}
