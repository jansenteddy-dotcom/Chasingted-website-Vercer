import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {tripBySlugQuery} from '@/sanity/lib/queries'
import ApplyForm from '@/app/components/ApplyForm'

type Props = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}, stega: false})
  if (!trip) return {title: 'Trip not found'}
  return {title: `Apply — ${trip.title}`}
}

export default async function ApplyPage({params}: Props) {
  const {slug} = await params
  const {data: trip} = await sanityFetch({query: tripBySlugQuery, params: {slug}})

  if (!trip || trip.status !== 'open') notFound()

  return (
    <div className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <div className="mb-10">
          <p className="text-[#f7b500] text-sm font-semibold uppercase tracking-widest mb-2">
            {trip.destination}
          </p>
          <h1 className="font-serif text-4xl text-[#133425] mb-3">Apply for {trip.title}</h1>
          <p className="text-[#3a4a40]/70">
            Tell us a bit about yourself. ChasingTed reviews every application personally and will reply within 3–5 days.
          </p>
        </div>
        <ApplyForm tripId={trip._id} tripSlug={slug} tripTitle={trip.title} />
      </div>
    </div>
  )
}
