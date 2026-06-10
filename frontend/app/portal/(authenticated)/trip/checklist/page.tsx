import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChecklistClient from '@/app/components/portal/ChecklistClient'
import PortalPageBanner from '@/app/components/portal/PortalPageBanner'

export default async function ChecklistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name, trip_start_date').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const [{ data: items }, { data: completions }] = await Promise.all([
    booking
      ? supabase.from('checklist_items').select('*').eq('trip_slug', booking.trip_slug).order('sort_order')
      : { data: [] },
    supabase.from('checklist_completions').select('checklist_item_id').eq('user_id', user.id),
  ])

  const completedIds = new Set((completions ?? []).map(c => c.checklist_item_id))

  return (
    <div>
      <PortalPageBanner
        title="Pre-Trip Checklist"
        subtitle={booking?.trip_name ?? 'My Trip'}
        imageUrl="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80"
      />
      <div className="max-w-2xl mx-auto">
        <ChecklistClient items={items ?? []} completedIds={completedIds} userId={user.id} />
      </div>
    </div>
  )
}
