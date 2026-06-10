import {createClient} from '@supabase/supabase-js'
import {NextRequest, NextResponse} from 'next/server'

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
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'jansen.teddy@gmail.com',
      subject: '🌿 New waitlist signup — Chasingted',
      html: `<p>Someone just joined the Chasingted waitlist:</p><p><strong>${firstName ? `${firstName} ${lastName}` : ''}</strong><br/>${email}</p>`,
    })
  } catch (e) {
    console.error('Resend error:', e)
  }

  return NextResponse.json({success: true})
}
