import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const {
    email, firstName, lastName,
    tripName, tripSlug, startDate, endDate,
    totalAmount, depositAmount,
  } = await req.json()

  const admin = createAdminClient()

  // Send Supabase invite email — traveler clicks link to set password
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { first_name: firstName, last_name: lastName },
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/portal/dashboard`,
  })

  if (inviteError) return NextResponse.json({ error: inviteError.message }, { status: 500 })

  const userId = inviteData.user.id

  // Upsert profile with name
  await admin.from('profiles').upsert({
    id: userId,
    email,
    first_name: firstName,
    last_name: lastName,
  }, { onConflict: 'id' })

  // Create booking
  const { error: bookingError } = await admin.from('bookings').insert({
    user_id: userId,
    trip_name: tripName,
    trip_slug: tripSlug,
    trip_start_date: startDate,
    trip_end_date: endDate,
    status: 'confirmed',
    payment_status: 'unpaid',
    total_amount: totalAmount,
    deposit_amount: depositAmount,
  })

  if (bookingError) return NextResponse.json({ error: bookingError.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
