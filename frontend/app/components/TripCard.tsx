import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/utils'
import type {TripCard as TripCardType} from '@/sanity/lib/types'
import {format, parseISO} from 'date-fns'

export default function TripCard({trip}: {trip: TripCardType}) {
  const dateStr =
    trip.startDate
      ? format(parseISO(trip.startDate), 'MMM yyyy')
      : 'Date TBC'

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    challenging: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800',
  }

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group block rounded-lg overflow-hidden border border-[#E7DBBF] hover:shadow-lg transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-56 bg-[#3a4a40]/20">
        {trip.heroImage?.asset && (
          <Image
            src={urlFor(trip.heroImage).width(600).height(400).url()}
            alt={trip.heroImage.alt || trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* Status badge */}
        {trip.status === 'full' && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Full
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg text-[#133425] leading-tight">{trip.title}</h3>
          {trip.difficultyLevel && (
            <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${difficultyColors[trip.difficultyLevel] || ''}`}>
              {trip.difficultyLevel}
            </span>
          )}
        </div>
        <p className="text-[#3a4a40]/70 text-sm mb-1">{trip.destination}</p>
        <p className="text-[#3a4a40]/60 text-xs mb-3">{dateStr}</p>
        {trip.shortDescription && (
          <p className="text-[#3a4a40] text-sm leading-relaxed line-clamp-3">
            {trip.shortDescription}
          </p>
        )}
        {trip.price && (
          <div className="mt-4 pt-4 border-t border-[#E7DBBF] flex justify-between items-center">
            <div>
              <span className="text-xs text-[#3a4a40]/60">From</span>
              <div className="font-semibold text-[#133425]">
                {trip.price.currency === 'EUR' ? '€' : trip.price.currency}
                {trip.price.total?.toLocaleString()}
              </div>
            </div>
            <span className="text-sm font-medium text-[#f7b500]">Apply →</span>
          </div>
        )}
      </div>
    </Link>
  )
}
