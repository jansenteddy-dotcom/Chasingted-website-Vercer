// Run this from the studio directory: node import-content.mjs
import {createClient} from '@sanity/client'
import crypto from 'crypto'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

const BASE = 'https://i0.wp.com/chasingted.com/wp-content/uploads/2026/05/'

function key() {
  return crypto.randomBytes(5).toString('hex')
}

function block(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }
}

function heading(text, level = 'h2') {
  return {
    _type: 'block',
    _key: key(),
    style: level,
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }
}

async function uploadFromUrl(url, filename) {
  console.log(`  ↓ ${filename}`)
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ⚠ Skipped ${filename} (${res.status})`)
      return null
    }
    const buffer = Buffer.from(await res.arrayBuffer())
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const asset = await client.assets.upload('image', buffer, {filename, contentType})
    console.log(`  ✓ ${filename} → ${asset._id}`)
    return {_type: 'reference', _ref: asset._id}
  } catch (err) {
    console.warn(`  ⚠ Failed ${filename}:`, err.message)
    return null
  }
}

function imageDoc(ref, alt) {
  if (!ref) return undefined
  return {_type: 'image', asset: ref, alt}
}

function galleryItem(ref) {
  return {_type: 'image', _key: key(), asset: ref}
}

async function main() {
  console.log('=== Chasingted content import ===\n')

  // ─── UPLOAD ALL IMAGES ───────────────────────────────────────────────────
  console.log('Step 1: Uploading images...\n')

  const [homepageHero, kyrgyzstanHero, omanHero, mazuryHero] = await Promise.all([
    uploadFromUrl(BASE + 'kyrgyzstan-motorcycle-expedition-hero.webp', 'homepage-hero.webp'),
    uploadFromUrl(BASE + 'DSCF9197-1536x1024-1.webp', 'kyrgyzstan-hero.webp'),
    uploadFromUrl(BASE + 'oman-4x4-desert-expedition-hero.webp', 'oman-hero.webp'),
    uploadFromUrl(BASE + 'mazury-kayak-expedition-hero.jpg', 'mazury-hero.jpg'),
  ])

  const [kg1, kg2, kg3, kg4, kg5, kg6] = await Promise.all([
    uploadFromUrl(BASE + 'naraa-in-ub-Hb0bl_gYorU-unsplash.webp', 'kyrg-1.webp'),
    uploadFromUrl(BASE + 'mick-truyts-jT3OSNXyDtY-unsplash.webp', 'kyrg-2.webp'),
    uploadFromUrl(BASE + 'mikhail-blinov-qapbRizwAyY-unsplash.jpg', 'kyrg-3.jpg'),
    uploadFromUrl(BASE + 'DSCF8453-1536x1024-1.webp', 'kyrg-4.webp'),
    uploadFromUrl(BASE + 'azamat-kylychev-ryWDhMNme7o-unsplash.jpg', 'kyrg-5.jpg'),
    uploadFromUrl(BASE + 'amir-asake-1y6xSXuiVHU-unsplash.webp', 'kyrg-6.webp'),
  ])

  const [om1, om2, om3, om4, om5] = await Promise.all([
    uploadFromUrl(BASE + 'silas-baisch-KZCnvR-vdqU-unsplash.webp', 'oman-1.webp'),
    uploadFromUrl(BASE + 'silas-baisch-CtESCAkBfBU-unsplash.webp', 'oman-2.webp'),
    uploadFromUrl(BASE + 'ruben-hanssen-ZQ6bjPMZcY8-unsplash.webp', 'oman-3.webp'),
    uploadFromUrl(BASE + 'emad-mahmoud-1GX6xobwGXE-unsplash.webp', 'oman-4.webp'),
    uploadFromUrl(BASE + 'katerina-kerdi-NybQgLnzrS4-unsplash.webp', 'oman-5.webp'),
  ])

  const [mz1, mz2, mz3, mz4] = await Promise.all([
    uploadFromUrl(BASE + 'stephane-bernard-U_9oC_s9o2I-unsplash.webp', 'mazury-1.webp'),
    uploadFromUrl(BASE + 'niklas-weiss-3KfS_Ocmd2Q-unsplash.jpg', 'mazury-2.jpg'),
    uploadFromUrl(BASE + 'lindsay-doyle-PuYQitcqhoE-unsplash.webp', 'mazury-3.webp'),
    uploadFromUrl(BASE + 'riaan-de-bruin-LxcR2VI2pjM-unsplash.webp', 'mazury-4.webp'),
  ])

  const kyrgyzstanGallery = [kg1, kg2, kg3, kg4, kg5, kg6].filter(Boolean).map(galleryItem)
  const omanGallery = [om1, om2, om3, om4, om5].filter(Boolean).map(galleryItem)
  const mazuryGallery = [mz1, mz2, mz3, mz4].filter(Boolean).map(galleryItem)

  // ─── TRIPS ───────────────────────────────────────────────────────────────
  console.log('\nStep 2: Creating trips...\n')

  await client.createOrReplace({
    _id: 'trip-kyrgyzstan',
    _type: 'trip',
    title: 'Tien Shan, Kyrgyzstan',
    slug: {_type: 'slug', current: 'tien-shan-kyrgyzstan'},
    destination: 'Tien Shan, Kyrgyzstan',
    startDate: '2026-08-15',
    endDate: '2026-08-24',
    price: {deposit: 1000, total: 4000, currency: 'EUR'},
    maxGroupSize: 8,
    difficultyLevel: 'challenging',
    status: 'open',
    heroImage: imageDoc(kyrgyzstanHero, 'Motorcycle riding through the Tien Shan mountains'),
    gallery: kyrgyzstanGallery,
    shortDescription: 'Ten days riding adventure motorcycles through the wide valleys, switchback passes and yurt camps of the Tien Shan. Mostly off-road and remote.',
    fullDescription: [
      block('Ten days riding adventure motorcycles through the wide valleys, switchback passes and yurt camps of the Tien Shan.'),
      block('The route combines paved switchbacks with dirt tracks, remaining mostly off-road and remote. Accommodations include yurts, guesthouses, and mountain hotels.'),
      block('Good general fitness and prior off-road riding experience required. Days are long, altitude is real — we cross passes above 3,000m.'),
    ],
    itinerary: [
      {_type: 'itineraryDay', _key: key(), day: 1, title: 'Bishkek', description: 'Group pickup, bike handover briefing, welcome dinner'},
      {_type: 'itineraryDay', _key: key(), day: 2, title: 'Suusamyr Valley', description: 'First full ride south into wide grass valleys'},
      {_type: 'itineraryDay', _key: key(), day: 3, title: 'Song Köl', description: 'Climb high pass to glacial lake at 3,000m; yurt camp'},
      {_type: 'itineraryDay', _key: key(), day: 4, title: 'Song Köl', description: 'Looser day exploring lake tracks; swimming available'},
      {_type: 'itineraryDay', _key: key(), day: 5, title: 'Naryn', description: 'Long descent through canyons to town'},
      {_type: 'itineraryDay', _key: key(), day: 6, title: 'Tash Rabat', description: 'Ride to ancient stone caravanserai near Chinese border'},
      {_type: 'itineraryDay', _key: key(), day: 7, title: 'High passes', description: 'Three passes with technical sections — the toughest riding day'},
      {_type: 'itineraryDay', _key: key(), day: 8, title: 'Issyk-Köl', description: 'Easier day to warm lake; swimming and rest'},
      {_type: 'itineraryDay', _key: key(), day: 9, title: 'Return ride', description: 'Final riding day along north shore toward Bishkek'},
      {_type: 'itineraryDay', _key: key(), day: 10, title: 'Bishkek', description: 'Bike return and airport transfer'},
    ],
    included: [
      'Adventure motorcycle rental (300–700cc)',
      'Fuel for the route',
      'Lead and sweep guides plus support vehicle',
      '9 nights lodging (yurts, guesthouses, lodge)',
      'All meals and water',
      'Airport transfers',
    ],
    excluded: [
      'International flights',
      'Travel and motorcycle insurance',
      'Personal riding gear',
      'Tips',
      'Drinks at lodges',
    ],
    meetingPoint: 'Manas International Airport (FRU), Bishkek — group transfer to riders\' lodge',
  })
  console.log('✓ Kyrgyzstan trip created')

  await client.createOrReplace({
    _id: 'trip-oman',
    _type: 'trip',
    title: 'Empty Quarter, Oman',
    slug: {_type: 'slug', current: 'empty-quarter-oman'},
    destination: 'Empty Quarter, Oman',
    startDate: '2026-11-12',
    endDate: '2026-11-19',
    price: {deposit: 700, total: 2000, currency: 'EUR'},
    maxGroupSize: 10,
    difficultyLevel: 'moderate',
    status: 'open',
    heroImage: imageDoc(omanHero, 'Empty Quarter sand dunes in Oman'),
    gallery: omanGallery,
    shortDescription: 'Eight days driving deep into the Empty Quarter — the largest contiguous sand desert on earth. Wadis, Bedouin tea in the dunes, and stargazing in total silence.',
    fullDescription: [
      block('Eight days driving deep into the Empty Quarter — the largest contiguous sand desert on earth.'),
      block('The expedition features wadis carved into mountains, a turtle beach coastal experience, Bedouin tea in the dunes, and stargazing in total silence.'),
      block('Moderate fitness required — long vehicle days and warm afternoons in camp.'),
    ],
    itinerary: [
      {_type: 'itineraryDay', _key: key(), day: 1, title: 'Arrival in Muscat', description: 'Airport pickup and welcome dinner along the corniche'},
      {_type: 'itineraryDay', _key: key(), day: 2, title: 'Up the mountains', description: 'Drive the Hajar range to Jebel Akhdar with high plateau and terraced villages'},
      {_type: 'itineraryDay', _key: key(), day: 3, title: 'Wadi day', description: 'Hike and swim through Wadi Bani Khalid\'s clear pools'},
      {_type: 'itineraryDay', _key: key(), day: 4, title: 'Coastal night', description: 'Drive to Arabian Sea coast for turtle beach overnight'},
      {_type: 'itineraryDay', _key: key(), day: 5, title: 'Into the sand', description: 'Enter Wahiba Sands for first dunes and off-road driving'},
      {_type: 'itineraryDay', _key: key(), day: 6, title: 'Empty Quarter', description: 'Deep into Rub\' al Khali with endless dunes and silence'},
      {_type: 'itineraryDay', _key: key(), day: 7, title: 'Back across', description: 'Return drive via hidden oasis and final desert camp'},
      {_type: 'itineraryDay', _key: key(), day: 8, title: 'Departure', description: 'Return to Muscat for onward flights'},
    ],
    included: [
      '4×4 vehicle rental and fuel',
      'Lead guide convoy with recovery vehicle',
      '7 nights lodging (hotels and desert camps)',
      'All meals and water',
      'Off-road driving briefing and dune training',
      'Airport transfers',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Alcohol',
      'Personal gear',
      'Tips',
    ],
    meetingPoint: 'Muscat International Airport (MCT), Oman',
  })
  console.log('✓ Oman trip created')

  await client.createOrReplace({
    _id: 'trip-mazury',
    _type: 'trip',
    title: 'Mazury, Poland',
    slug: {_type: 'slug', current: 'mazury-poland'},
    destination: 'Mazury, Poland',
    startDate: '2026-06-20',
    endDate: '2026-06-28',
    price: {deposit: 150, total: 1300, currency: 'EUR'},
    maxGroupSize: 12,
    difficultyLevel: 'moderate',
    status: 'open',
    heroImage: imageDoc(mazuryHero, 'Kayaking through the Mazury lakes, Poland'),
    gallery: mazuryGallery,
    shortDescription: 'Nine days off-grid in the Mazury lake district — over two thousand lakes, the Krutynia river winding through old forest, beavers along the banks and eagles overhead.',
    fullDescription: [
      block('Nine days off-grid in the Mazury lake district — over two thousand lakes, the Krutynia river winding through old forest, beavers along the banks and eagles overhead.'),
      block('Paddle, camp, share fires and sauna facilities. The expedition concludes with a hotel & spa night for recovery and reflection.'),
      block('Around 6 hours of relaxed daily paddling. No prior kayaking experience required.'),
    ],
    itinerary: [
      {_type: 'itineraryDay', _key: key(), day: 1, title: 'Arrival in Gdańsk', description: 'Group pickup, transfer to Mazury, welcome dinner at lodge'},
      {_type: 'itineraryDay', _key: key(), day: 2, title: 'Settling in', description: 'Equipment distribution, kayak fundamentals on calm water, half-day paddling'},
      {_type: 'itineraryDay', _key: key(), day: 3, title: 'River expedition begins', description: 'Narrow forest passages, kingfisher sightings, first riverbank camp'},
      {_type: 'itineraryDay', _key: key(), day: 4, title: 'Open water', description: 'Extended crossing of two larger lakes with midday swimming break'},
      {_type: 'itineraryDay', _key: key(), day: 5, title: 'Wildlife day', description: 'Remote paddling, beaver viewing at dusk, evening fire gathering'},
      {_type: 'itineraryDay', _key: key(), day: 6, title: 'Land day', description: 'Reduced paddling, land exploration, shoulder recovery time'},
      {_type: 'itineraryDay', _key: key(), day: 7, title: 'Final water day', description: 'Leisurely pace and reflection on the water'},
      {_type: 'itineraryDay', _key: key(), day: 8, title: 'Lodge & spa', description: 'Hotel accommodation, spa access, final group dinner'},
      {_type: 'itineraryDay', _key: key(), day: 9, title: 'Departure', description: 'Group transfer back to Gdańsk Airport'},
    ],
    included: [
      'Kayak and all paddling equipment',
      'All expedition meals',
      'Non-alcoholic beverages',
      'Gdańsk airport transfers',
      'Camping gear (tent, sleeping kit, cooking supplies)',
      'Final night hotel & spa access',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Alcoholic beverages',
      'Personal trekking equipment',
    ],
    meetingPoint: 'Gdańsk Airport (GDN), Poland',
  })
  console.log('✓ Mazury trip created')

  // ─── SITE SETTINGS ───────────────────────────────────────────────────────
  console.log('\nStep 3: Creating site settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'settings',
    heroHeading: 'From Somewhere to Somewhere.',
    heroSubheading: 'Curated expeditions for those who want more than just another trip.',
    heroImage: imageDoc(homepageHero || kyrgyzstanHero, 'Adventure expedition in the mountains'),
    introText: 'Adventure, without the excess. Small-group expeditions to wild, beautiful places — hand-picked and crafted with intention.',
    featuredTrips: [
      {_type: 'reference', _ref: 'trip-kyrgyzstan', _key: key()},
      {_type: 'reference', _ref: 'trip-oman', _key: key()},
      {_type: 'reference', _ref: 'trip-mazury', _key: key()},
    ],
  })
  console.log('✓ Site settings created')

  // ─── ABOUT PAGE ──────────────────────────────────────────────────────────
  console.log('\nStep 4: Creating About page...')
  await client.createOrReplace({
    _id: 'page-about',
    _type: 'page',
    identifier: 'about',
    content: [
      heading('Authentic expeditions. Small groups. Big adventures.'),
      block('Chasingted organises small-group expeditions to wild, beautiful places — hand-picked and crafted with intention for travellers who value authenticity, connection, and challenge.'),
      block('We believe the best way to experience the world is slowly, simply, and together. Stepping off the tourist trail and finding yourself somewhere genuinely remote.'),
      heading('What we stand for', 'h3'),
      block('Curated expeditions — hand-picked routes built for people wanting more than typical trips.'),
      block('Real connection — small groups, shared fires, authentic moments far from crowded tourist areas.'),
      block('Growth through challenge — long days, wild weather, and personal limits tested through nature.'),
      heading('About Teddy Jansen', 'h3'),
      block('An Amsterdammer who organises experiences and creates memorable moments. Chasingted combines his skills, restlessness, and the philosophy that real world-knowledge comes from real places, small groups, and challenging experiences.'),
      block('"Find out what you\'re made of."'),
    ],
  })
  console.log('✓ About page created')

  // ─── FAQ PAGE ────────────────────────────────────────────────────────────
  console.log('\nStep 5: Creating FAQ page...')
  await client.createOrReplace({
    _id: 'page-faq',
    _type: 'page',
    identifier: 'faq',
    faqItems: [
      {_key: key(), question: 'How do I join an expedition?', answer: 'Browse our expeditions, open the one that calls you, and send an application. We read every one personally and reach out to talk about whether it\'s the right fit — it\'s a conversation, not a checkout.'},
      {_key: key(), question: 'Why an application instead of instant booking?', answer: 'Small groups only work when the group works. We keep expeditions to around 10 people and choose travellers who are genuinely up for it, so every trip stays intimate and real.'},
      {_key: key(), question: 'How big are the groups?', answer: 'Small by design — typically a maximum of 10 travellers, sometimes a little more on our pilot trips. True connection happens when the noise fades.'},
      {_key: key(), question: 'How fit do I need to be?', answer: 'You should be comfortable with active days — paddling, hiking or long days outdoors. Each expedition lists its difficulty, and we\'ll tell you honestly what to expect before you commit.'},
      {_key: key(), question: 'What do I need to bring?', answer: 'A full kit list is shared ahead of departure. In short: broken-in footwear, weatherproof layers, and a sense of adventure. The technical gear is handled where noted on each trip.'},
      {_key: key(), question: 'Do I need experience?', answer: 'For most trips, no — just a willingness to be challenged. We\'ll always be upfront if a specific expedition needs prior experience.'},
      {_key: key(), question: "What's included once I arrive?", answer: 'On most trips: accommodation, meals, expert guides and ground logistics. Each expedition page lists exactly what\'s included and what isn\'t.'},
      {_key: key(), question: 'What are the nights like?', answer: 'Often tents under the stars, sometimes cabins or a lodge — close to nature, with campfire circles and real conversation. Details are on each trip page.'},
      {_key: key(), question: 'How does payment work?', answer: 'A deposit secures your spot once your application is accepted, with the balance due before departure. We\'ll walk you through it personally.'},
      {_key: key(), question: "What's your cancellation policy?", answer: 'Full refund up to 60 days before departure, 50% from 30–59 days, and no refund within 30 days. We strongly recommend travel insurance.'},
    ],
  })
  console.log('✓ FAQ page created')

  console.log('\n✅ All done! Open chasingtedwebsite.netlify.app to see your content.')
}

main().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
