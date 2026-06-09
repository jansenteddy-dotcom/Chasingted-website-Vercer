import {defineQuery} from 'next-sanity'

// Site settings — homepage hero, intro text, featured trips, branding, contact, social
export const settingsQuery = defineQuery(`
  *[_type == "settings" && _id == "siteSettings"][0]{
    heroHeading,
    heroSubheading,
    heroImage,
    introText,
    "featuredTrips": featuredTrips[]->{
      _id,
      title,
      "slug": slug.current,
      destination,
      startDate,
      endDate,
      shortDescription,
      difficultyLevel,
      status,
      "price": price{deposit, total, currency},
      heroImage,
    },
    ogImage,
    logo,
    footerTagline,
    footerSubtagline,
    contactEmail,
    contactPhone,
    contactLocation,
    instagramUrl,
    facebookUrl,
    youtubeUrl,
    tiktokUrl,
  }
`)

// All trips for the /trips listing page
export const allTripsQuery = defineQuery(`
  *[_type == "trip" && status != "archived"] | order(startDate asc){
    _id,
    title,
    "slug": slug.current,
    destination,
    startDate,
    endDate,
    shortDescription,
    difficultyLevel,
    status,
    "price": price{deposit, total, currency},
    heroImage,
    maxGroupSize,
  }
`)

// Single trip by slug for the /trips/[slug] detail page
export const tripBySlugQuery = defineQuery(`
  *[_type == "trip" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    destination,
    startDate,
    endDate,
    shortDescription,
    fullDescription,
    difficultyLevel,
    status,
    "price": price{deposit, total, currency},
    maxGroupSize,
    heroImage,
    gallery,
    itinerary,
    included,
    excluded,
    meetingPoint,
    fitnessLevel,
    cancellationPolicy,
    gearList,
    packingList,
  }
`)

// All trip slugs — used to generate all static trip pages
export const tripSlugsQuery = defineQuery(`
  *[_type == "trip" && defined(slug.current)]{"slug": slug.current}
`)

// Page content by identifier — used for About and FAQ pages
export const pageContentQuery = defineQuery(`
  *[_type == "page" && identifier == $identifier][0]{
    _id,
    identifier,
    content,
    faqItems,
  }
`)

// Sitemap data — used by app/sitemap.ts
export const sitemapData = defineQuery(`
  *[_type == "trip" && defined(slug.current)]{
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)
