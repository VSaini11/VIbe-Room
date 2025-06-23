import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("audio") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileId = uuidv4()
    const extension = file.name.split(".").pop()
    const filename = `${fileId}.${extension}`
    const filepath = join(process.cwd(), "public/uploads", filename)

    // Save file
    await writeFile(filepath, buffer)

    // Extract metadata (you'd use a library like node-ffmpeg for this)
    const track = {
      id: fileId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      album: "Unknown Album",
      duration: 0, // Would extract from file metadata
      cover: "/placeholder.svg?height=300&width=300",
      previewUrl: `/uploads/${filename}`,
    }

    // Save to database (implement your database logic here)
    // await saveTrackToDatabase(track)

    return NextResponse.json(track)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
