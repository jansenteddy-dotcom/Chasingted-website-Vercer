import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

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

    return NextResponse.json({success: true})
  } catch (err) {
    console.error('Apply API error:', err)
    return NextResponse.json({error: 'Failed to save application'}, {status: 500})
  }
}
