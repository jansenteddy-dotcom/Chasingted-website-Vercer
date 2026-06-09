'use client'

import {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'

type GalleryImage = {
  url: string
  alt: string
  caption?: string
}

export default function GalleryCarousel({images}: {images: GalleryImage[]}) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const [autoKey, setAutoKey] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(((index % images.length) + images.length) % images.length)
      setFading(false)
    }, 250)
    setAutoKey(k => k + 1)
  }, [images.length])

  const lightboxPrev = useCallback(() =>
    setLightbox(i => i === null ? null : ((i - 1 + images.length) % images.length)),
    [images.length])

  const lightboxNext = useCallback(() =>
    setLightbox(i => i === null ? null : ((i + 1) % images.length)),
    [images.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, lightboxPrev, lightboxNext])

  // Auto-rotate carousel
  useEffect(() => {
    if (images.length <= 3) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % images.length)
        setFading(false)
      }, 250)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length, autoKey])

  if (!images.length) return null

  const visible = [0, 1, 2].map(offset => images[(current + offset) % images.length])
  const totalSteps = images.length

  return (
    <>
      <div className="mb-10">
        <div
          className="grid grid-cols-3 gap-2"
          style={{opacity: fading ? 0 : 1, transition: 'opacity 0.25s ease'}}
        >
          {visible.map((img, i) => {
            const imgIndex = (current + i) % images.length
            return (
              <button
                key={`${current}-${i}`}
                onClick={() => setLightbox(imgIndex)}
                className="relative aspect-[3/2] overflow-hidden rounded group cursor-zoom-in focus:outline-none"
                aria-label={`Enlarge photo ${imgIndex + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
              </button>
            )
          })}
        </div>

        {totalSteps > 3 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => goTo(current - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#133425]/30 text-[#133425] hover:bg-[#133425] hover:text-[#f5f0e4] transition-colors text-sm"
              aria-label="Previous photos"
            >
              ←
            </button>
            <div className="flex gap-1.5">
              {Array.from({length: totalSteps}).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? 'bg-[#133425]' : 'bg-[#3a4a40]/25 hover:bg-[#3a4a40]/50'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo(current + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#133425]/30 text-[#133425] hover:bg-[#133425] hover:text-[#f5f0e4] transition-colors text-sm"
              aria-label="Next photos"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl leading-none z-10"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ×
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
              onClick={e => { e.stopPropagation(); lightboxPrev() }}
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].url}
              alt={images[lightbox].alt}
              width={1200}
              height={900}
              className="object-contain max-h-[80vh] w-full"
              sizes="100vw"
            />
            {images[lightbox].caption && (
              <p className="text-white/70 text-sm text-center mt-3 italic">
                {images[lightbox].caption}
              </p>
            )}
            <p className="text-white/40 text-xs text-center mt-1">
              {lightbox + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 px-2"
              onClick={e => { e.stopPropagation(); lightboxNext() }}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
