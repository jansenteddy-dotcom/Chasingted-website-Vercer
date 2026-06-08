import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://chasingted.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {data: trips} = await sanityFetch({query: sitemapData, stega: false})

  const staticPages: MetadataRoute.Sitemap = [
    {url: BASE_URL, lastModified: new Date(), priority: 1, changeFrequency: 'monthly'},
    {url: `${BASE_URL}/trips`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly'},
    {url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly'},
    {url: `${BASE_URL}/faq`, lastModified: new Date(), priority: 0.6, changeFrequency: 'monthly'},
    {url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.5, changeFrequency: 'yearly'},
  ]

  const tripPages: MetadataRoute.Sitemap =
    trips?.map((trip) => ({
      url: `${BASE_URL}/trips/${trip.slug}`,
      lastModified: new Date(trip._updatedAt),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })) ?? []

  return [...staticPages, ...tripPages]
}
