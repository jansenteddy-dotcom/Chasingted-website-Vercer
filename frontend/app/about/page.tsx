import type {Metadata} from 'next'
import Image from 'next/image'
import {PortableText} from '@portabletext/react'
import {sanityFetch} from '@/sanity/lib/live'
import {pageContentQuery} from '@/sanity/lib/queries'
import {urlFor} from '@/sanity/lib/utils'

export const metadata: Metadata = {
  title: 'About Chasingted',
  description: 'Chasingted is run by Teddy Jansen — adventure guide and expedition leader based in Amsterdam. Small groups, real wilderness, no tourist shortcuts. Find out who leads your next expedition.',
}

export default async function AboutPage() {
  const {data: page} = await sanityFetch({
    query: pageContentQuery,
    params: {identifier: 'about'},
  })

  return (
    <div className="pt-24 pb-20">
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-[#133425] mb-10">About Chasingted</h1>

        {(page as any)?.heroImage?.asset && (
          <div className="relative w-full aspect-[16/9] mb-10 overflow-hidden rounded">
            <Image
              src={urlFor((page as any).heroImage).width(1200).quality(85).url()}
              alt={(page as any).heroImage.alt || 'About Chasingted'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {page?.content ? (
          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#133425] prose-p:text-[#3a4a40] prose-a:text-[#f7b500] max-w-none">
            <PortableText value={page.content} />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <p className="text-[#3a4a40] text-lg leading-relaxed">
              Chasingted is a small-group adventure travel company run by Teddy Jansen. Each expedition is personally curated, with a maximum of 12 travelers, to ensure an authentic and intimate experience.
            </p>
            <p className="text-[#3a4a40] leading-relaxed mt-4">
              Content coming soon — check back after the site launch.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
