import {createClient} from '@supabase/supabase-js'
import {NextRequest, NextResponse} from 'next/server'
import { fetchUpcomingTrips, waitlistEmailHtml } from '@/app/lib/email-templates'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)


export async function POST(req: NextRequest) {
  const {email, firstName, lastName} = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({error: 'Invalid email'}, {status: 400})
  }

  const {error: dbError} = await supabase.from('waitlist').insert({
    email,
    first_name: firstName || null,
    last_name: lastName || null,
  })

  if (dbError) {
    if (dbError.code === '23505') {
      return NextResponse.json({success: true})
    }
    console.error('Supabase insert error:', JSON.stringify(dbError))
    // If columns don't exist yet, fall back to email-only insert
    if (dbError.code === 'PGRST204' || dbError.message?.includes('column')) {
      const {error: fallbackError} = await supabase.from('waitlist').insert({email})
      if (fallbackError && fallbackError.code !== '23505') {
        console.error('Supabase fallback error:', JSON.stringify(fallbackError))
        return NextResponse.json({error: fallbackError.message}, {status: 500})
      }
    } else {
      return NextResponse.json({error: dbError.message}, {status: 500})
    }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const displayName = firstName || 'there'
    const trips = await fetchUpcomingTrips()

    await Promise.all([
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: email,
        subject: "You're on the list — ChasingTed",
        html: waitlistEmailHtml(displayName, trips),
      }),
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: 'jansen.teddy@gmail.com',
        subject: 'New waitlist signup — ChasingTed',
        html: `<p>New waitlist signup:</p><p><strong>${firstName ? `${firstName} ${lastName}` : '(no name)'}</strong><br/>${email}</p>`,
      }),
    ])
  } catch (e) {
    console.error('Resend error:', e)
  }

  return NextResponse.json({success: true})
}
