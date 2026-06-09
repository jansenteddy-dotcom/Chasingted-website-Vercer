export default function Campfire({className = ''}: {className?: string}) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg viewBox="0 0 72 86" width="72" height="86" xmlns="http://www.w3.org/2000/svg">
        {/* Ground glow */}
        <ellipse cx="36" cy="72" rx="24" ry="7" fill="#FF6B00" opacity="0.15" />

        {/* Outer flame — orange */}
        <path
          d="M36 70 C20 59 17 44 25 27 C28 19 32 12 36 4 C40 12 44 19 47 27 C55 44 52 59 36 70Z"
          fill="#FF7B00"
          style={{
            transformOrigin: '36px 70px',
            animation: 'flicker1 0.65s ease-in-out infinite alternate',
          }}
        />
        {/* Mid flame — amber */}
        <path
          d="M36 70 C24 62 22 49 28 35 C31 26 34 18 36 10 C38 18 41 26 44 35 C50 49 48 62 36 70Z"
          fill="#FFA500"
          style={{
            transformOrigin: '36px 70px',
            animation: 'flicker2 0.8s ease-in-out infinite alternate',
          }}
        />
        {/* Inner flame — yellow */}
        <path
          d="M36 70 C29 63 28 53 32 41 C34 33 35 25 36 17 C37 25 38 33 40 41 C44 53 43 63 36 70Z"
          fill="#FFD700"
          style={{
            transformOrigin: '36px 70px',
            animation: 'flicker3 0.45s ease-in-out infinite alternate',
          }}
        />
        {/* White-hot core */}
        <path
          d="M36 68 C33 61 33 53 35 45 C35.5 39 36 33 36 28 C36 33 36.5 39 37 45 C39 53 39 61 36 68Z"
          fill="rgba(255,255,240,0.65)"
          style={{
            transformOrigin: '36px 68px',
            animation: 'flicker2 0.35s ease-in-out infinite alternate',
          }}
        />

        {/* Logs */}
        <line x1="5" y1="80" x2="51" y2="70" stroke="#7B3F1E" strokeWidth="8" strokeLinecap="round" />
        <line x1="21" y1="70" x2="67" y2="80" stroke="#9B5223" strokeWidth="8" strokeLinecap="round" />

        {/* Embers */}
        <circle
          cx="29"
          cy="74"
          r="2.5"
          fill="#FF4500"
          opacity="0.85"
          style={{animation: 'flicker3 1.1s ease-in-out infinite alternate'}}
        />
        <circle
          cx="45"
          cy="73"
          r="1.8"
          fill="#FF6B00"
          opacity="0.75"
          style={{animation: 'flicker1 0.85s ease-in-out infinite alternate'}}
        />
      </svg>
    </div>
  )
}
