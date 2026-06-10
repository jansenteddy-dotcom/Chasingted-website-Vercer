import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  // Use admin client to fetch fellow travelers (only safe fields — no passport/medical info)
  const admin = createAdminClient()
  const travelers = booking ? await (async () => {
    const { data: otherBookings } = await admin
      .from('bookings').select('user_id').eq('trip_slug', booking.trip_slug)
      .eq('status', 'confirmed').neq('user_id', user.id)
    if (!otherBookings?.length) return []
    const ids = otherBookings.map(b => b.user_id)
    const { data: profiles } = await admin
      .from('profiles').select('id, first_name, nationality, bio, fitness_level').in('id', ids)
    return profiles ?? []
  })() : []

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-2">Fellow Travelers</h1>
      <p className="text-sm text-[#3a4a40]/70 mb-8">The people joining you on this expedition.</p>

      {travelers.length === 0 ? (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-sm text-[#3a4a40]">No other confirmed travelers yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {travelers.map(t => (
            <div key={t.id} className="bg-white border border-[#d4c5a0] p-5">
              <div className="w-10 h-10 rounded-full bg-[#133425] flex items-center justify-center text-[#F5F0E4] font-bold text-sm mb-3">
                {t.first_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <p className="font-bold text-sm uppercase tracking-widest text-[#133425]">{t.first_name}</p>
              {t.nationality && <p className="text-xs text-[#3a4a40]/60 mt-0.5">{t.nationality}</p>}
              {t.fitness_level && (
                <span className="inline-block mt-2 text-xs bg-[#f5f0e4] text-[#3a4a40] px-2 py-0.5 capitalize">{t.fitness_level}</span>
              )}
              {t.bio && <p className="text-xs text-[#3a4a40] mt-3 leading-relaxed">{t.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
