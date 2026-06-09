// Mountain scene with a 4x4 truck driving up the slope — bottom-left corner of Instagram section.
export default function MountainTruck() {
  return (
    <div
      className="absolute bottom-0 left-0 pointer-events-none select-none z-10"
      style={{width: 260, height: 200}}
      aria-hidden
    >
      {/* Static mountain and trees */}
      <svg
        viewBox="0 0 260 200"
        width="260"
        height="200"
        style={{position: 'absolute', top: 0, left: 0}}
        fill="none"
        stroke="#133425"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Left slope */}
        <path d="M0 200 L115 30" strokeWidth="2" />
        {/* Right slope */}
        <path d="M115 30 L260 200" strokeWidth="2" />
        {/* Snow cap */}
        <path d="M97 53 L115 26 L133 53" strokeWidth="1.5" />
        {/* Ground */}
        <line x1="0" y1="200" x2="260" y2="200" strokeWidth="1.2" opacity="0.35" />
        {/* Pine trees on left slope */}
        <path d="M38 177 L47 159 L56 177" strokeWidth="1.5" />
        <line x1="47" y1="177" x2="47" y2="186" strokeWidth="1.5" />
        <path d="M18 188 L25 175 L32 188" strokeWidth="1.3" />
        <line x1="25" y1="188" x2="25" y2="196" strokeWidth="1.3" />
      </svg>

      {/* Truck animated up the right slope */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          animation: 'driveUpHill 5.5s linear infinite',
        }}
      >
        {/* Truck SVG — faces right in SVG, rotated to face uphill-left */}
        <svg
          viewBox="0 0 74 46"
          width="58"
          height="36"
          fill="none"
          stroke="#133425"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{transform: 'scaleX(-1) rotate(-45deg)', display: 'block'}}
        >
          {/* Rear wheel */}
          <circle cx="14" cy="38" r="7" />
          <circle cx="14" cy="38" r="3" strokeWidth="1.4" />
          {/* Front wheel */}
          <circle cx="58" cy="38" r="7" />
          <circle cx="58" cy="38" r="3" strokeWidth="1.4" />
          {/* Main side body panel */}
          <path d="M7 27 L7 17 L38 17 L38 27" />
          {/* Cab */}
          <path d="M38 27 L38 12 Q40 8 46 7 L62 7 Q67 7 69 12 L69 27 Z" />
          {/* Windshield interior line */}
          <line x1="40" y1="13" x2="69" y2="13" strokeWidth="1.4" />
          {/* Front bumper / bullbar */}
          <path d="M69 19 L74 18 L74 27 L69 27" strokeWidth="1.6" />
          {/* Headlight */}
          <line x1="71" y1="20" x2="76" y2="20" strokeWidth="2.2" />
          {/* Exhaust pipe at rear */}
          <path d="M8 23 Q3 22 1 20" />
          {/* Exhaust smoke puffs */}
          <circle
            cx="0"
            cy="19"
            r="2.5"
            style={{transformOrigin: '0px 19px', animation: 'exhaustPuff 0.9s 0s ease-out infinite'}}
          />
          <circle
            cx="0"
            cy="19"
            r="2.5"
            style={{transformOrigin: '0px 19px', animation: 'exhaustPuff 0.9s 0.3s ease-out infinite'}}
          />
          <circle
            cx="0"
            cy="19"
            r="2.5"
            style={{transformOrigin: '0px 19px', animation: 'exhaustPuff 0.9s 0.6s ease-out infinite'}}
          />
          {/* Spare tire on rear */}
          <circle cx="10" cy="22" r="4" strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  )
}
