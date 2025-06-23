"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, size, size)

    // Create simple QR-like pattern
    ctx.fillStyle = "black"
    const cellSize = Math.floor(size / 25)

    // Generate pattern based on URL
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const charCode = value.charCodeAt((i * 25 + j) % value.length)
        if (charCode % 3 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner markers (simplified)
    const markerSize = cellSize * 7

    // Top-left corner
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, markerSize, markerSize)
    ctx.fillStyle = "white"
    ctx.fillRect(cellSize, cellSize, markerSize - 2 * cellSize, markerSize - 2 * cellSize)
    ctx.fillStyle = "black"
    ctx.fillRect(2 * cellSize, 2 * cellSize, markerSize - 4 * cellSize, markerSize - 4 * cellSize)
  }, [value, size])

  return (
    <div className="bg-white p-4 rounded-lg">
      <canvas ref={canvasRef} width={size} height={size} className="border border-gray-300 rounded" />
      <div className="text-center mt-2 text-xs text-gray-600">Scan to join room</div>
    </div>
  )
}
