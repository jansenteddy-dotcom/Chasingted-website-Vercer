'use client'

import {useEffect, useRef} from 'react'

export default function TopoBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const W = canvas.width = rect.width
    const H = canvas.height = rect.height

    ctx.strokeStyle = 'rgba(245,240,228,0.13)'
    ctx.lineWidth = 0.9
    ctx.lineCap = 'round'

    // Flow field: multiple overlapping sine/cosine waves → organic topo look
    function flowAngle(x: number, y: number): number {
      const nx = x / W
      const ny = y / H
      return (
        Math.sin(nx * Math.PI * 4.2 + ny * Math.PI * 3.1) * Math.PI +
        Math.cos(nx * Math.PI * 7.5 - ny * Math.PI * 5.3) * Math.PI * 0.65 +
        Math.sin(nx * Math.PI * 2.8 + ny * Math.PI * 6.7) * Math.PI * 0.45 +
        Math.cos(nx * Math.PI * 9.1 - ny * Math.PI * 2.4) * Math.PI * 0.25 +
        Math.sin(nx * Math.PI * 1.6 - ny * Math.PI * 8.2) * Math.PI * 0.15
      )
    }

    const STEP = 2.2
    const MAX_STEPS = 380
    const SPACING = Math.max(8, Math.round(W / 90))

    for (let sx = 0; sx < W; sx += SPACING) {
      for (let sy = 0; sy < H; sy += SPACING) {
        let x = sx
        let y = sy

        ctx.beginPath()
        ctx.moveTo(x, y)

        for (let i = 0; i < MAX_STEPS; i++) {
          const a = flowAngle(x, y)
          x += Math.cos(a) * STEP
          y += Math.sin(a) * STEP
          if (x < -10 || x > W + 10 || y < -10 || y > H + 10) break
          ctx.lineTo(x, y)
        }

        ctx.stroke()
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  )
}
