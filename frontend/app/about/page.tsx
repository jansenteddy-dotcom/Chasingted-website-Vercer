import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {pageContentQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'

export const metadata: Metadata = {
  title: 'About Chasingted',
  description: 'Chasingted is run by Teddy Jansen — adventure guide and expedition leader based in Amsterdam. Small groups, real wilderness, no tourist shortcuts.',
}

const pillars = [
  {
    label: 'Nature',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: 'Connection',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    label: 'Challenge',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M3 20 L8 10 L13 15 L17 7 L21 20 Z"/>
      </svg>
    ),
  },
  {
    label: 'Simplicity',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    label: 'Story',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
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

const standFor = [
  {
    label: 'Curated Expeditions',
    text: 'Every route is hand-picked and crafted with intention — built for people who want more than just another trip.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9"/>
        <path d="M16 12l-4-4-4 4M12 8v8"/>
      </svg>
    ),
  },
  {
    label: 'Real Connection',
    text: 'Small groups, shared fires, real conversations. Authentic moments far from the crowded tourist spots.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    label: 'Growth Through Challenge',
    text: 'Long days, wild weather, new limits. Nature challenges you gently and reminds you what you are capable of.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="#133425" strokeWidth="1.2" viewBox="0 0 24 24">
        <path d="M3 20 L8 10 L13 15 L17 7 L21 20 Z"/>
      </svg>
    ),
  },
]

export default async function AboutPage() {
  const {data: page} = await sanityFetch({
    query: pageContentQuery,
    params: {identifier: 'about'},
  })

  const heroImageUrl = (page as any)?.heroImage?.asset
    ? urlFor((page as any).heroImage).width(2400).quality(85).url()
    : null

  const founderImageUrl = (page as any)?.founderImage?.asset
    ? urlFor((page as any).founderImage).width(1200).quality(85).url()
    : null

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center overflow-hidden">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={(page as any).heroImage?.alt || 'Chasingted — Our Story'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#133425]" />
        )}
        <div className="absolute inset-0 bg-[#133425]/60" />
        <div className="relative z-10 px-6">
          <h1 className="font-bold text-5xl md:text-7xl text-[#F5F0E4] uppercase tracking-widest mb-4">
            Our Story
          </h1>
          <p className="text-[#F5F0E4]/80 text-xs md:text-sm tracking-widest uppercase">
            Authentic expeditions. Small groups. Big adventures.
          </p>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="bg-[#133425] py-20">
        <div className="container max-w-3xl text-center">
          <h2 className="font-bold text-2xl md:text-4xl text-[#F5F0E4] uppercase tracking-widest mb-10">
            Adventure, without the excess.
          </h2>
          <p className="text-[#F5F0E4]/80 text-base leading-relaxed mb-6">
            In a world that keeps pulling us away from nature and from ourselves, Chasingted is an invitation to return to something real. To slow down. To feel the rhythm of water, forest and fire again — and to move through wild landscapes the way humans have for centuries: simply, quietly, and together.
          </p>
          <p className="text-[#F5F0E4]/80 text-base leading-relaxed">
            We are a curated adventure platform offering small-group expeditions to wild, beautiful places. Every journey is hand-picked and crafted with intention, built for travellers who value authenticity, connection and challenge. Not a package holiday. An expedition.
          </p>
        </div>
      </section>

      {/* ── WHAT WE STAND FOR ── */}
      <section className="bg-[#f5f0e4] py-20">
        <div className="container text-center">
          <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest mb-4">
            What We Stand For
          </h2>
          <p className="text-[#3a4a40] text-xs tracking-widest uppercase mb-14">
            Five words shape everything we do: Nature, Connection, Challenge, Simplicity, Story.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {standFor.map(({label, text, icon}) => (
              <div key={label} className="bg-[#e7dbbf] p-8 text-left">
                <div className="mb-6">{icon}</div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-4">{label}</h3>
                <p className="text-[#3a4a40] text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FOUNDER ── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-80 md:h-auto min-h-[480px] bg-[#3a4a40]">
          {founderImageUrl ? (
            <Image
              src={founderImageUrl}
              alt={(page as any).founderImage?.alt || 'Teddy Jansen — founder of Chasingted'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#3a4a40] flex items-center justify-center">
              <p className="text-[#F5F0E4]/40 text-xs tracking-widest uppercase">Upload founder photo in Sanity</p>
            </div>
          )}
        </div>
        <div className="bg-[#f5f0e4] flex items-center px-10 md:px-16 py-16">
          <div>
            <p className="text-[#133425] text-xs tracking-widest uppercase mb-3">The Founder</p>
            <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-wide mb-2">
              Teddy Jansen
            </h2>
            <p className="text-[#3a4a40] text-xs tracking-widest uppercase mb-8">Amsterdam</p>
            <p className="text-[#3a4a40] text-sm leading-relaxed mb-5">
              Chasingted started with Teddy Jansen — an Amsterdammer who is always organising something, and always finding his way in and out of trouble. He has a habit of spotting the edge in every opportunity and turning it into something memorable.
            </p>
            <p className="text-[#3a4a40] text-sm leading-relaxed">
              Chasingted is where all of that comes together: his skills, his restlessness, and his belief that the best way to truly know the world — and yourself — is to go somewhere real, with a small group, and do something hard. To experience the world in a different, more profound way.
            </p>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="bg-[#133425] py-20 text-center">
        <div className="container">
          <h2 className="font-bold text-2xl md:text-4xl text-[#F5F0E4] uppercase tracking-widest mb-14">
            Find out what you&apos;re made of.
          </h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {pillars.map(({label, icon}) => (
              <div key={label} className="flex flex-col items-center gap-3 text-[#F5F0E4]/80">
                {icon}
                <span className="text-xs tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#3a4a40] py-20 text-center">
        <div className="container">
          <h2 className="font-bold text-2xl md:text-4xl text-[#F5F0E4] uppercase tracking-widest mb-8">
            Will you join us?
          </h2>
          <Link
            href="/trips"
            className="inline-block bg-[#4e6358] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#133425] transition-colors duration-200"
          >
            See Our Expeditions
          </Link>
        </div>
      </section>
    </>
  )
}
