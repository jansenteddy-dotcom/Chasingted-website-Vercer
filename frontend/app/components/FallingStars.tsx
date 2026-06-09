'use client'

import {useEffect, useState} from 'react'

type Star = {
  left: number
  top: number
  delay: number
  duration: number
  size: number
}

function StarShape({size}: {size: number}) {
  const R = size
  const r = Math.round(size * 0.38)
  const d = `M0,${-R} L${r},${-r} L${R},0 L${r},${r} L0,${R} L${-r},${r} L${-R},0 L${-r},${-r} Z`
  const box = R + 2
  return (
    <svg
      viewBox={`${-box} ${-box} ${box * 2} ${box * 2}`}
      width={box * 2}
      height={box * 2}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path d={d} stroke="#f5f0e4" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

export default function FallingStars({count = 14}: {count?: number}) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    setStars(
      Array.from({length: count}, () => ({
        left: 4 + Math.random() * 92,
        top: 4 + Math.random() * 90,
        delay: Math.random() * 10,
        duration: 2.5 + Math.random() * 4,
        size: 4 + Math.random() * 5,
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
            animation: `twinkleStar ${star.duration}s ${star.delay}s infinite ease-in-out`,
          }}
        >
          <StarShape size={star.size} />
        </div>
      ))}
    </div>
  )
}
