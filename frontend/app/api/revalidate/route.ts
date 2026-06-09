import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({message: 'Invalid secret'}, {status: 401})
  }

  try {
    const body = await request.json().catch(() => ({}))
    const type = body._type
    const slug = body.slug?.current

    // Always refresh homepage and trips list
    revalidatePath('/')
    revalidatePath('/trips')
    revalidatePath('/stories')

    // If a specific trip changed, refresh that trip page too
    if (type === 'trip' && slug) {
      revalidatePath(`/trips/${slug}`)
      revalidatePath(`/trips/${slug}/apply`)
    }

    // If a post changed, refresh that story page too
    if (type === 'post' && slug) {
      revalidatePath(`/stories/${slug}`)
    }

    // If settings changed (logo, hero, contact), refresh all pages
    if (type === 'settings') {
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({revalidated: true, type: type ?? 'unknown', slug: slug ?? null})
  } catch {
    return NextResponse.json({message: 'Revalidation failed'}, {status: 500})
  }
}
