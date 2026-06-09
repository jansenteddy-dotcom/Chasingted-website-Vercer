// Rock climber ascending the photo/cream boundary in the "Why Chasingted" section.
// Hidden on mobile (no vertical seam there); shown at md+ where columns split 50/50.
export default function Climber() {
  return (
    <div
      className="hidden md:block absolute pointer-events-none select-none"
      style={{left: 'calc(50% - 17px)', top: 0}}
      aria-hidden
    >
      <div style={{animation: 'climbUp 10s linear infinite'}}>
        <svg
          viewBox="-5 -5 44 74"
          width="34"
          height="64"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#133425"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Rope above helmet */}
          <line x1="15" y1="-4" x2="15" y2="1" strokeWidth="1.5" opacity="0.5" />

          {/* Helmet */}
          <circle cx="15" cy="9" r="7" />
          {/* Helmet brim */}
          <path d="M8 13 Q15 16 22 13" strokeWidth="1.5" />

          {/* Body */}
          <line x1="15" y1="16" x2="15" y2="38" />

          {/* Harness across chest */}
          <path d="M10 24 Q15 26 20 24" strokeWidth="1.5" />

          {/* Right arm — reaching up toward the wall */}
          <path d="M15 22 Q8 15 4 8" />

          {/* Left arm — bracing lower */}
          <path d="M15 22 Q9 28 6 33" />

          {/* Chalk bag at hip */}
          <rect x="17" y="28" width="5" height="6" rx="1" strokeWidth="1.5" />

          {/* Right leg — higher foot on wall */}
          <path d="M15 38 Q10 46 6 54" />
          <line x1="4" y1="53" x2="10" y2="56" strokeWidth="2.5" />

          {/* Left leg — lower */}
          <path d="M15 38 Q19 47 22 56" />
          <line x1="20" y1="55" x2="26" y2="58" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  )
}
