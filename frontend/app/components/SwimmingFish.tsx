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
      fill="none"
      stroke="#133425"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? {transform: 'scaleX(-1)'} : undefined}
    >
      {/* Tail — wags around the tail-body connection point */}
      <path
        d="M15 19 L0 6 L0 32 Z"
        style={{transformOrigin: '15px 19px', animation: 'tailWag 0.5s ease-in-out infinite'}}
      />
      {/* Body */}
      <ellipse cx="47" cy="19" rx="29" ry="14" />
      {/* Dorsal fin */}
      <path d="M37 6 Q44 0 51 6" />
      {/* Pectoral fin */}
      <path d="M46 24 Q50 31 40 30" />
      {/* Eye */}
      <circle cx="66" cy="15" r="3" />
    </svg>
  )
}

// y positions are in the top/bottom margins of sections to avoid overlapping text
const ALL_FISH: FishData[] = [
  {y: 5,  size: 60, duration: 24, delay: 0,  direction: 'right', opacity: 0.55},
  {y: 88, size: 84, duration: 33, delay: 11, direction: 'left',  opacity: 0.5},
  {y: 93, size: 48, duration: 19, delay: 17, direction: 'right', opacity: 0.48},
  {y: 6,  size: 68, duration: 28, delay: 5,  direction: 'left',  opacity: 0.52},
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
          {/* Body wave wrapper — gentle undulation as fish swims */}
          <div style={{animation: 'fishBodyWave 0.7s ease-in-out infinite'}}>
            <FishShape size={f.size} flip={f.direction === 'left'} />
          </div>
        </div>
      ))}
    </div>
  )
}
