import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const { data: photos } = booking
    ? await supabase.from('trip_photos').select('*').eq('trip_slug', booking.trip_slug)
        .eq('approved', true).order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-3xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Gallery</h1>

      {!photos || photos.length === 0 ? (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-sm text-[#3a4a40]">No photos yet.</p>
          <p className="text-xs text-[#3a4a40]/60 mt-1">Photos will appear here after the expedition.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map(photo => (
            <a key={photo.id} href={photo.photo_url} target="_blank" rel="noopener noreferrer"
              className="relative aspect-square bg-[#d4c5a0] overflow-hidden group">
              <Image src={photo.photo_url} alt={photo.caption ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#133425]/80 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-xs text-[#F5F0E4]">{photo.caption}</p>
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
