import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import AdminUpdatesClient from '@/app/components/admin/AdminUpdatesClient'

export default async function AdminUpdatesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: updates } = await admin
    .from('trip_updates')
    .select('*')
    .eq('trip_slug', slug)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl">
      <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-[#1a1a1a] mb-6 inline-block">← Bookings</Link>
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-1">Trip Updates</h1>
      <p className="text-sm text-gray-500 mb-8">Trip: <span className="font-bold">{slug}</span></p>
      <AdminUpdatesClient slug={slug} updates={updates ?? []} />
    </div>
  )
}
