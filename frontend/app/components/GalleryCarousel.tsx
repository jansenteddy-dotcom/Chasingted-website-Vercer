'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import Image from 'next/image'

type GalleryImage = { url: string; alt: string; caption?: string }

const FADE_MS = 600

export default function GalleryCarousel({images}: {images: GalleryImage[]}) {
  const [active, setActive] = useState(0)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [autoKey, setAutoKey] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const transitioning = useRef(false)

  const goTo = useCallback((rawIndex: number) => {
    if (transitioning.current) return
    const index = ((rawIndex % images.length) + images.length) % images.length
    if (index === active) return
    transitioning.current = true
    setIncoming(index)
    setAutoKey(k => k + 1)
    setTimeout(() => {
      setActive(index)
      setIncoming(null)
      transitioning.current = false
    }, FADE_MS)
  }, [active, images.length])

  // Auto-rotate
  useEffect(() => {
    if (images.length <= 3) return
    const interval = setInterval(() => {
      if (!transitioning.current) {
        setActive(a => {
          const next = (a + 1) % images.length
          transitioning.current = true
          setIncoming(next)
          setTimeout(() => {
            setActive(next)
            setIncoming(null)
            transitioning.current = false
          }, FADE_MS)
          return a
        })
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length, autoKey])

  // Keyboard for lightbox
  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft')  setLightbox(i => i === null ? null : ((i - 1 + images.length) % images.length))
      if (e.key === 'ArrowRight') setLightbox(i => i === null ? null : ((i + 1) % images.length))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, images.length])

  if (!images.length) return null

  const activeImages  = [0, 1, 2].map(o => images[(active + o) % images.length])
  const nextImages    = incoming !== null ? [0, 1, 2].map(o => images[(incoming + o) % images.length]) : null

  const renderGrid = (imgs: GalleryImage[], startIndex: number, interactive: boolean) => (
    <div className="grid grid-cols-3 gap-2">
      {imgs.map((img, i) => {
        const imgIndex = (startIndex + i) % images.length
        return interactive ? (
          <button
            key={imgIndex}
            onClick={() => setLightbox(imgIndex)}
            className="relative aspect-[3/2] overflow-hidden rounded group cursor-zoom-in focus:outline-none"
            aria-label={`Enlarge photo ${imgIndex + 1}`}
          >
            <Image src={img.url} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 33vw, 25vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
          </button>
        ) : (
          <div key={imgIndex} className="relative aspect-[3/2] overflow-hidden rounded">
            <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 33vw, 25vw" />
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <div className="mb-10">
        {/* Crossfade container — active layer stays visible, incoming fades in on top */}
        <div className="relative">
          {renderGrid(activeImages, active, true)}

          {nextImages && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{animation: `carouselFadeIn ${FADE_MS}ms ease forwards`}}
            >
              {renderGrid(nextImages, incoming!, false)}
            </div>
          )}
        </div>

        {images.length > 3 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => goTo(active - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#133425]/30 text-[#133425] hover:bg-[#133425] hover:text-[#f5f0e4] transition-colors text-sm"
              aria-label="Previous photos"
            >←</button>

            <div className="flex gap-1.5">
              {Array.from({length: images.length}).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-[#133425]' : 'bg-[#3a4a40]/25 hover:bg-[#3a4a40]/50'}`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(active + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#133425]/30 text-[#133425] hover:bg-[#133425] hover:text-[#f5f0e4] transition-colors text-sm"
              aria-label="Next photos"
            >→</button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10" onClick={() => setLightbox(null)} aria-label="Close">×</button>

          {images.length > 1 && (
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2" onClick={e => { e.stopPropagation(); setLightbox(i => i === null ? null : ((i - 1 + images.length) % images.length)) }} aria-label="Previous">‹</button>
          )}

          <div className="relative max-w-5xl max-h-[85vh] w-full mx-16" onClick={e => e.stopPropagation()}>
            <Image src={images[lightbox].url} alt={images[lightbox].alt} width={1200} height={900} className="object-contain max-h-[80vh] w-full" sizes="100vw" />
            {images[lightbox].caption && <p className="text-white/70 text-sm text-center mt-3 italic">{images[lightbox].caption}</p>}
            <p className="text-white/40 text-xs text-center mt-1">{lightbox + 1} / {images.length}</p>
          </div>

          {images.length > 1 && (
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2" onClick={e => { e.stopPropagation(); setLightbox(i => i === null ? null : ((i + 1) % images.length)) }} aria-label="Next">›</button>
          )}
        </div>
      )}
    </>
  )
}
