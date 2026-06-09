import {createClient} from '@supabase/supabase-js'
import {Resend} from 'resend'
import {NextRequest, NextResponse} from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const {email} = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({error: 'Invalid email'}, {status: 400})
  }

  const {error: dbError} = await supabase.from('waitlist').insert({email})

  if (dbError) {
    // Duplicate email — silently succeed so we don't reveal who's already signed up
    if (dbError.code === '23505') {
      return NextResponse.json({success: true})
    }
    return NextResponse.json({error: 'Failed to save'}, {status: 500})
  }

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'jansen.teddy@gmail.com',
    subject: '🌿 New waitlist signup — Chasingted',
    html: `<p>Someone just joined the Chasingted waitlist:</p><p><strong>${email}</strong></p>`,
  })

  return NextResponse.json({success: true})
}
