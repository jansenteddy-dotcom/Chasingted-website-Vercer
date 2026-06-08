import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery, allTripsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import TripCard from '@/app/components/TripCard'

export default async function HomePage() {
  const [{data: settings}, {data: trips}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: allTripsQuery}),
  ])

  const featuredTrips = settings?.featuredTrips?.length ? settings.featuredTrips : trips?.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {settings?.heroImage?.asset && (
          <Image
            src={urlFor(settings.heroImage).width(1600).height(900).url()}
            alt={(settings.heroImage as any).alt || 'Chasingted adventure'}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-[#133425]/60" />
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl text-[#F5F0E4] leading-tight mb-6">
            {settings?.heroHeading || 'Adventure awaits.'}
          </h1>
          {settings?.heroSubheading && (
            <p className="text-[#F5F0E4]/90 text-xl md:text-2xl mb-10 font-light">
              {settings.heroSubheading}
            </p>
          )}
          <Link
            href="/trips"
            className="inline-block bg-[#f7b500] text-[#133425] font-semibold px-8 py-4 rounded text-lg hover:bg-[#d9a441] transition-colors duration-200"
          >
            See all expeditions
          </Link>
        </div>
      </section>

      {/* Intro */}
      {settings?.introText && (
        <section className="bg-[#F5F0E4] py-20">
          <div className="container max-w-2xl text-center mx-auto">
            <p className="text-[#3a4a40] text-lg md:text-xl leading-relaxed">
              {settings.introText}
            </p>
          </div>
        </section>
      )}

      {/* Featured trips */}
      {featuredTrips && featuredTrips.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="font-serif text-3xl md:text-4xl text-[#133425] text-center mb-4">
              Upcoming expeditions
            </h2>
            <p className="text-center text-[#3a4a40]/70 mb-12">
              Small groups. Real adventures. Apply to secure your spot.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip as any} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/trips"
                className="inline-block border-2 border-[#133425] text-[#133425] font-semibold px-8 py-3 rounded hover:bg-[#133425] hover:text-[#F5F0E4] transition-colors duration-200"
              >
                View all trips
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-[#F5F0E4] py-20">
        <div className="container">
          <h2 className="font-serif text-3xl md:text-4xl text-[#133425] text-center mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {step: '01', title: 'Apply', desc: 'Fill in your application for the trip you want.'},
              {step: '02', title: 'Get approved', desc: 'Teddy reviews and confirms your spot within 3–5 days.'},
              {step: '03', title: 'Pay deposit', desc: 'Secure your place with a bank transfer deposit.'},
              {step: '04', title: 'Go on an adventure', desc: 'Access the traveler portal and get ready to explore.'},
            ].map(({step, title, desc}) => (
              <div key={step}>
                <div className="text-[#f7b500] font-serif text-4xl mb-3">{step}</div>
                <h3 className="font-serif text-lg text-[#133425] mb-2">{title}</h3>
                <p className="text-[#3a4a40]/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
