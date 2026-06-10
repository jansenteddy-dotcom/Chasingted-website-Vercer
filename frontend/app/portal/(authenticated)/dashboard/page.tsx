import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function daysUntil(dateStr: string): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return 'Today!'
  return `${diff}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function paymentLabel(status: string) {
  if (status === 'fully_paid') return { label: 'Fully Paid', cls: 'bg-green-100 text-green-800' }
  if (status === 'deposit_paid') return { label: 'Deposit Paid', cls: 'bg-amber-100 text-amber-800' }
  return { label: 'Payment Due', cls: 'bg-red-100 text-red-800' }
}

const quickLinks = [
  {
    href: '/portal/trip/documents', label: 'Documents', desc: 'Vouchers & files',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    href: '/portal/trip/team', label: 'Fellow Travelers', desc: 'Your expedition team',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  },
  {
    href: '/portal/trip/checklist', label: 'Checklist', desc: 'Pre-trip tasks',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>,
  },
  {
    href: '/portal/trip/gear', label: 'Gear List', desc: 'What to pack',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-8-4a2 2 0 012 2v2H10V5a2 2 0 012-2z" /></svg>,
  },
  {
    href: '/portal/trip/updates', label: 'Updates', desc: 'News from ChasingTed',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  },
  {
    href: '/portal/trip/messages', label: 'Messages', desc: 'Ask us anything',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
  {
    href: '/portal/trip/gallery', label: 'Gallery', desc: 'Trip photos',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    href: '/portal/profile', label: 'My Profile', desc: 'Passport & details',
    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const [{ data: profile }, { data: booking }] = await Promise.all([
    supabase.from('profiles').select('first_name').eq('id', user.id).single(),
    supabase.from('bookings').select('*').eq('user_id', user.id)
      .neq('status', 'cancelled').order('trip_start_date', { ascending: true }).limit(1).maybeSingle(),
  ])

  const firstName = profile?.first_name || 'Traveler'
  const payment = booking ? paymentLabel(booking.payment_status) : null
  const countdown = booking ? daysUntil(booking.trip_start_date) : null

  return (
    <div>
      {/* Hero — breaks out of the container's 2rem padding */}
      <div className="-mx-8 -mt-10 relative overflow-hidden" style={{ height: '380px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#133425]/70 via-[#133425]/55 to-[#f5f0e4]" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 pb-16">
          <p className="text-[#F5F0E4]/60 text-xs tracking-[0.3em] uppercase mb-3">Welcome back</p>
          <h1 className="font-bold text-5xl sm:text-6xl uppercase tracking-widest text-[#F5F0E4] mb-4 drop-shadow-lg">
            {firstName}
          </h1>
          {booking ? (
            <p className="text-[#F5F0E4]/85 text-sm tracking-[0.25em] uppercase font-medium">
              {booking.trip_name}
            </p>
          ) : (
            <p className="text-[#F5F0E4]/75 text-sm tracking-[0.25em] uppercase">
              Your next adventure awaits
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl pt-4 mx-auto">
        {booking ? (
          <>
            {/* Trip card */}
            <div className="bg-white border border-[#d4c5a0] p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs tracking-widest uppercase text-[#3a4a40]/50 mb-1">Your Next Expedition</p>
                <h2 className="font-bold text-xl uppercase tracking-wide text-[#133425] mb-2">{booking.trip_name}</h2>
                <p className="text-sm text-[#3a4a40]">
                  {formatDate(booking.trip_start_date)} — {formatDate(booking.trip_end_date)}
                </p>
                {booking.payment_status !== 'fully_paid' && booking.total_amount && (
                  <p className="text-xs text-[#3a4a40]/60 mt-1">
                    Total €{booking.total_amount.toFixed(2)}
                    {booking.deposit_amount ? ` · Deposit €${booking.deposit_amount.toFixed(2)}` : ''}
                    {booking.balance_due_date ? ` · Balance due ${formatDate(booking.balance_due_date)}` : ''}
                  </p>
                )}
                <span className={`inline-block mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 ${payment!.cls}`}>
                  {payment!.label}
                </span>
              </div>

              {/* Countdown */}
              {countdown && countdown !== 'Today!' && (
                <div className="shrink-0 text-center bg-[#133425] text-[#F5F0E4] px-8 py-5">
                  <p className="text-4xl font-bold leading-none">{countdown}</p>
                  <p className="text-xs tracking-widest uppercase opacity-60 mt-1">Days to go</p>
                </div>
              )}
              {countdown === 'Today!' && (
                <div className="shrink-0 text-center bg-[#f7b500] text-[#133425] px-8 py-5">
                  <p className="text-2xl font-bold leading-none tracking-widest uppercase">Today!</p>
                  <p className="text-xs tracking-widest uppercase opacity-60 mt-1">Departure</p>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(({ href, label, desc, icon }) => (
                <Link key={href} href={href}
                  className="bg-white border border-[#d4c5a0] px-4 py-5 text-center hover:bg-[#133425] hover:border-[#133425] transition-all duration-200 group flex flex-col items-center gap-2">
                  <div className="text-[#133425] group-hover:text-[#F5F0E4] transition-colors">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#133425] group-hover:text-[#F5F0E4] transition-colors leading-tight">
                      {label}
                    </p>
                    <p className="text-xs text-[#3a4a40]/50 group-hover:text-[#F5F0E4]/50 transition-colors mt-0.5 hidden sm:block">
                      {desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-[#d4c5a0] p-10 text-center">
            <div className="w-16 h-px bg-[#d4c5a0] mx-auto mb-6" />
            <p className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-2">No Expedition Yet</p>
            <p className="text-sm text-[#3a4a40]/70 mb-6">
              Your trip will appear here once ChasingTed confirms your booking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/trips"
                className="inline-block bg-[#f7b500] text-[#133425] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#d9a441] transition-colors">
                Browse Expeditions
              </Link>
              <a href="mailto:info@chasingted.com"
                className="inline-block border border-[#133425] text-[#133425] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#133425] hover:text-[#F5F0E4] transition-colors">
                Contact ChasingTed
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
