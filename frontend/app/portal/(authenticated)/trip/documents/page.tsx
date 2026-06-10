import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function formatBytes(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: booking } = await supabase
    .from('bookings').select('trip_slug, trip_name').eq('user_id', user.id)
    .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle()

  const { data: documents } = booking
    ? await supabase.from('trip_documents').select('*').eq('trip_slug', booking.trip_slug).order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">{booking?.trip_name ?? 'My Trip'}</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">Documents</h1>

      {!documents || documents.length === 0 ? (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-sm text-[#3a4a40]">No documents uploaded yet.</p>
          <p className="text-xs text-[#3a4a40]/60 mt-1">ChasingTed will add documents here as your expedition approaches.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white border border-[#d4c5a0] px-5 py-4 hover:border-[#133425] transition-colors group">
              <div className="text-2xl shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#133425] uppercase tracking-wide group-hover:underline">{doc.title}</p>
                {doc.description && <p className="text-xs text-[#3a4a40]/70 mt-0.5">{doc.description}</p>}
                {doc.file_size && <p className="text-xs text-[#3a4a40]/50 mt-0.5">{formatBytes(doc.file_size)}</p>}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#133425] shrink-0">Download →</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
