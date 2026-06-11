import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tripId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      nationality,
      experienceLevel,
      motivation,
      emergencyContact,
      medicalInfo,
    } = body

    if (!tripId || !firstName || !lastName || !email) {
      return NextResponse.json({error: 'Missing required fields'}, {status: 400})
    }

    await writeClient.create({
      _type: 'application',
      trip: {_type: 'reference', _ref: tripId},
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      dateOfBirth: dateOfBirth || undefined,
      nationality: nationality || undefined,
      experienceLevel: experienceLevel || undefined,
      motivation: motivation || undefined,
      emergencyContact: emergencyContact?.name
        ? {name: emergencyContact.name, phone: emergencyContact.phone || undefined}
        : undefined,
      medicalInfo: medicalInfo || undefined,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })

    await Promise.all([
      // Confirmation to applicant
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: email,
        subject: `Application received — ${body.tripTitle}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <div style="background:#133425;padding:32px;text-align:center;">
              <h1 style="color:#F5F0E4;font-size:24px;letter-spacing:4px;text-transform:uppercase;margin:0;">ChasingTed</h1>
              <p style="color:#f7b500;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:8px 0 0;">Adventure Expeditions</p>
            </div>
            <div style="padding:40px 32px;background:#F5F0E4;">
              <p style="font-size:16px;margin-bottom:16px;">Hi ${firstName},</p>
              <p style="font-size:15px;line-height:1.7;margin-bottom:16px;">
                Your application for <strong>${body.tripTitle}</strong> has been received. We review every application personally and will get back to you within <strong>3–5 days</strong>.
              </p>
              <p style="font-size:15px;line-height:1.7;margin-bottom:32px;">
                In the meantime, feel free to browse our other expeditions or reach out with any questions.
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
              <p style="color:#F5F0E4;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0;">ChasingTed · chasingted.com</p>
            </div>
          </div>
        `,
      }),
      // Notification to Teddy
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: 'jansen.teddy@gmail.com',
        subject: `New application — ${body.tripTitle}`,
        html: `
          <p><strong>New trip application received:</strong></p>
          <p><strong>Name:</strong> ${firstName} ${lastName}<br/>
          <strong>Email:</strong> ${email}<br/>
          <strong>Trip:</strong> ${body.tripTitle}<br/>
          <strong>Experience:</strong> ${experienceLevel || '—'}<br/>
          <strong>Phone:</strong> ${phone || '—'}</p>
          <p><strong>Motivation:</strong><br/>${motivation || '—'}</p>
        `,
      }),
    ])

    return NextResponse.json({success: true})
  } catch (err) {
    console.error('Apply API error:', err)
    return NextResponse.json({error: 'Failed to save application'}, {status: 500})
  }
}
