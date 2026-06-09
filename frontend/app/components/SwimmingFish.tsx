'use client'

import {useEffect, useState} from 'react'

type FishData = {
  y: number
  size: number
  duration: number
  delay: number
  direction: 'right' | 'left'
  opacity: number
}

function FishShape({size, flip}: {size: number; flip: boolean}) {
  return (
    <svg
      viewBox="0 0 82 38"
      width={size}
      height={Math.round(size * 0.46)}
      xmlns="http://www.w3.org/2000/svg"
      style={flip ? {transform: 'scaleX(-1)'} : undefined}
    >
      {/* Tail */}
      <path d="M15 19 L0 6 L0 32 Z" fill="#133425" />
      {/* Body */}
      <ellipse cx="47" cy="19" rx="29" ry="14" fill="#133425" />
      {/* Dorsal fin */}
      <path d="M37 6 Q44 0 51 6" fill="#133425" opacity="0.7" />
      {/* Pectoral fin */}
      <path d="M46 24 Q50 31 40 30" fill="#3a4a40" opacity="0.55" />
      {/* Eye */}
      <circle cx="66" cy="15" r="3.2" fill="rgba(245,240,228,0.9)" />
      <circle cx="67" cy="15" r="1.6" fill="#0a1c10" />
    </svg>
  )
}

const ALL_FISH: FishData[] = [
  {y: 10, size: 58,  duration: 24, delay: 0,  direction: 'right', opacity: 0.42},
  {y: 52, size: 82,  duration: 33, delay: 11, direction: 'left',  opacity: 0.38},
  {y: 30, size: 46,  duration: 19, delay: 17, direction: 'right', opacity: 0.32},
  {y: 74, size: 66,  duration: 28, delay: 5,  direction: 'left',  opacity: 0.36},
]

export default function SwimmingFish({count = 4, offset = 0}: {count?: number; offset?: number}) {
  const [fish, setFish] = useState<FishData[]>([])

  useEffect(() => {
    setFish(ALL_FISH.slice(offset, offset + count))
  }, [count, offset])

  if (fish.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {fish.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${f.y}%`,
            left: 0,
            opacity: f.opacity,
            animation: `${f.direction === 'right' ? 'swimRight' : 'swimLeft'} ${f.duration}s ${f.delay}s linear infinite`,
          }}
        >
          <FishShape size={f.size} flip={f.direction === 'left'} />
        </div>
      ))}
    </div>
  )
}
