import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  const userId = form.get('userId') as string | null

  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const path = `${userId}.jpg`

  const admin = createAdminClient()

  const { error: uploadError } = await admin.storage
    .from('Avatars')
    .upload(path, buffer, { upsert: true, contentType: 'image/jpeg' })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = admin.storage.from('Avatars').getPublicUrl(path)
  const url = `${data.publicUrl}?t=${Date.now()}`

  await admin.from('profiles').update({ avatar_url: url }).eq('id', userId)

  return NextResponse.json({ url })
}
