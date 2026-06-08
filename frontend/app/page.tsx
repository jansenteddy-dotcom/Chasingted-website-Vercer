import Link from 'next/link'
import Image from 'next/image'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery, allTripsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import TripCard from '@/app/components/TripCard'

const pillars = [
  {
    label: 'Nature',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#F5F0E4" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Connection',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#F5F0E4" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    label: 'Challenge',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#F5F0E4" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M3 20 L8 10 L13 15 L17 7 L21 20 Z"/>
      </svg>
    ),
  },
  {
    label: 'Simplicity',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#F5F0E4" strokeWidth="1.2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    label: 'Story',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="#F5F0E4" strokeWidth="1.2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="2"/>
        <line x1="12" y1="3" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="21" y2="12"/>
      </svg>
    ),
  },
]

const reviews = [
  {
    quote: 'Ten days that rearranged what I thought I could handle. I came home different.',
    name: 'Sofia M.',
    trip: 'Patagonia Traverse',
  },
  {
    quote: 'No fluff, no tourist traps. Just real places and a guide who knew every ridge by name.',
    name: 'Daniel K.',
    trip: 'Iceland Highlands',
  },
  {
    quote: 'The small group made it. By day three these strangers were the people I trusted most.',
    name: 'Aisha R.',
    trip: 'Atlas Mountains Crossing',
  },
]

export default async function HomePage() {
  const [{data: settings}, {data: trips}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: allTripsQuery}),
  ])

  const featuredTrips = settings?.featuredTrips?.length ? settings.featuredTrips : trips?.slice(0, 3)
  const whyImageUrl = settings?.heroImage?.asset
    ? urlFor(settings.heroImage).width(800).height(600).url()
    : null

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-screen flex items-end justify-center text-center overflow-hidden">
        {settings?.heroImage?.asset ? (
          <Image
            src={urlFor(settings.heroImage).width(1600).height(900).url()}
            alt="Chasingted adventure"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#133425]" />
        )}
        <div className="absolute inset-0 bg-[#133425]/55" />
        <div className="relative z-10 px-6 pb-20 w-full max-w-4xl">
          <h1 className="font-bold text-4xl md:text-7xl text-[#F5F0E4] leading-none uppercase tracking-wide mb-6">
            {settings?.heroHeading || 'From Somewhere to Somewhere.'}
          </h1>
          <p className="text-[#F5F0E4]/80 text-sm md:text-base tracking-widest uppercase mb-10">
            {settings?.heroSubheading || 'Curated expeditions for those who want more than just another trip.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="inline-block bg-[#4e6358] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#3a4a40] transition-colors duration-200"
            >
              See Our Trips
            </Link>
            <Link
              href="/about"
              className="inline-block border border-[#F5F0E4] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#F5F0E4]/10 transition-colors duration-200"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="bg-[#133425] py-16 md:py-20">
        <div className="container text-center">
          <h2 className="text-[#F5F0E4] font-bold text-2xl md:text-4xl uppercase tracking-widest mb-12">
            Not a Holiday. An Expedition.
          </h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {pillars.map(({label, icon}) => (
              <div key={label} className="flex flex-col items-center gap-3">
                {icon}
                <span className="text-[#F5F0E4]/70 text-xs tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EXPEDITIONS ── */}
      <section className="bg-[#f5f0e4] py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest mb-4">
              Upcoming Expeditions
            </h2>
            <p className="text-[#3a4a40]/70 text-xs tracking-widest uppercase">
              Small, intimate groups. Real wilderness. A handful of departures each season.
            </p>
          </div>

          {featuredTrips && featuredTrips.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTrips.map((trip) => (
                  <TripCard key={trip._id} trip={trip as any} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link
                  href="/trips"
                  className="text-[#133425] text-xs font-bold tracking-widest uppercase hover:text-[#3a4a40] transition-colors"
                >
                  See All Expeditions →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#3a4a40]/60 text-sm tracking-wide mb-6">New expeditions coming soon.</p>
              <Link href="/contact" className="text-[#133425] text-xs font-bold tracking-widest uppercase hover:underline">
                Join the waitlist →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHASINGTED ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — photo */}
        <div className="relative h-80 md:h-auto min-h-[400px] bg-[#3a4a40]">
          {whyImageUrl && (
            <Image src={whyImageUrl} alt="Why Chasingted" fill className="object-cover" />
          )}
        </div>
        {/* Right — content */}
        <div className="bg-[#f5f0e4] flex items-center px-10 md:px-16 py-16">
          <div>
            <p className="text-[#3a4a40] text-xs tracking-widest uppercase mb-4">Why Chasingted</p>
            <h2 className="font-bold text-2xl md:text-3xl text-[#133425] uppercase tracking-wide leading-tight mb-8">
              Small Groups.<br />Real Wilderness.<br />No Shortcuts.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                {icon: '👥', text: 'Max 10 travelers per expedition'},
                {icon: '🧭', text: 'Expert local guides'},
                {icon: '🗺️', text: 'Off-the-beaten-path destinations'},
                {icon: '✓', text: 'All logistics handled — you just show up'},
              ].map(({icon, text}) => (
                <li key={text} className="flex items-center gap-4 text-[#3a4a40] text-sm">
                  <span className="text-[#133425] w-5 text-center shrink-0">{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-block bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-8 py-4 hover:bg-[#3a4a40] transition-colors duration-200"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEFORE YOU GO ── */}
      <section className="bg-[#f5f0e4] py-20">
        <div className="container">
          <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest text-center mb-16">
            Before You Go
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 mx-auto mb-6" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M8 12l3 3 5-5"/>
                  </svg>
                ),
                title: "What's Included",
                desc: 'Accommodation, all meals, expert guides and ground transport — from the first handshake to the final summit.',
              },
              {
                icon: (
                  <svg className="w-10 h-10 mx-auto mb-6" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="1"/>
                    <line x1="9" y1="7" x2="15" y2="7"/>
                    <line x1="9" y1="11" x2="15" y2="11"/>
                    <line x1="9" y1="15" x2="12" y2="15"/>
                  </svg>
                ),
                title: 'How to Apply',
                desc: 'Tell us about yourself, choose your expedition and apply. We review every application and reach out personally.',
              },
              {
                icon: (
                  <svg className="w-10 h-10 mx-auto mb-6" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path d="M3 20 L8 10 L13 15 L17 7 L21 20 Z"/>
                  </svg>
                ),
                title: 'What to Expect',
                desc: 'A real fitness challenge, small groups of like-minded people, and the gear list to get you ready.',
              },
            ].map(({icon, title, desc}) => (
              <div key={title}>
                {icon}
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-4">{title}</h3>
                <p className="text-[#3a4a40]/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/faq" className="text-[#133425] text-xs font-bold tracking-widest uppercase hover:text-[#3a4a40] transition-colors">
              View Full FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-[#d4c5a0] py-20">
        <div className="container">
          <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest text-center mb-14">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(({quote, name, trip}) => (
              <div key={name} className="bg-[#f5f0e4] p-8">
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-[#d9a441]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[#3a4a40] text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                <p className="font-bold text-xs uppercase tracking-widest text-[#133425]">{name}</p>
                <p className="text-[#d9a441] text-xs uppercase tracking-widest mt-1">{trip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOLLOW THE JOURNEY ── */}
      <section className="bg-white py-20">
        <div className="container text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest mb-3">
            Follow the Journey
          </h2>
          <a
            href="https://instagram.com/chasingted.adventures"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4e6358] text-xs font-bold tracking-widest uppercase hover:underline"
          >
            @chasingted.adventures
          </a>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-10 mb-10">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-square bg-[#3a4a40]/20" />
            ))}
          </div>
          <a
            href="https://instagram.com/chasingted.adventures"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#3a4a40] transition-colors duration-200"
          >
            Follow on Instagram
          </a>
        </div>
      </section>
    </>
  )
}
