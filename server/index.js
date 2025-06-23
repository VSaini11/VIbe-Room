// Fixed Node.js + Socket.IO + MongoDB Backend Server
const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const { MongoClient } = require("mongodb")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vibe-room"
let db

MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("✅ Connected to MongoDB")
    db = client.db()
    setupChangeStreams()
  })
  .catch((error) => console.error("❌ MongoDB connection error:", error))

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id)

  // Join room - FIXED HOST LOGIC
  socket.on("join-room", async (data) => {
    const { roomId, userName, userAvatar } = data

    try {
      // First, check if room exists
      let room = await db.collection("rooms").findOne({ _id: roomId })

      let isHost = false

      if (!room) {
        // Room doesn't exist - this user becomes the HOST
        isHost = true

        // Create new room with this user as host
        room = {
          _id: roomId,
          name: `${userName}'s Vibe Room`,
          hostId: userName, // Set the host
          hostSocketId: socket.id,
          createdAt: new Date(),
          isActive: true,
          users: [
            {
              socketId: socket.id,
              name: userName,
              avatar: userAvatar || "🎵",
              isHost: true, // This user is the host
              joinedAt: new Date(),
            },
          ],
        }

        await db.collection("rooms").insertOne(room)
        console.log(`👑 ${userName} created room ${roomId} as HOST`)
      } else {
        // Room exists - this user joins as GUEST
        isHost = false

        // Check if user already in room
        const existingUser = room.users?.find((u) => u.name === userName)

        if (existingUser) {
          // Update existing user's socket ID
          await db.collection("rooms").updateOne(
            { _id: roomId, "users.name": userName },
            {
              $set: {
                "users.$.socketId": socket.id,
                "users.$.joinedAt": new Date(),
              },
            },
          )
        } else {
          // Add new user as guest
          await db.collection("rooms").updateOne(
            { _id: roomId },
            {
              $push: {
                users: {
                  socketId: socket.id,
                  name: userName,
                  avatar: userAvatar || "🎵",
                  isHost: false, // This user is NOT the host
                  joinedAt: new Date(),
                },
              },
            },
          )
        }

        console.log(`👤 ${userName} joined room ${roomId} as GUEST`)
      }

      // Join socket room
      socket.join(roomId)
      socket.roomId = roomId
      socket.userName = userName
      socket.isHost = isHost

      // Get updated room data
      const updatedRoom = await db.collection("rooms").findOne({ _id: roomId })

      // Broadcast user joined to others in room (not to self)
      socket.to(roomId).emit("user-joined", {
        user: {
          name: userName,
          avatar: userAvatar,
          isHost: isHost,
        },
        room: updatedRoom,
      })

      // Send room data to joining user
      socket.emit("room-joined", {
        room: updatedRoom,
        isHost: isHost,
        hostId: updatedRoom.hostId,
      })
    } catch (error) {
      console.error("❌ Error joining room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  // Send chat message
  socket.on("send-message", async (data) => {
    const { roomId, userName, message, emoji } = data

    try {
      const messageDoc = {
        roomId,
        userName,
        message,
        emoji: emoji || "💬",
        timestamp: new Date(),
        type: "message",
      }

      await db.collection("messages").insertOne(messageDoc)
    } catch (error) {
      console.error("❌ Error sending message:", error)
    }
  })

  // Send reaction
  socket.on("send-reaction", async (data) => {
    const { roomId, userName, emoji, intensity, x, y } = data

    try {
      const reactionDoc = {
        roomId,
        userName,
        emoji,
        intensity,
        x: x || Math.random() * 80 + 10,
        y: y || Math.random() * 60 + 20,
        timestamp: new Date(),
      }

      await db.collection("reactions").insertOne(reactionDoc)
      io.to(roomId).emit("new-reaction", reactionDoc)

      // Clean up old reactions
      await db.collection("reactions").deleteMany({
        timestamp: { $lt: new Date(Date.now() - 5 * 60 * 1000) },
      })
    } catch (error) {
      console.error("❌ Error sending reaction:", error)
    }
  })

  // Update music playback - ONLY HOST CAN CONTROL
  socket.on("update-playback", async (data) => {
    const { roomId, track, isPlaying, currentTime, updatedBy } = data

    try {
      // Verify user is the host
      const room = await db.collection("rooms").findOne({ _id: roomId })

      if (!room || room.hostId !== updatedBy) {
        socket.emit("error", { message: "Only the host can control playback" })
        return
      }

      const playbackDoc = {
        roomId,
        currentTrack: track,
        isPlaying,
        currentTime,
        updatedBy,
        updatedAt: new Date(),
        startedAt: isPlaying ? new Date(Date.now() - currentTime * 1000) : null,
      }

      await db.collection("playback").replaceOne({ roomId }, playbackDoc, { upsert: true })

      // Broadcast to ALL users in room (including host)
      io.to(roomId).emit("playback-updated", playbackDoc)

      console.log(`🎵 Host ${updatedBy} updated playback in room ${roomId}`)
    } catch (error) {
      console.error("❌ Error updating playback:", error)
    }
  })

  // Transfer host (only current host can do this)
  socket.on("transfer-host", async (data) => {
    const { roomId, newHostName } = data

    try {
      const room = await db.collection("rooms").findOne({ _id: roomId })

      if (!room || room.hostId !== socket.userName) {
        socket.emit("error", { message: "Only current host can transfer host role" })
        return
      }

      // Update room host
      await db.collection("rooms").updateOne(
        { _id: roomId },
        {
          $set: {
            hostId: newHostName,
            hostSocketId: null, // Will be updated when new host reconnects
          },
        },
      )

      // Update user roles
      await db.collection("rooms").updateMany(
        { _id: roomId },
        {
          $set: { "users.$[].isHost": false }, // Remove host from all users
        },
      )

      await db.collection("rooms").updateOne(
        { _id: roomId, "users.name": newHostName },
        {
          $set: { "users.$.isHost": true }, // Make new user host
        },
      )

      // Broadcast host change
      io.to(roomId).emit("host-transferred", {
        oldHost: socket.userName,
        newHost: newHostName,
      })

      console.log(`👑 Host transferred from ${socket.userName} to ${newHostName} in room ${roomId}`)
    } catch (error) {
      console.error("❌ Error transferring host:", error)
    }
  })

  // Handle disconnect
  socket.on("disconnect", async () => {
    try {
      if (socket.roomId && socket.userName) {
        // Remove user from room
        await db.collection("rooms").updateOne({ _id: socket.roomId }, { $pull: { users: { socketId: socket.id } } })

        // Check if disconnected user was the host
        const room = await db.collection("rooms").findOne({ _id: socket.roomId })

        if (room && room.hostId === socket.userName) {
          // Host left - transfer to next user or close room
          if (room.users && room.users.length > 1) {
            const nextUser = room.users.find((u) => u.socketId !== socket.id)
            if (nextUser) {
              // Transfer host to next user
              await db.collection("rooms").updateOne(
                { _id: socket.roomId },
                {
                  $set: {
                    hostId: nextUser.name,
                    hostSocketId: nextUser.socketId,
                  },
                },
              )

              await db
                .collection("rooms")
                .updateOne({ _id: socket.roomId, "users.name": nextUser.name }, { $set: { "users.$.isHost": true } })

              // Notify room of new host
              socket.to(socket.roomId).emit("host-transferred", {
                oldHost: socket.userName,
                newHost: nextUser.name,
                reason: "previous_host_left",
              })

              console.log(`👑 Host auto-transferred to ${nextUser.name} in room ${socket.roomId}`)
            }
          } else {
            // No other users - mark room as inactive
            await db.collection("rooms").updateOne({ _id: socket.roomId }, { $set: { isActive: false } })
            console.log(`🏠 Room ${socket.roomId} marked inactive - host left and no other users`)
          }
        }

        // Broadcast user left
        socket.to(socket.roomId).emit("user-left", {
          userName: socket.userName,
          wasHost: socket.isHost,
        })
      }

      console.log("🔌 User disconnected:", socket.id)
    } catch (error) {
      console.error("❌ Error handling disconnect:", error)
    }
  })
})

// Set up MongoDB Change Streams
function setupChangeStreams() {
  const messageChangeStream = db.collection("messages").watch()
  messageChangeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const message = change.fullDocument
      io.to(message.roomId).emit("new-message", message)
    }
  })

  console.log("👂 Change Streams set up")
}

// REST API endpoints
app.get("/api/rooms/:roomId", async (req, res) => {
  try {
    const room = await db.collection("rooms").findOne({ _id: req.params.roomId })
    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }
    res.json(room)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/api/rooms/:roomId/messages", async (req, res) => {
  try {
    const messages = await db
      .collection("messages")
      .find({ roomId: req.params.roomId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    res.json(messages.reverse())
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    mongodb: db ? "connected" : "disconnected",
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
