import {NextRequest, NextResponse} from 'next/server'
import {createClient} from '@sanity/client'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-09-25',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function PATCH(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const {status, reviewNotes} = await req.json()

  const validStatuses = ['pending', 'approved', 'rejected']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({error: 'Invalid status'}, {status: 400})
  }

  const patch: Record<string, unknown> = {reviewedAt: new Date().toISOString()}
  if (status) patch.status = status
  if (reviewNotes !== undefined) patch.reviewNotes = reviewNotes

  try {
    await writeClient.patch(id).set(patch).commit()
    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Application update error:', err)
    return NextResponse.json({error: 'Failed to update application'}, {status: 500})
  }
}
