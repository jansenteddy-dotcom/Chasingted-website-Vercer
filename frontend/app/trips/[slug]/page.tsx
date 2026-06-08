import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {tripBySlugQuery, tripSlugsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import {format, parseISO} from 'date-fns'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data: slugs} = await sanityFetch({query: tripSlugsQuery, stega: false})
  return slugs?.map(({slug}) => ({slug})) ?? []
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}, stega: false})
  if (!trip) return {title: 'Trip not found'}
  return {
    title: trip.title,
    description: trip.shortDescription || undefined,
  }
}

export default async function TripDetailPage({params}: Props) {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}})

  if (!trip) notFound()

  const startDate = trip.startDate ? format(parseISO(trip.startDate), 'dd MMMM yyyy') : 'TBC'
  const endDate = trip.endDate ? format(parseISO(trip.endDate), 'dd MMMM yyyy') : 'TBC'
  const currencySymbol = trip.price?.currency === 'EUR' ? '€' : trip.price?.currency || ''

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] bg-[#3a4a40]">
        {trip.heroImage?.asset && (
          <Image
            src={urlFor(trip.heroImage).width(1400).height(700).url()}
            alt={(trip.heroImage as any).alt || trip.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-[#133425]/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container">
            <span className="text-[#f7b500] text-sm font-semibold uppercase tracking-widest">{trip.destination}</span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#F5F0E4] mt-2">{trip.title}</h1>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {trip.shortDescription && (
              <p className="text-[#3a4a40] text-lg leading-relaxed mb-8 font-light">
                {trip.shortDescription}
              </p>
            )}

            {/* Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <section className="mb-10">
                <h2 className="font-serif text-2xl text-[#133425] mb-6">Itinerary</h2>
                <div className="space-y-4">
                  {trip.itinerary.map((day: any) => (
                    <div key={day._key} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-[#133425] flex items-center justify-center text-[#f7b500] font-serif text-sm font-semibold">
                        {day.day}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#133425]">{day.title}</h3>
                        {day.description && (
                          <p className="text-[#3a4a40]/70 text-sm mt-1">{day.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Included / Excluded */}
            {(trip.included?.length || trip.excluded?.length) && (
              <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {trip.included && trip.included.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-[#133425] mb-4">What&apos;s included</h2>
                    <ul className="space-y-2">
                      {trip.included.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a40]">
                          <span className="text-[#f7b500] mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trip.excluded && trip.excluded.length > 0 && (
                  <div>
                    <h2 className="font-serif text-xl text-[#133425] mb-4">Not included</h2>
                    <ul className="space-y-2">
                      {trip.excluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a40]/70">
                          <span className="mt-0.5">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#F5F0E4] rounded-xl p-6 border border-[#E7DBBF]">
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#3a4a40]/60">Dates</span>
                  <span className="text-[#133425] font-medium">{startDate} – {endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3a4a40]/60">Destination</span>
                  <span className="text-[#133425] font-medium">{trip.destination}</span>
                </div>
                {trip.difficultyLevel && (
                  <div className="flex justify-between">
                    <span className="text-[#3a4a40]/60">Difficulty</span>
                    <span className="text-[#133425] font-medium capitalize">{trip.difficultyLevel}</span>
                  </div>
                )}
                {trip.maxGroupSize && (
                  <div className="flex justify-between">
                    <span className="text-[#3a4a40]/60">Group size</span>
                    <span className="text-[#133425] font-medium">Max {trip.maxGroupSize} people</span>
                  </div>
                )}
              </div>

              {trip.price && (
                <div className="border-t border-[#E7DBBF] pt-4 mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[#3a4a40]/60 text-sm">Total price</span>
                    <span className="font-serif text-2xl text-[#133425]">
                      {currencySymbol}{trip.price.total?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#3a4a40]/50">
                    Deposit: {currencySymbol}{trip.price.deposit?.toLocaleString()} to secure your spot
                  </p>
                </div>
              )}

              {trip.status === 'open' ? (
                <Link
                  href={`/trips/${trip.slug}/apply`}
                  className="block w-full bg-[#f7b500] text-[#133425] font-semibold text-center py-4 rounded hover:bg-[#d9a441] transition-colors duration-200"
                >
                  Apply for this trip
                </Link>
              ) : (
                <div className="w-full bg-gray-200 text-gray-500 font-semibold text-center py-4 rounded">
                  {trip.status === 'full' ? 'This trip is full' : 'Applications closed'}
                </div>
              )}

              <p className="text-xs text-center text-[#3a4a40]/50 mt-3">
                Free to apply · Teddy reviews every application personally
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
