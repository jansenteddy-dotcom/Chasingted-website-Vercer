'use client'

import {useEffect, useState} from 'react'

type MotoData = {
  y: number
  size: number
  duration: number
  delay: number
  direction: 'right' | 'left'
  opacity: number
}

function MotoShape({size, flip}: {size: number; flip: boolean}) {
  return (
    <svg
      viewBox="0 0 140 68"
      width={size}
      height={Math.round(size * 0.49)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#133425"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? {transform: 'scaleX(-1)'} : undefined}
    >
      {/* Rear wheel */}
      <circle cx="28" cy="52" r="14" />
      <circle cx="28" cy="52" r="4" strokeWidth="1.5" />
      {/* Front wheel */}
      <circle cx="112" cy="52" r="14" />
      <circle cx="112" cy="52" r="4" strokeWidth="1.5" />

      {/* Swing arm: rear axle up to frame junction */}
      <line x1="28" y1="52" x2="56" y2="32" />
      {/* Top tube: seat area */}
      <path d="M56 32 Q72 24 88 26" />
      {/* Head tube */}
      <line x1="88" y1="26" x2="88" y2="16" />
      {/* Handlebar */}
      <line x1="80" y1="16" x2="96" y2="16" />
      <line x1="80" y1="13" x2="80" y2="19" strokeWidth="2.5" />
      <line x1="96" y1="13" x2="96" y2="19" strokeWidth="2.5" />
      {/* Front fork */}
      <line x1="90" y1="24" x2="112" y2="52" />
      {/* Down tube */}
      <line x1="56" y1="32" x2="54" y2="50" />
      {/* Engine block */}
      <rect x="52" y="38" width="28" height="14" rx="2" />
      {/* Chain / underside */}
      <line x1="28" y1="52" x2="52" y2="52" />
      {/* Exhaust */}
      <path d="M54 52 Q38 58 28 52" />
      {/* Fuel tank */}
      <path d="M60 32 Q72 23 84 28" />
      {/* Rear fender */}
      <path d="M16 46 Q20 38 28 38" />
      {/* Front fender */}
      <path d="M112 38 Q118 38 126 46" />

      {/* Rider — torso leaning forward */}
      <path d="M66 32 Q70 18 84 14" strokeWidth="2.5" />
      {/* Helmet */}
      <circle cx="84" cy="8" r="6" />
      {/* Visor */}
      <path d="M79 7 Q84 5 89 7" strokeWidth="1.5" />
      {/* Arm reaching to handlebar */}
      <path d="M74 19 Q82 17 88 16" />
      {/* Rear leg */}
      <path d="M68 32 Q72 42 76 46" />
    </svg>
  )
}

const MOTOS: MotoData[] = [
  {y: 80, size: 130, duration: 20, delay: 0,  direction: 'right', opacity: 0.55},
  {y: 84, size: 110, duration: 25, delay: 13, direction: 'left',  opacity: 0.48},
]

export default function Motorcycle({count = 2}: {count?: number}) {
  const [motos, setMotos] = useState<MotoData[]>([])

  useEffect(() => {
    setMotos(MOTOS.slice(0, count))
  }, [count])

  if (motos.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {motos.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${m.y}%`,
            left: 0,
            opacity: m.opacity,
            animation: `${m.direction === 'right' ? 'rideRight' : 'rideLeft'} ${m.duration}s ${m.delay}s linear infinite`,
          }}
        >
          <MotoShape size={m.size} flip={m.direction === 'left'} />
        </div>
      ))}
    </div>
  )
}
