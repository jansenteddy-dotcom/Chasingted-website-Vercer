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

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(((index % images.length) + images.length) % images.length)
      setFading(false)
    }, 250)
    setAutoKey(k => k + 1)
  }, [images.length])

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
    <div className="mb-10">
      <div
        className="grid grid-cols-3 gap-2"
        style={{opacity: fading ? 0 : 1, transition: 'opacity 0.25s ease'}}
      >
        {visible.map((img, i) => (
          <div key={`${current}-${i}`} className="relative aspect-[3/2] overflow-hidden rounded">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
          </div>
        ))}
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
  )
}
