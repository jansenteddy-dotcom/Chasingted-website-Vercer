// Rock climber ascending the photo/cream boundary in the "Why Chasingted" section.
// Hidden on mobile (no vertical seam there); shown at md+ where columns split 50/50.
// Positioned slightly into the cream side so it isn't hidden behind the photo.
export default function Climber() {
  return (
    <div
      className="hidden md:block absolute pointer-events-none select-none"
      style={{left: 'calc(50% + 4px)', top: 0}}
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

          {/* Chalk bag at hip — static */}
          <rect x="17" y="28" width="5" height="6" rx="1" strokeWidth="1.5" />

          {/* Pose A: right arm high, left arm lower, right leg bent up, left leg extended */}
          <g style={{animation: 'climbPoseA 1.2s ease-in-out infinite'}}>
            <path d="M15 22 Q6 11 1 4" />
            <path d="M15 22 Q10 30 8 37" />
            <path d="M15 38 Q9 44 4 52" />
            <line x1="2" y1="51" x2="9" y2="54" strokeWidth="2.5" />
            <path d="M15 38 Q21 47 25 57" />
            <line x1="23" y1="56" x2="29" y2="59" strokeWidth="2.5" />
          </g>

          {/* Pose B: left arm high, right arm lower, left leg bent up, right leg extended */}
          <g style={{animation: 'climbPoseB 1.2s ease-in-out infinite'}}>
            <path d="M15 22 Q7 11 2 4" />
            <path d="M15 22 Q11 30 9 37" />
            <path d="M15 38 Q9 43 5 51" />
            <line x1="3" y1="50" x2="10" y2="53" strokeWidth="2.5" />
            <path d="M15 38 Q22 47 26 58" />
            <line x1="24" y1="57" x2="30" y2="60" strokeWidth="2.5" />
          </g>
        </svg>
      </div>
    </div>
  )
}
