'use client'

import {useState} from 'react'
import Image from 'next/image'

type GalleryImage = {
  url: string
  alt: string
  caption?: string
}

export default function GalleryCarousel({images}: {images: GalleryImage[]}) {
  const [current, setCurrent] = useState(0)

  if (!images.length) return null

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  const img = images[current]

  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-[#133425] mb-6">Photo Gallery</h2>
      <div>
        <div className="relative aspect-[4/3] bg-[#3a4a40] overflow-hidden rounded">
          <Image
            src={img.url}
            alt={img.alt || 'Chasingted expedition photo'}
            fill
            className="object-cover transition-opacity duration-300"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#133425]/70 hover:bg-[#133425] text-[#f5f0e4] w-10 h-10 flex items-center justify-center rounded-full transition-colors text-lg"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#133425]/70 hover:bg-[#133425] text-[#f5f0e4] w-10 h-10 flex items-center justify-center rounded-full transition-colors text-lg"
                aria-label="Next photo"
              >
                →
              </button>
              <span className="absolute bottom-3 right-4 bg-[#133425]/60 text-[#f5f0e4] text-xs px-2 py-1 rounded">
                {current + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {img.caption && (
          <p className="text-sm text-[#3a4a40]/70 mt-3 italic">{img.caption}</p>
        )}

        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? 'bg-[#133425]' : 'bg-[#3a4a40]/30 hover:bg-[#3a4a40]/60'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
