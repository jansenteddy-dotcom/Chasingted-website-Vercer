import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import AdminDocumentsClient from '@/app/components/admin/AdminDocumentsClient'

export default async function AdminDocumentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: documents } = await admin
    .from('documents')
    .select('*')
    .eq('trip_slug', slug)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-[#1a1a1a]">← Bookings</Link>
      </div>
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-1">Documents</h1>
      <p className="text-sm text-gray-500 mb-8">Trip: <span className="font-bold">{slug}</span></p>
      <AdminDocumentsClient slug={slug} documents={documents ?? []} />
    </div>
  )
}
