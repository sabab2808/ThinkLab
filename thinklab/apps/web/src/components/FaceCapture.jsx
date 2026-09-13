import { useEffect, useRef, useState } from 'react'

const GRID = 3

/**
 * Opens the camera, lets the user frame one face inside a 3x3 guide
 * overlay, and on capture samples the average color of each of the 9
 * cells. Returns raw RGB triples — turning those into one of 6 cube
 * colors happens later, once all 6 faces are in (see RubiksCube.jsx),
 * since classification needs all 6 centers as reference points.
 */
export default function FaceCapture({ label, onCapture }) {
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

    const cellSize = size / GRID
    const colors = []
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        // Sample a small patch near the center of each cell, not the
        // whole cell — avoids picking up the black plastic gaps between
        // stickers at the cell edges.
        const patch = cellSize * 0.3
        const cx = col * cellSize + cellSize / 2
        const cy = row * cellSize + cellSize / 2
        const { data } = ctx.getImageData(cx - patch / 2, cy - patch / 2, patch, patch)
        let r = 0, g = 0, b = 0
        const n = data.length / 4
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
        }
        colors.push({ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) })
      }
    }

    onCapture(colors, canvas.toDataURL('image/jpeg', 0.6))
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  if (error) {
    return (
      <div className="border border-hairline p-6 text-center">
        <p className="font-mono text-xs text-danger">Camera unavailable: {error}</p>
        <p className="mt-2 text-sm text-text-muted">
          Check your browser's camera permission and try again.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="font-mono text-xs text-text-muted">capturing · face {label}</p>
      <div className="relative mt-3 aspect-square w-full max-w-96 overflow-hidden border border-hairline">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        {/* 3x3 guide overlay so the user can align the face inside it */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
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
        {ready ? 'Capture' : 'Starting camera…'}
      </button>
    </div>
  )
}
