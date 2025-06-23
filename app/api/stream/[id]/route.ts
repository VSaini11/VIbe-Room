import { type NextRequest, NextResponse } from "next/server"
import { createReadStream, statSync } from "fs"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trackId = params.id

    // Get track info from database
    // const track = await getTrackFromDatabase(trackId)

    // For demo, assume file exists
    const filepath = join(process.cwd(), "public/uploads", `${trackId}.mp3`)

    const stat = statSync(filepath)
    const fileSize = stat.size
    const range = request.headers.get("range")

    if (range) {
      // Handle range requests for audio streaming
      const parts = range.replace(/bytes=/, "").split("-")
      const start = Number.parseInt(parts[0], 10)
      const end = parts[1] ? Number.parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1

      const stream = createReadStream(filepath, { start, end })

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": "audio/mpeg",
        },
      })
    } else {
      const stream = createReadStream(filepath)

      return new NextResponse(stream as any, {
        headers: {
          "Content-Length": fileSize.toString(),
          "Content-Type": "audio/mpeg",
        },
      })
    }
  } catch (error) {
    console.error("Streaming error:", error)
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
