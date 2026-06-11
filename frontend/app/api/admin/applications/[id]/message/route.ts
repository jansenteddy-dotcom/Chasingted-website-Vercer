import {NextRequest, NextResponse} from 'next/server'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const {subject, message, applicantEmail, applicantName} = await req.json()

  if (!subject || !message || !applicantEmail) {
    return NextResponse.json({error: 'Missing required fields'}, {status: 400})
  }

  try {
    await resend.emails.send({
      from: 'Teddy from ChasingTed <info@chasingted.com>',
      to: applicantEmail,
      replyTo: 'info@chasingted.com',
      subject,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#1a1a1a">
        ${message.split('\n').map((line: string) => line.trim() === '' ? '<br/>' : `<p style="margin:0 0 4px">${line}</p>`).join('')}
        <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5"/>
        <p style="font-size:12px;color:#888">ChasingTed · chasingted.com</p>
      </div>`,
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Message send error:', err)
    return NextResponse.json({error: 'Failed to send email'}, {status: 500})
  }
}
