import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GearClient from '@/app/components/portal/GearClient'
import PortalPageBanner from '@/app/components/portal/PortalPageBanner'

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

  const grouped = (items ?? []).reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div>
      <PortalPageBanner
        title="Gear List"
        subtitle={booking?.trip_name ?? 'My Trip'}
        imageUrl="https://images.unsplash.com/photo-1554629947-334ff61d85dc?auto=format&fit=crop&w=1600&q=80"
      />
      <div className="max-w-2xl mx-auto">
        <GearClient grouped={grouped} packedIds={packedIds} userId={user.id} />
      </div>
    </div>
  )
}
