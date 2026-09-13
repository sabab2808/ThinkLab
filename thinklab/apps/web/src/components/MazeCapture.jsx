import { useEffect, useRef, useState } from 'react'
import { scanMazeWalls, reconcileWalls } from '../utils/mazeScan.js'

export default function MazeCapture({ width, height, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setReady(true)
        }
      })
      .catch((err) => setError(err.message))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function capture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const size = Math.min(video.videoWidth, video.videoHeight)
    const offsetX = (video.videoWidth - size) / 2
    const offsetY = (video.videoHeight - size) / 2

    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size)

    const grid = scanMazeWalls(ctx, size, width, height)
    reconcileWalls(grid, width, height)

    onCapture(grid)
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  if (error) {
    return (
      <div className="border border-hairline p-6 text-center">
        <p className="font-mono text-xs text-danger">Camera unavailable: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-square w-full max-w-96 overflow-hidden border border-hairline">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        <div
          className="pointer-events-none absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${width}, 1fr)`, gridTemplateRows: `repeat(${height}, 1fr)` }}
        >
          {Array.from({ length: width * height }).map((_, i) => (
            <div key={i} className="border border-verified/40" />
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        type="button"
        onClick={capture}
        disabled={!ready}
        className="mt-4 border border-hairline px-4 py-2 text-sm hover:border-verified disabled:opacity-50"
      >
        {ready ? 'Capture maze' : 'Starting camera…'}
      </button>
    </div>
  )
}
