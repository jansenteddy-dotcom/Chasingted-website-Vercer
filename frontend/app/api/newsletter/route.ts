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
    const displayName = firstName ? `${firstName}` : 'there'

    await Promise.all([
      // Confirmation email to the person who signed up
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: email,
        subject: "You're on the ChasingTed waitlist",
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <div style="background:#133425;padding:32px;text-align:center;">
              <h1 style="color:#F5F0E4;font-size:24px;letter-spacing:4px;text-transform:uppercase;margin:0;">ChasingTed</h1>
              <p style="color:#f7b500;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:8px 0 0;">Adventure Expeditions</p>
            </div>
            <div style="padding:40px 32px;background:#F5F0E4;">
              <p style="font-size:16px;margin-bottom:16px;">Hi ${displayName},</p>
              <p style="font-size:15px;line-height:1.7;margin-bottom:16px;">
                You're on the list. We'll reach out personally when a spot opens up on an expedition that matches you.
              </p>
              <p style="font-size:15px;line-height:1.7;margin-bottom:32px;">
                In the meantime, browse our upcoming trips to get a feel for what we do.
              </p>
              <div style="text-align:center;margin-bottom:32px;">
                <a href="https://chasingted.com/trips"
                  style="background:#f7b500;color:#133425;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:14px 32px;display:inline-block;">
                  Browse Expeditions
                </a>
              </div>
              <p style="font-size:13px;color:#3a4a40;line-height:1.7;">
                Questions? Reply to this email or reach us at
                <a href="mailto:info@chasingted.com" style="color:#133425;">info@chasingted.com</a>
              </p>
            </div>
            <div style="padding:20px 32px;background:#133425;text-align:center;">
              <p style="color:#F5F0E4;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0;">
                ChasingTed · chasingted.com
              </p>
            </div>
          </div>
        `,
      }),
      // Internal notification to Teddy
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
