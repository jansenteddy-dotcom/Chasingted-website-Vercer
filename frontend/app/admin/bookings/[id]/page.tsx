import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BookingEditor from '@/app/components/admin/BookingEditor'

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 w-44 shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a1a]">{value}</span>
    </div>
  )
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: booking } = await admin
    .from('bookings')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const profile = (booking as any).profiles

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/bookings" className="text-xs text-gray-400 hover:text-[#1a1a1a]">← Bookings</Link>
      </div>
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-1">
        {profile?.first_name} {profile?.last_name}
      </h1>
      <p className="text-sm text-gray-500 mb-8">{booking.trip_name} · {formatDate(booking.trip_start_date)} → {formatDate(booking.trip_end_date)}</p>

      {/* Payment editor */}
      <BookingEditor booking={booking} />

      {/* Trip management links */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Manage Trip Content</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: `/admin/trips/${booking.trip_slug}/documents`, label: 'Documents' },
            { href: `/admin/trips/${booking.trip_slug}/updates`, label: 'Updates' },
            { href: `/admin/trips/${booking.trip_slug}/checklist`, label: 'Checklist' },
            { href: `/admin/trips/${booking.trip_slug}/gear`, label: 'Gear List' },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="border border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-gray-50 transition-colors text-center">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Traveler profile */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Traveler Profile</h2>
        <Row label="Email" value={profile?.email} />
        <Row label="Date of Birth" value={profile?.date_of_birth ? formatDate(profile.date_of_birth) : null} />
        <Row label="Nationality" value={profile?.nationality} />
        <Row label="Passport Number" value={profile?.passport_number} />
        <Row label="Passport Expiry" value={profile?.passport_expiry ? formatDate(profile.passport_expiry) : null} />
        <Row label="Phone" value={profile?.phone} />
        <Row label="Fitness Level" value={profile?.fitness_level} />
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Emergency Contact</h2>
        <Row label="Name" value={profile?.emergency_contact_name} />
        <Row label="Phone" value={profile?.emergency_contact_phone} />
        <Row label="Relation" value={profile?.emergency_contact_relation} />
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Health & Dietary</h2>
        <Row label="Dietary" value={profile?.dietary_requirements} />
        <Row label="Medical Notes" value={profile?.medical_notes} />
      </div>
    </div>
  )
}
