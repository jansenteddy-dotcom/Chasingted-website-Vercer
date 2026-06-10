import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GearClient from '@/app/components/portal/GearClient'

export default async function GearPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const [{ data: items }, { data: packed }] = await Promise.all([
    booking
      ? supabase.from('gear_items').select('*').eq('trip_slug', booking.trip_slug).order('sort_order')
      : { data: [] },
    supabase.from('gear_packed').select('gear_item_id').eq('user_id', user.id),
  ])

  const packedIds = new Set((packed ?? []).map(p => p.gear_item_id))

  // Group items by category
  const grouped = (items ?? []).reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Gear List</h1>
      <GearClient grouped={grouped} packedIds={packedIds} userId={user.id} />
    </div>
  )
}
