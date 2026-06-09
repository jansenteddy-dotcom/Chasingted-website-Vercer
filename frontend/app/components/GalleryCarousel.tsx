'use client'

import {useState, useEffect} from 'react'
import Image from 'next/image'

type GalleryImage = {
  url: string
  alt: string
  caption?: string
}

export default function GalleryCarousel({images}: {images: GalleryImage[]}) {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (images.length <= 3) return
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % images.length)
        setFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  if (!images.length) return null

  const visible = [0, 1, 2].map(offset => images[(current + offset) % images.length])

  return (
    <div className="mb-10">
      <div
        className="grid grid-cols-3 gap-2 transition-opacity duration-400"
        style={{opacity: fading ? 0 : 1}}
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
    </div>
  )
}
