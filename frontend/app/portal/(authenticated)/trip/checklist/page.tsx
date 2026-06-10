import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChecklistClient from '@/app/components/portal/ChecklistClient'

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
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Pre-Trip Checklist</h1>
      <ChecklistClient items={items ?? []} completedIds={completedIds} userId={user.id} />
    </div>
  )
}
