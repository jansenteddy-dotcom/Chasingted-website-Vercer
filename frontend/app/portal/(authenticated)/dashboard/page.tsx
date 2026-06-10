import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const quickLinks = [
  { href: '/portal/trip/documents', label: 'Documents', icon: '📄' },
  { href: '/portal/trip/team', label: 'Fellow Travelers', icon: '👥' },
  { href: '/portal/trip/checklist', label: 'Checklist', icon: '✓' },
  { href: '/portal/trip/gear', label: 'Gear List', icon: '🎒' },
  { href: '/portal/trip/updates', label: 'Updates', icon: '📢' },
  { href: '/portal/trip/messages', label: 'Messages', icon: '💬' },
  { href: '/portal/trip/gallery', label: 'Gallery', icon: '🖼' },
  { href: '/portal/profile', label: 'My Profile', icon: '👤' },
]

function paymentLabel(status: string) {
  if (status === 'fully_paid') return { label: 'Fully Paid', cls: 'bg-green-100 text-green-800' }
  if (status === 'deposit_paid') return { label: 'Deposit Paid', cls: 'bg-yellow-100 text-yellow-800' }
  return { label: 'Payment Due', cls: 'bg-red-100 text-red-800' }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const [{ data: profile }, { data: booking }] = await Promise.all([
    supabase.from('profiles').select('first_name').eq('id', user.id).single(),
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
      .order('trip_start_date', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const firstName = profile?.first_name || 'Traveler'
  const payment = booking ? paymentLabel(booking.payment_status) : null

  return (
    <div className="max-w-3xl">
      <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-1">Welcome back</p>
      <h1 className="font-bold text-3xl uppercase tracking-widest text-[#133425] mb-8">{firstName}</h1>

      {booking ? (
        <>
          <div className="bg-white border border-[#d4c5a0] p-6 mb-6">
            <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-2">Your Next Expedition</p>
            <h2 className="font-bold text-xl uppercase tracking-wide text-[#133425]">{booking.trip_name}</h2>
            <p className="text-sm text-[#3a4a40] mt-1">
              {formatDate(booking.trip_start_date)} — {formatDate(booking.trip_end_date)}
            </p>
            <span className={`inline-block mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 ${payment!.cls}`}>
              {payment!.label}
            </span>
            {booking.payment_status !== 'fully_paid' && booking.total_amount && (
              <p className="text-xs text-[#3a4a40]/70 mt-2">
                Total: €{booking.total_amount.toFixed(2)}
                {booking.deposit_amount ? ` · Deposit: €${booking.deposit_amount.toFixed(2)}` : ''}
                {booking.balance_due_date ? ` · Balance due ${formatDate(booking.balance_due_date)}` : ''}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="bg-white border border-[#d4c5a0] px-4 py-4 text-center hover:bg-[#133425] hover:text-[#F5F0E4] hover:border-[#133425] transition-colors group"
              >
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#133425] group-hover:text-[#F5F0E4]">
                  {label}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white border border-[#d4c5a0] p-10 text-center">
          <p className="text-[#3a4a40] text-sm">No upcoming expedition found.</p>
          <p className="text-[#3a4a40]/60 text-xs mt-2">
            Contact Teddy at{' '}
            <a href="mailto:info@chasingted.com" className="underline hover:text-[#133425]">
              info@chasingted.com
            </a>{' '}
            if you believe this is an error.
          </p>
        </div>
      )}
    </div>
  )
}
