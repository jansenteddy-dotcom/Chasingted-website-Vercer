import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import AdminGearManagerClient from '@/app/components/admin/AdminGearManagerClient'

export default async function AdminGearPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: items } = await admin
    .from('gear_items')
    .select('*')
    .eq('trip_slug', slug)
    .order('sort_order', { ascending: true })

  return (
    <div className="max-w-2xl">
      <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-[#1a1a1a] mb-6 inline-block">← Bookings</Link>
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-1">Gear List</h1>
      <p className="text-sm text-gray-500 mb-8">Trip: <span className="font-bold">{slug}</span></p>
      <AdminGearManagerClient slug={slug} items={items ?? []} />
    </div>
  )
}
