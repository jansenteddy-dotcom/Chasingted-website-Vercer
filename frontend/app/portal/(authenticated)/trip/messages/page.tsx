import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MessagesClient from '@/app/components/portal/MessagesClient'
import PortalPageBanner from '@/app/components/portal/PortalPageBanner'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const { data: messages } = booking
    ? await supabase.from('messages').select('*')
        .eq('user_id', user.id).eq('trip_slug', booking.trip_slug)
        .order('created_at', { ascending: true })
    : { data: [] }

  return (
    <div>
      <PortalPageBanner
        title="Messages"
        subtitle={booking?.trip_name ?? 'My Trip'}
        imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1600&q=80"
      />
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-[#3a4a40]/60 mb-6">Ask the ChasingTed team anything about your expedition.</p>
        {booking ? (
          <MessagesClient messages={messages ?? []} userId={user.id} tripSlug={booking.trip_slug} />
        ) : (
          <div className="bg-white border border-[#d4c5a0] p-10 text-center">
            <p className="text-sm text-[#3a4a40]">No active booking found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
