import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {tripBySlugQuery, tripSlugsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import {format, parseISO} from 'date-fns'
import GalleryCarousel from '@/app/components/GalleryCarousel'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const slugs = await client.fetch(tripSlugsQuery)
  return slugs?.map(({slug}: {slug: string}) => ({slug})) ?? []
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}, stega: false})
  if (!trip) return {title: 'Trip not found'}

  const description =
    trip.shortDescription ||
    `${trip.title}${trip.destination ? ` in ${trip.destination}` : ''} — small-group adventure expedition by Chasingted. Max ${trip.maxGroupSize || 10} travelers, expert guides.`

  const heroImageUrl = trip.heroImage?.asset
    ? urlFor(trip.heroImage).width(1200).height(630).url()
    : undefined

  return {
    title: `${trip.title} — Small-Group Adventure Expedition`,
    description,
    openGraph: {
      title: `${trip.title} | Chasingted`,
      description,
      type: 'website',
      images: heroImageUrl
        ? [{url: heroImageUrl, width: 1200, height: 630, alt: `${trip.title} — Chasingted expedition`}]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: trip.title,
      description,
      images: heroImageUrl ? [heroImageUrl] : [],
    },
  }
}

export default async function TripDetailPage({params}: Props) {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}})

  if (!trip) notFound()

  const startDate = trip.startDate ? format(parseISO(trip.startDate), 'dd MMMM yyyy') : 'TBC'
  const endDate = trip.endDate ? format(parseISO(trip.endDate), 'dd MMMM yyyy') : 'TBC'

  const heroAssetRef = (trip.heroImage as any)?.asset?._ref
  const galleryImages = (trip.gallery ?? [])
    .filter((img: any) => img.asset?._ref !== heroAssetRef)
    .map((img: any) => ({
      url: urlFor(img).width(1200).height(900).url(),
      alt: img.alt || `${trip.title} expedition photo`,
      caption: img.caption || undefined,
    }))

  const touristTripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.shortDescription || undefined,
    touristType: 'Adventure travelers',
    provider: {
      '@type': 'TravelAgency',
      name: 'Chasingted',
      url: 'https://chasingted.com',
    },
    ...(trip.startDate && {startDate: trip.startDate}),
    ...(trip.endDate && {endDate: trip.endDate}),
    ...(trip.heroImage?.asset && {
      image: urlFor(trip.heroImage).width(1200).url(),
    }),
    ...(trip.price?.total && {
      offers: {
        '@type': 'Offer',
        price: trip.price.total,
        priceCurrency: trip.price.currency || 'EUR',
        availability:
          trip.status === 'open'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/SoldOut',
        url: `https://chasingted.com/trips/${trip.slug}/apply`,
      },
    }),
  }
  const currencySymbol = trip.price?.currency === 'EUR' ? '€' : trip.price?.currency || ''

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(touristTripSchema)}}
      />
      {/* Hero */}
      <div className="relative h-[60vh] bg-[#3a4a40]">
        {trip.heroImage?.asset && (
          <Image
            src={urlFor(trip.heroImage).width(1400).height(700).url()}
            alt={(trip.heroImage as any).alt || `${trip.title}${trip.destination ? ` in ${trip.destination}` : ''} — Chasingted small-group adventure expedition`}
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

            {/* Photo gallery */}
            {galleryImages.length > 0 && (
              <GalleryCarousel images={galleryImages} />
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
                    <h2 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-4">What&apos;s included</h2>
                    <ul className="space-y-2">
                      {trip.included.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a40]">
                          <span className="text-[#f7b500] mt-0.5 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trip.excluded && trip.excluded.length > 0 && (
                  <div>
                    <h2 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-4">Not included</h2>
                    <ul className="space-y-2">
                      {trip.excluded.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a40]/70">
                          <span className="mt-0.5 shrink-0">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Full description */}
            {trip.fullDescription && (
              <section className="mb-10">
                <h2 className="font-serif text-2xl text-[#133425] mb-6">What to expect</h2>
                <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#133425] prose-p:text-[#3a4a40] prose-a:text-[#f7b500] max-w-none">
                  <PortableText value={trip.fullDescription} />
                </div>
              </section>
            )}

            {/* Practical Info */}
            {(trip.fitnessLevel || trip.meetingPoint || trip.cancellationPolicy || trip.gearList?.length) && (
              <section className="mb-10">
                <h2 className="font-bold text-xl uppercase tracking-widest text-[#133425] mb-6">Practical Info</h2>
                <div className="space-y-4">
                  {trip.fitnessLevel && (
                    <div className="bg-[#f5f0e4] border border-[#e7dbbf] p-6">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-2">Fitness Level</h3>
                      <p className="text-sm text-[#3a4a40] leading-relaxed">{trip.fitnessLevel}</p>
                    </div>
                  )}
                  {trip.meetingPoint && (
                    <div className="bg-[#f5f0e4] border border-[#e7dbbf] p-6">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-2">Meeting Point</h3>
                      <p className="text-sm text-[#3a4a40] leading-relaxed">{trip.meetingPoint}</p>
                    </div>
                  )}
                  {trip.cancellationPolicy && (
                    <div className="bg-[#f5f0e4] border border-[#e7dbbf] p-6">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-2">Cancellation Policy</h3>
                      <p className="text-sm text-[#3a4a40] leading-relaxed">{trip.cancellationPolicy}</p>
                    </div>
                  )}
                  {trip.gearList && trip.gearList.length > 0 && (
                    <div className="bg-[#f5f0e4] border border-[#e7dbbf] p-6">
                      <h3 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-4">Gear List</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {trip.gearList.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#3a4a40]">
                            <span className="text-[#133425] mt-0.5 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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
                <div className="border-t border-[#E7DBBF] pt-4 mb-6 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#3a4a40]/60 text-sm">Total price</span>
                    <span className="font-serif text-2xl text-[#133425]">
                      {currencySymbol}{trip.price.total?.toLocaleString()}
                    </span>
                  </div>
                  {trip.price.deposit && (
                    <div className="flex justify-between items-baseline bg-[#133425]/5 rounded px-3 py-2">
                      <span className="text-[#3a4a40] text-sm font-medium">Deposit to reserve</span>
                      <span className="font-serif text-lg text-[#133425] font-semibold">
                        {currencySymbol}{trip.price.deposit?.toLocaleString()}
                      </span>
                    </div>
                  )}
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
                Free to apply · Every application will be personally reviewed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
