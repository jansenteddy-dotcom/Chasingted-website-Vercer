import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link href={href} className="bg-white border border-gray-200 p-6 hover:border-[#1a1a1a] transition-colors">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#1a1a1a]">{value}</p>
    </Link>
  )
}

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const [
    { count: totalBookings },
    { count: unpaidBookings },
    { count: unreadMessages },
    { data: recentBookings },
  ] = await Promise.all([
    admin.from('bookings').select('*', { count: 'exact', head: true }).neq('status', 'cancelled'),
    admin.from('bookings').select('*', { count: 'exact', head: true }).eq('payment_status', 'unpaid').neq('status', 'cancelled'),
    admin.from('messages').select('*', { count: 'exact', head: true }).is('read_at', null).eq('is_from_admin', false),
    admin.from('bookings').select('id, trip_name, trip_start_date, payment_status, profiles(first_name, last_name)')
      .neq('status', 'cancelled').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="max-w-4xl">
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Active Bookings" value={totalBookings ?? 0} href="/admin/bookings" />
        <StatCard label="Payments Due" value={unpaidBookings ?? 0} href="/admin/bookings" />
        <StatCard label="Unread Messages" value={unreadMessages ?? 0} href="/admin/messages" />
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-500">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs font-bold uppercase tracking-widest text-[#133425] hover:underline">View All →</Link>
        </div>
        {!recentBookings?.length ? (
          <p className="text-sm text-gray-500">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentBookings.map((b: any) => (
              <Link key={b.id} href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 transition-colors">
                <div>
                  <p className="font-bold text-sm text-[#1a1a1a]">
                    {b.profiles?.first_name} {b.profiles?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{b.trip_name}</p>
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 ${
                  b.payment_status === 'fully_paid' ? 'bg-green-100 text-green-800' :
                  b.payment_status === 'deposit_paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {b.payment_status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/invite"
          className="bg-[#133425] text-[#F5F0E4] p-6 hover:bg-[#3a4a40] transition-colors">
          <p className="font-bold text-sm uppercase tracking-widest mb-1">+ Invite Traveler</p>
          <p className="text-xs opacity-60">Create a booking and send an invite email</p>
        </Link>
        <Link href="/admin/messages"
          className="bg-white border border-gray-200 p-6 hover:border-[#1a1a1a] transition-colors">
          <p className="font-bold text-sm uppercase tracking-widest text-[#1a1a1a] mb-1">Messages</p>
          <p className="text-xs text-gray-500">Reply to traveler questions</p>
        </Link>
      </div>
    </div>
  )
}
