// 4x4 adventure truck driving through the Follow the Journey section.
// Two trucks: one heading right (larger, foreground), one heading left (smaller, background).

function TruckSVG({flip = false, small = false}: {flip?: boolean; small?: boolean}) {
  const w = small ? 166 : 192
  const h = small ? 55 : 63
  return (
    <svg
      viewBox="-65 0 252 82"
      width={w}
      height={h}
      fill="none"
      stroke="#133425"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={flip ? {transform: 'scaleX(-1)', display: 'block'} : {display: 'block'}}
    >
      {/* ── DUST / SPEED TRAIL (trails behind = left side) ── */}
      <line x1="-60" y1="34" x2="-6"  y2="34" strokeWidth="1.4" opacity="0.44" />
      <line x1="-52" y1="45" x2="-5"  y2="45" strokeWidth="1.2" opacity="0.34" />
      <line x1="-40" y1="57" x2="-4"  y2="57" strokeWidth="1.0" opacity="0.24" />
      {/* Dirt kick from rear wheel */}
      <path d="M-4 63 Q-12 55 -20 59" strokeWidth="1" opacity="0.28" />
      <path d="M-4 67 Q-16 60 -26 65" strokeWidth="0.9" opacity="0.2" />

      {/* ── EXHAUST PIPE ── */}
      <path d="M16 49 Q9 48 5 45" strokeWidth="2.2" />

      {/* ── EXHAUST SMOKE (three puffs, staggered) ── */}
      <circle cx="4" cy="44" r="4.5"
        style={{transformBox: 'fill-box', transformOrigin: 'center', animation: 'truckSmoke 1.1s 0s ease-out infinite'}} />
      <circle cx="4" cy="44" r="4.5"
        style={{transformBox: 'fill-box', transformOrigin: 'center', animation: 'truckSmoke 1.1s 0.37s ease-out infinite'}} />
      <circle cx="4" cy="44" r="4.5"
        style={{transformBox: 'fill-box', transformOrigin: 'center', animation: 'truckSmoke 1.1s 0.74s ease-out infinite'}} />

      {/* ── WHEELS (large off-road with spokes) ── */}
      <circle cx="28" cy="68" r="14" />
      <circle cx="28" cy="68" r="5.5" strokeWidth="1.5" />
      <line x1="28" y1="54" x2="28" y2="82" strokeWidth="1" opacity="0.55" />
      <line x1="14" y1="68" x2="42" y2="68" strokeWidth="1" opacity="0.55" />

      <circle cx="152" cy="68" r="14" />
      <circle cx="152" cy="68" r="5.5" strokeWidth="1.5" />
      <line x1="152" y1="54" x2="152" y2="82" strokeWidth="1" opacity="0.55" />
      <line x1="138" y1="68" x2="166" y2="68" strokeWidth="1" opacity="0.55" />

      {/* ── BODY ── */}
      {/* Chassis floor */}
      <line x1="16" y1="54" x2="166" y2="54" strokeWidth="1.5" />

      {/* Rear pickup bed */}
      <path d="M16 54 L16 34 L90 34" />
      <line x1="16" y1="44" x2="90" y2="44" strokeWidth="1.3" />

      {/* Cab */}
      <path d="M88 54 L88 22 Q91 16 102 14 L152 14 Q160 14 164 20 L166 54 Z" />

      {/* Windshield (angled interior line) */}
      <line x1="157" y1="22" x2="164" y2="38" strokeWidth="1.5" />

      {/* Side window cutout */}
      <path d="M91 26 Q96 17 106 15 L148 15 Q156 15 159 22 L161 38 L91 38 Z" strokeWidth="1.3" />

      {/* B-pillar (rear of window) */}
      <line x1="91" y1="22" x2="91" y2="38" strokeWidth="1.4" />

      {/* Roof rack */}
      <line x1="105" y1="13" x2="150" y2="13" strokeWidth="1.4" />
      <line x1="114" y1="13" x2="114" y2="15" strokeWidth="1.4" />
      <line x1="127" y1="13" x2="127" y2="15" strokeWidth="1.4" />
      <line x1="140" y1="13" x2="140" y2="15" strokeWidth="1.4" />

      {/* Antenna */}
      <line x1="148" y1="12" x2="151" y2="6" strokeWidth="1.3" />

      {/* Running board / side step */}
      <line x1="22" y1="60" x2="159" y2="60" strokeWidth="1.3" />

      {/* Front bullbar */}
      <path d="M164 42 L172 40 L172 54 L164 54" />
      <line x1="170" y1="47" x2="174" y2="47" strokeWidth="1.5" />

      {/* Headlights */}
      <line x1="169" y1="41" x2="174" y2="41" strokeWidth="2.4" />
      <line x1="169" y1="47" x2="174" y2="47" strokeWidth="1.8" />

      {/* Tow hook at rear */}
      <circle cx="17" cy="56" r="2.5" strokeWidth="1.5" />
    </svg>
  )
}

export default function MountainTruck() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>

      {/* Truck 1 — heading right, larger, foreground */}
      <div
        className="absolute"
        style={{top: '74%', left: 0, animation: 'truckRight 20s linear infinite'}}
      >
        <TruckSVG />
      </div>

      {/* Truck 2 — heading left, smaller, background */}
      <div
        className="absolute"
        style={{top: '87%', left: 0, animation: 'truckLeft 26s 11s linear infinite'}}
      >
        <TruckSVG flip small />
      </div>

    </div>
  )
}
