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
  const w = size
  const h = Math.round(size * 76 / 196)
  return (
    <svg
      viewBox="-36 0 196 76"
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#133425"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? {transform: 'scaleX(-1)'} : undefined}
    >
      {/* Speed lines trailing behind (appear on other side when flipped) */}
      <line x1="-32" y1="28" x2="-6" y2="28" strokeWidth="1.5" opacity="0.48" />
      <line x1="-26" y1="38" x2="-5" y2="38" strokeWidth="1.2" opacity="0.38" />
      <line x1="-20" y1="47" x2="-4" y2="47" strokeWidth="1" opacity="0.28" />

      {/* Rear wheel */}
      <circle cx="36" cy="60" r="16" />
      <circle cx="36" cy="60" r="4" strokeWidth="1.5" />

      {/* Front wheel */}
      <circle cx="128" cy="60" r="16" />
      <circle cx="128" cy="60" r="4" strokeWidth="1.5" />

      {/* Swing arm */}
      <line x1="36" y1="60" x2="64" y2="32" />

      {/* Top/seat tube */}
      <path d="M64 32 Q78 24 94 24" />

      {/* Head tube */}
      <line x1="94" y1="24" x2="96" y2="14" />

      {/* Handlebar (wide adventure style) */}
      <line x1="84" y1="14" x2="108" y2="14" />
      <line x1="84" y1="10" x2="84" y2="18" strokeWidth="2.5" />
      <line x1="108" y1="10" x2="108" y2="18" strokeWidth="2.5" />

      {/* Front fork */}
      <line x1="98" y1="20" x2="128" y2="60" />

      {/* Down tube */}
      <line x1="64" y1="32" x2="62" y2="54" />

      {/* Chain stay */}
      <line x1="36" y1="60" x2="62" y2="60" />

      {/* Engine block */}
      <path d="M62 34 L62 60 L80 60 L82 40 Z" />

      {/* Fuel tank */}
      <path d="M66 32 Q78 22 92 26" />

      {/* Exhaust pipe */}
      <path d="M62 56 Q46 62 36 60" />

      {/* Rear fender */}
      <path d="M24 46 Q28 38 36 38" />

      {/* Front fender */}
      <path d="M128 44 Q134 44 140 52" />

      {/* Rider torso leaning forward */}
      <path d="M70 32 Q75 18 90 12" strokeWidth="2.5" />

      {/* Helmet */}
      <circle cx="90" cy="7" r="6" />

      {/* Visor */}
      <path d="M85 6 Q90 4 95 6" strokeWidth="1.5" />

      {/* Arm to handlebar */}
      <path d="M78 18 Q86 15 94 14" />

      {/* Leg / foot peg */}
      <path d="M70 32 Q68 44 64 54" />
      <line x1="62" y1="54" x2="70" y2="54" strokeWidth="2.5" />
    </svg>
  )
}

// y=18 puts the first motorcycle at the "Before You Go" title level for a text-layering effect
// The section container uses relative z-10 so the motorcycle appears to pass behind the letters
const MOTOS: MotoData[] = [
  {y: 18, size: 130, duration: 14, delay: 0,  direction: 'right', opacity: 0.55},
  {y: 82, size: 110, duration: 18, delay: 8,  direction: 'left',  opacity: 0.48},
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
