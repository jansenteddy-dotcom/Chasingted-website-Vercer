// Line-art sedan driving through the Follow the Journey section.
// Long speed-line trail behind each car, exhaust smoke drifting from the pipe.

function CarSVG({flip = false, small = false}: {flip?: boolean; small?: boolean}) {
  const w = small ? 262 : 300
  const h = small ? 50 : 57
  return (
    <svg
      viewBox="-220 0 400 76"
      width={w}
      height={h}
      fill="none"
      stroke="#133425"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? {transform: 'scaleX(-1)', display: 'block'} : {display: 'block'}}
    >
      {/* ── LONG SPEED-LINE TRAIL ── */}
      <line x1="-215" y1="22" x2="-5"  y2="22" strokeWidth="1.8" opacity="0.52" />
      <line x1="-200" y1="31" x2="-5"  y2="31" strokeWidth="1.5" opacity="0.44" />
      <line x1="-178" y1="40" x2="-4"  y2="40" strokeWidth="1.3" opacity="0.36" />
      <line x1="-148" y1="49" x2="-4"  y2="49" strokeWidth="1.0" opacity="0.27" />
      <line x1="-110" y1="57" x2="-4"  y2="57" strokeWidth="0.8" opacity="0.2"  />
      {/* Dust wisps near ground */}
      <path d="M-5 61 Q-22 55 -38 59"  strokeWidth="1"   opacity="0.26" />
      <path d="M-6 65 Q-35 59 -65 63"  strokeWidth="0.9" opacity="0.18" />
      <path d="M-8 68 Q-55 63 -95 67"  strokeWidth="0.7" opacity="0.12" />

      {/* ── EXHAUST PIPE ── */}
      <path d="M33 51 Q26 50 23 46" strokeWidth="2.2" />

      {/* ── EXHAUST SMOKE (three staggered puffs) ── */}
      <circle cx="22" cy="45" r="4"
        style={{transformBox:'fill-box', transformOrigin:'center', animation:'truckSmoke 1.1s 0s ease-out infinite'}} />
      <circle cx="22" cy="45" r="4"
        style={{transformBox:'fill-box', transformOrigin:'center', animation:'truckSmoke 1.1s 0.37s ease-out infinite'}} />
      <circle cx="22" cy="45" r="4"
        style={{transformBox:'fill-box', transformOrigin:'center', animation:'truckSmoke 1.1s 0.74s ease-out infinite'}} />

      {/* ── WHEELS ── */}
      <circle cx="57"  cy="63" r="12" />
      <circle cx="57"  cy="63" r="4.5" strokeWidth="1.5" />
      <line x1="57"  y1="51" x2="57"  y2="75" strokeWidth="1" opacity="0.5" />
      <line x1="45"  y1="63" x2="69"  y2="63" strokeWidth="1" opacity="0.5" />

      <circle cx="158" cy="63" r="12" />
      <circle cx="158" cy="63" r="4.5" strokeWidth="1.5" />
      <line x1="158" y1="51" x2="158" y2="75" strokeWidth="1" opacity="0.5" />
      <line x1="146" y1="63" x2="170" y2="63" strokeWidth="1" opacity="0.5" />

      {/* ── SEDAN BODY OUTLINE ── */}
      {/* Silhouette: rear bumper → trunk sweep up → flat roof → windshield slope → front bumper */}
      <path d="M33 47 Q33 44 36 39 Q40 15 59 13 L152 13 Q163 13 169 24 L172 42 Q172 44 172 47 Z" />

      {/* C-pillar (rear roof post — separates boot from rear window) */}
      <line x1="59"  y1="15" x2="59"  y2="47" strokeWidth="1.5" />

      {/* B-pillar (door divider — thicker, characteristic of a sedan) */}
      <line x1="112" y1="15" x2="112" y2="47" strokeWidth="2.6" />

      {/* Windshield inner line (diagonal) */}
      <line x1="152" y1="16" x2="169" y2="39" strokeWidth="1.5" />

      {/* Waistline / belt line — horizontal line across the door panels */}
      <line x1="59"  y1="34" x2="172" y2="34" strokeWidth="1.2" opacity="0.55" />

      {/* Tail lights */}
      <line x1="29" y1="22" x2="34" y2="22" strokeWidth="2.5" />
      <line x1="29" y1="29" x2="34" y2="29" strokeWidth="1.8" />

      {/* Headlights */}
      <line x1="169" y1="28" x2="174" y2="28" strokeWidth="2.5" />
      <line x1="169" y1="35" x2="174" y2="35" strokeWidth="1.8" />

      {/* Side mirror */}
      <path d="M158 22 L163 22 L163 26 L157 26" strokeWidth="1.3" />

      {/* Fuel filler cap (small circle on rear door) */}
      <circle cx="84" cy="26" r="2" strokeWidth="1.2" />
    </svg>
  )
}

export default function MountainTruck() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>

      {/* Car 1 — heading right, foreground */}
      <div
        className="absolute"
        style={{top: '74%', left: 0, animation: 'truckRight 22s linear infinite'}}
      >
        <CarSVG />
      </div>

      {/* Car 2 — heading left, slightly smaller (depth) */}
      <div
        className="absolute"
        style={{top: '87%', left: 0, animation: 'truckLeft 28s 13s linear infinite'}}
      >
        <CarSVG flip small />
      </div>

    </div>
  )
}
