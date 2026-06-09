import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {pageContentQuery} from '@/sanity/lib/queries'

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Common questions about Chasingted expeditions — fitness requirements, what\'s included, how to apply, cancellation policy, group size and more.',
}

export default async function FaqPage() {
  const {data: page} = await sanityFetch({
    query: pageContentQuery,
    params: {identifier: 'faq'},
  })

  const faqItems = page?.faqItems

  const faqSchema = faqItems?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item: {question?: string; answer?: string}) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {'@type': 'Answer', text: item.answer},
        })),
      }
    : null

  return (
    <div className="pt-24 pb-20">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
        />
      )}
      <div className="container max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-[#133425] mb-4">Frequently Asked Questions</h1>
        <p className="text-[#3a4a40]/70 mb-12">
          Can&apos;t find your answer here? Send a message to{' '}
          <a href="mailto:info@chasingted.com" className="text-[#f7b500] hover:underline">
            info@chasingted.com
          </a>
          .
        </p>

        {faqItems && faqItems.length > 0 ? (
          <div className="divide-y divide-[#E7DBBF]">
            {faqItems.map((item: {_key?: string; question?: string; answer?: string}, i: number) => (
              <details key={item._key || i} className="group py-5">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h2 className="font-serif text-lg text-[#133425] group-open:text-[#f7b500] transition-colors">
                    {item.question}
                  </h2>
                  <span className="text-[#3a4a40]/40 ml-4 shrink-0 group-open:rotate-45 transition-transform">＋</span>
                </summary>
                {item.answer && (
                  <p className="mt-4 text-[#3a4a40] leading-relaxed text-sm">{item.answer}</p>
                )}
              </details>
            ))}
          </div>
        ) : (
          <p className="text-[#3a4a40]/60">
            FAQ content coming soon — add questions in Sanity Studio under Page Content → FAQ.
          </p>
        )}
      </div>
    </div>
  )
}
