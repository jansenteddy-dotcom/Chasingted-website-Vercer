import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {sanityFetch} from '@/sanity/lib/live'
import {client} from '@/sanity/lib/client'
import {postBySlugQuery, postSlugsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import {format, parseISO} from 'date-fns'

type Props = {params: Promise<{slug: string}>}

const categoryLabels: Record<string, string> = {
  'expedition-report': 'Expedition Report',
  'destination-guide': 'Destination Guide',
  'gear-tips': 'Gear & Tips',
  'behind-the-scenes': 'Behind the Scenes',
}

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery)
  return slugs?.map(({slug}: {slug: string}) => ({slug})) ?? []
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data: post} = await sanityFetch({query: postBySlugQuery, params: {slug}, stega: false})
  if (!post) return {title: 'Story not found'}

  const description = post.excerpt || `${post.title} — a story from Chasingted adventure expeditions.`
  const coverUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined

  return {
    title: `${post.title} — Chasingted Stories`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      images: coverUrl ? [{url: coverUrl, width: 1200, height: 630}] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  }
}

export default async function StoryDetailPage({params}: Props) {
  const {slug} = await params
  const {data: post} = await sanityFetch({query: postBySlugQuery, params: {slug}})

  if (!post) notFound()

  return (
    <div className="pt-20">
      {/* Hero image */}
      {post.coverImage?.asset && (
        <div className="relative h-[55vh] bg-[#3a4a40]">
          <Image
            src={urlFor(post.coverImage).width(1400).height(700).url()}
            alt={(post.coverImage as any).alt || post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#133425]/40" />
        </div>
      )}

      <div className="container max-w-3xl py-16">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {post.category && (
            <span className="bg-[#f7b500] text-[#133425] text-xs font-bold uppercase tracking-widest px-3 py-1">
              {categoryLabels[post.category] ?? post.category}
            </span>
          )}
          {post.publishedAt && (
            <span className="text-[#3a4a40]/50 text-xs tracking-widest uppercase">
              {format(parseISO(post.publishedAt), 'dd MMMM yyyy')}
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-[#133425] mb-10 leading-tight">
          {post.title}
        </h1>

        {/* Body */}
        {post.body && (
          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#133425] prose-p:text-[#3a4a40] prose-a:text-[#f7b500] prose-img:rounded max-w-none">
            <PortableText value={post.body} />
          </div>
        )}

        {/* Related trip CTA */}
        {post.relatedTrip && post.relatedTrip.status === 'open' && (
          <div className="mt-16 bg-[#133425] text-[#f5f0e4] p-8 rounded">
            <p className="text-xs uppercase tracking-widest text-[#f7b500] mb-2">Join the expedition</p>
            <h3 className="font-serif text-2xl mb-4">{post.relatedTrip.title}</h3>
            <Link
              href={`/trips/${post.relatedTrip.slug}`}
              className="inline-block bg-[#f7b500] text-[#133425] font-bold text-xs uppercase tracking-widest px-8 py-3 hover:bg-[#d9a441] transition-colors"
            >
              View this trip →
            </Link>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-[#e7dbbf]">
          <Link
            href="/stories"
            className="text-[#133425] text-xs font-bold uppercase tracking-widest hover:text-[#3a4a40] transition-colors"
          >
            ← All Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
