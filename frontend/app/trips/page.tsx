import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {allTripsQuery} from '@/sanity/lib/queries'
import TripCard from '@/app/components/TripCard'

export const metadata: Metadata = {
  title: 'All Trips',
  description: 'Browse all upcoming Chasingted expeditions and apply for your adventure.',
}

export default async function TripsPage() {
  const {data: trips} = await sanityFetch({query: allTripsQuery})

  return (
    <div className="pt-24 pb-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#133425] mb-4">All Expeditions</h1>
          <p className="text-[#3a4a40]/70 text-lg max-w-xl mx-auto">
            Each trip is a small group, carefully planned, and personally guided. Apply to secure your spot.
          </p>
        </div>

        {trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#3a4a40]/60">
            <p className="text-xl font-serif mb-2">No upcoming trips yet.</p>
            <p className="text-sm">Check back soon — new expeditions are added regularly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
