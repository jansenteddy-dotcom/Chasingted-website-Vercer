import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function UpdatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const { data: updates } = booking
    ? await supabase.from('trip_updates').select('*').eq('trip_slug', booking.trip_slug).order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Updates</h1>

      {!updates || updates.length === 0 ? (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-sm text-[#3a4a40]">No updates yet.</p>
          <p className="text-xs text-[#3a4a40]/60 mt-1">ChasingTed will post news and reminders here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map(u => (
            <div key={u.id} className="bg-white border border-[#d4c5a0] p-6">
              <p className="text-xs text-[#3a4a40]/50 mb-2">
                {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <h2 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-3">{u.title}</h2>
              <p className="text-sm text-[#3a4a40] leading-relaxed whitespace-pre-line">{u.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
