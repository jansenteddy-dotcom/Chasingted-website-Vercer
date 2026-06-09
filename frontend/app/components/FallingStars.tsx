'use client'

import {useEffect, useState} from 'react'

type Star = {
  left: number
  top: number
  delay: number
  duration: number
  width: number
}

export default function FallingStars({count = 12}: {count?: number}) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({length: count}, () => ({
        left: 2 + Math.random() * 82,
        top: Math.random() * 55,
        delay: Math.random() * 14,
        duration: 1.8 + Math.random() * 2.4,
        width: 65 + Math.random() * 95,
      })),
    )
  }, [count])

  if (stars.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden>
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.width}px`,
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(245, 240, 228, 0.85))',
            transformOrigin: 'left center',
            opacity: 0,
            animation: `shootingStar ${star.duration}s ${star.delay}s infinite ease-in`,
          }}
        />
      ))}
    </div>
  )
}
