import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/utils'
import type {TripCard as TripCardType} from '@/sanity/lib/types'

export default function TripCard({trip}: {trip: TripCardType}) {
  const activityLabel = trip.difficultyLevel
    ? trip.difficultyLevel.charAt(0).toUpperCase() + trip.difficultyLevel.slice(1)
    : null

  const price = trip.price?.total
    ? `${trip.price.currency === 'EUR' ? '€' : trip.price.currency}${trip.price.total.toLocaleString()}`
    : null

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group block overflow-hidden hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-64 bg-[#3a4a40]">
        {trip.heroImage?.asset && (
          <Image
            src={urlFor(trip.heroImage).width(600).height(400).url()}
            alt={trip.heroImage.alt || `${trip.title}${trip.destination ? ` — ${trip.destination}` : ''} — Chasingted small-group adventure expedition`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Spots badge */}
        {trip.status === 'open' && trip.maxGroupSize && (
          <div className="absolute top-0 right-0 bg-[#d9a441] text-[#1a1a1a] text-xs font-bold px-4 py-2 tracking-widest uppercase">
            {trip.maxGroupSize} spots left
          </div>
        )}
        {trip.status === 'full' && (
          <div className="absolute top-0 right-0 bg-[#3a4a40] text-[#F5F0E4] text-xs font-bold px-4 py-2 tracking-widest uppercase">
            Full
          </div>
        )}
      </div>

      {/* Card body — dark green */}
      <div className="bg-[#133425] p-6">
        <h3 className="text-[#F5F0E4] font-bold text-lg uppercase tracking-wide leading-tight mb-3">
          {trip.title}
        </h3>
        {(trip.destination || activityLabel) && (
          <p className="text-[#F5F0E4]/50 text-xs uppercase tracking-widest mb-4">
            {[trip.destination, activityLabel].filter(Boolean).join(' · ')}
          </p>
        )}
        {price && (
          <p className="text-[#F5F0E4]/80 text-sm mb-5">
            From {price}
          </p>
        )}
        <div className="bg-[#3a4a40] text-[#F5F0E4] text-xs font-bold tracking-widest uppercase text-center py-3 group-hover:bg-[#4e6358] transition-colors duration-200">
          View Trip
        </div>
      </div>
    </Link>
  )
}
