import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {allPostsQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'
import {format, parseISO} from 'date-fns'

export const metadata: Metadata = {
  title: 'Stories — Chasingted',
  description: 'Expedition reports, destination guides, and stories from the field. Read about real adventures from Chasingted small-group expeditions.',
}

const categoryLabels: Record<string, string> = {
  'expedition-report': 'Expedition Report',
  'destination-guide': 'Destination Guide',
  'gear-tips': 'Gear & Tips',
  'behind-the-scenes': 'Behind the Scenes',
}

export default async function StoriesPage() {
  const {data: posts} = await sanityFetch({query: allPostsQuery})

  return (
    <div className="pt-24 pb-20">
      <div className="container">
        <div className="text-center mb-14">
          <h1 className="font-bold text-4xl md:text-5xl text-[#133425] uppercase tracking-widest mb-4">
            Stories
          </h1>
          <p className="text-[#3a4a40]/70 text-sm tracking-widest uppercase max-w-xl mx-auto">
            Expedition reports, destination guides, and dispatches from the field.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/stories/${post.slug}`}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-[#3a4a40] mb-4">
                  {post.coverImage?.asset ? (
                    <Image
                      src={urlFor(post.coverImage).width(800).height(533).url()}
                      alt={(post.coverImage as any).alt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#3a4a40]/40" />
                  )}
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-[#f7b500] text-[#133425] text-xs font-bold uppercase tracking-widest px-3 py-1">
                      {categoryLabels[post.category] ?? post.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  {post.publishedAt && (
                    <p className="text-[#3a4a40]/50 text-xs tracking-widest uppercase mb-2">
                      {format(parseISO(post.publishedAt), 'dd MMMM yyyy')}
                    </p>
                  )}
                  <h2 className="font-serif text-xl text-[#133425] mb-3 group-hover:text-[#3a4a40] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[#3a4a40]/70 text-sm leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-[#133425] text-xs font-bold uppercase tracking-widest mt-4 group-hover:text-[#3a4a40] transition-colors">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-[#3a4a40]/50 text-sm tracking-wide mb-2">No stories published yet.</p>
            <p className="text-[#3a4a40]/40 text-xs">Check back soon — the first dispatch is coming.</p>
          </div>
        )}
      </div>
    </div>
  )
}
