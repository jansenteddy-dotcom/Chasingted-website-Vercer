import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'
import {Resend} from 'resend'
import { fetchUpcomingTrips, applicationEmailHtml } from '@/app/lib/email-templates'

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

    const trips = await fetchUpcomingTrips(body.tripSlug)

    await Promise.all([
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: email,
        subject: `Application received — ${body.tripTitle}`,
        html: applicationEmailHtml(firstName, body.tripTitle, body.tripSlug, trips),
      }),
      resend.emails.send({
        from: 'ChasingTed <info@chasingted.com>',
        to: 'jansen.teddy@gmail.com',
        subject: `New application — ${body.tripTitle}`,
        html: `<p><strong>New application:</strong></p><p><strong>${firstName} ${lastName}</strong> — ${email}<br/>Trip: ${body.tripTitle}<br/>Experience: ${experienceLevel || '—'}<br/>Phone: ${phone || '—'}</p><p><strong>Motivation:</strong><br/>${motivation || '—'}</p>`,
      }),
    ])

    return NextResponse.json({success: true})
  } catch (err) {
    console.error('Apply API error:', err)
    return NextResponse.json({error: 'Failed to save application'}, {status: 500})
  }
}
