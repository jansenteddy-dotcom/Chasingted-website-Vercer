export default function TopoBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <img
        src="/topo-bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'invert(1)',
          mixBlendMode: 'screen',
          opacity: 0.18,
        }}
      />
    </div>
  )
}
