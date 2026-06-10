import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ReviewClient from '@/app/components/portal/ReviewClient'

export default async function ReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('id, trip_name, trip_end_date').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: false }).limit(1).maybeSingle()

  const { data: existing } = booking
    ? await supabase.from('reviews').select('*').eq('booking_id', booking.id).maybeSingle()
    : { data: null }

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Review & Certificate</h1>
      {booking ? (
        <ReviewClient booking={booking} existing={existing} userId={user.id} />
      ) : (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-sm text-[#3a4a40]">No completed expedition found.</p>
        </div>
      )}
    </div>
  )
}
