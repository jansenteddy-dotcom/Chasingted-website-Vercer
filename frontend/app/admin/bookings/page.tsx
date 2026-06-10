import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const paymentBadge = (s: string) => {
  if (s === 'fully_paid') return 'bg-green-100 text-green-800'
  if (s === 'deposit_paid') return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BookingsPage() {
  const admin = createAdminClient()
  const { data: bookings } = await admin
    .from('bookings')
    .select('*, profiles(first_name, last_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a]">Bookings</h1>
        <Link href="/admin/invite"
          className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#3a4a40] transition-colors">
          + Invite Traveler
        </Link>
      </div>

      {!bookings?.length ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">No bookings yet.</p>
          <Link href="/admin/invite" className="text-xs font-bold uppercase tracking-widest text-[#133425] hover:underline mt-2 inline-block">
            Invite your first traveler →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {bookings.map((b: any) => (
            <Link key={b.id} href={`/admin/bookings/${b.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-2">
              <div>
                <p className="font-bold text-sm text-[#1a1a1a]">
                  {b.profiles?.first_name} {b.profiles?.last_name}
                  <span className="font-normal text-gray-500 ml-2 text-xs">{b.profiles?.email}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {b.trip_name} · {formatDate(b.trip_start_date)} → {formatDate(b.trip_end_date)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {b.status === 'cancelled' && (
                  <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-500">Cancelled</span>
                )}
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 ${paymentBadge(b.payment_status)}`}>
                  {b.payment_status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
