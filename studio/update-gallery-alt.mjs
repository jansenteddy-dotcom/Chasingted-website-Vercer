import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

// Per-trip alt/caption templates — tailor each description to the destination
const tripDescriptions = {
  'trip-kyrgyzstan': {
    scenes: [
      {alt: 'Motorcyclists crossing a high-altitude mountain pass in the Tien Shan range, Kyrgyzstan', caption: 'Riding the roof of the world — crossing a pass above 3,000m on the Chasingted Kyrgyzstan motorcycle expedition.'},
      {alt: 'Mountain campsite in Kyrgyzstan with tents surrounded by peaks at dusk', caption: 'Camp for the night deep in the Tien Shan mountains — no wifi, just starlight and silence.'},
      {alt: 'Expedition motorcycles lined up on a dirt road through a valley in Kyrgyzstan', caption: 'The route unfolds. Off-road through Kyrgyz valleys on the Chasingted motorcycle expedition.'},
      {alt: 'River crossing on motorcycles in the Kyrgyz mountains during a Chasingted expedition', caption: 'Water crossings are part of the adventure — fording mountain rivers on the Kyrgyzstan trip.'},
      {alt: 'Panoramic view of the Tien Shan mountains from a high mountain pass in Kyrgyzstan', caption: 'The scale of the Tien Shan hits you at the top — a view earned, not taken.'},
      {alt: 'Small group of adventure travelers around a campfire in Kyrgyzstan mountains', caption: 'End of a long day on the road. The group gathers around the fire in the Kyrgyz wilderness.'},
      {alt: 'Chasingted expedition riders on a gravel mountain road in remote Kyrgyzstan', caption: 'Remote gravel roads, zero traffic — exactly why Chasingted chose this route.'},
      {alt: 'Wide open steppe landscape of Kyrgyzstan under a blue sky', caption: 'Riding across the vast Kyrgyz steppe between mountain ranges on the Chasingted expedition.'},
    ],
  },
  'trip-oman': {
    scenes: [
      {alt: 'Towering red sand dunes of the Rub al Khali desert in Oman at golden hour', caption: 'The Empty Quarter at golden hour — arguably the most dramatic landscape on earth, visited on the Chasingted Oman expedition.'},
      {alt: 'Chasingted expedition camp among sand dunes under a star-filled sky in Oman', caption: 'Sleeping under stars in the Oman desert. No tent roofs — just sky.'},
      {alt: 'Desert safari vehicles driving across sand dunes in the Omani desert', caption: "Crossing the Empty Quarter — overland through one of the world's largest sand deserts."},
      {alt: 'Sunset over sand dunes in Oman with silhouettes of expedition travelers', caption: 'Sunset in the Empty Quarter. The light changes everything out here.'},
      {alt: 'Wadi canyon with turquoise water in Oman — Chasingted expedition', caption: 'A hidden wadi in the Omani mountains — cool water, ancient rock and total quiet.'},
      {alt: 'Traditional Omani village surrounded by date palms and mountains', caption: 'Remote villages untouched by mass tourism — part of what makes the Chasingted Oman route special.'},
      {alt: 'Expedition group at a desert camp in Oman with traditional open-fire cooking', caption: 'Dinner is cooked over an open fire in the desert. Slow evenings, good conversation.'},
      {alt: 'Sea of red sand stretching to the horizon in the Rub al Khali, Oman', caption: 'Endless red sand in every direction — this is the Empty Quarter, the heart of the Chasingted Oman trip.'},
    ],
  },
}

const mazuryId = 'b69606a3-814d-462d-800d-81216c58d2f4'
const mazuryScenes = [
  {alt: 'Kayakers paddling through the crystal-clear lakes of the Mazury region in Poland', caption: 'Paddling through Mazury — the Polish lake district at its most peaceful, on the Chasingted kayak expedition.'},
  {alt: 'Campsite by a lake in the Mazury forest, Poland — Chasingted kayak expedition', caption: 'Camp by the water. The Mazury forest goes quiet after dark.'},
  {alt: 'Two kayaks on a calm lake surrounded by pine forest in Mazury, Poland', caption: 'Mirror-flat water and pine forest on both sides — the Mazury lake district earns its reputation.'},
  {alt: 'Morning mist over a Mazury lake in Poland with kayaks ready to launch', caption: 'Early morning on the lake — before the mist lifts, before anyone else is up.'},
  {alt: 'Group of kayakers resting on a lake shore in Mazury with forests in the background', caption: 'A rest stop on the water route through Mazury — the group takes it in.'},
  {alt: 'Narrow canal connecting lakes in the Mazury lake district, Poland', caption: 'Threading through the canals that link the Mazury lakes — quiet and completely off the tourist map.'},
  {alt: 'Sunset over Mazury lakes in Poland — kayak expedition by Chasingted', caption: "Sunset on Mazury — the sky turns the lake gold, and it's all yours."},
  {alt: 'Traditional wooden pier on a Mazury lake at dawn, Poland', caption: 'A wooden pier at first light — what you wake up to on the Chasingted Mazury expedition.'},
]

const trips = await client.fetch(`*[_type == "trip"]{_id, title, gallery}`)

for (const trip of trips) {
  if (!trip.gallery || trip.gallery.length === 0) {
    console.log(`⚠  ${trip.title} — no gallery images, skipping`)
    continue
  }

  let scenes
  if (trip._id === 'trip-kyrgyzstan') scenes = tripDescriptions['trip-kyrgyzstan'].scenes
  else if (trip._id === 'trip-oman') scenes = tripDescriptions['trip-oman'].scenes
  else if (trip._id === mazuryId) scenes = mazuryScenes
  else scenes = null

  const updatedGallery = trip.gallery.map((img, index) => {
    const scene = scenes?.[index % scenes.length]
    return {
      ...img,
      alt: img.alt || scene?.alt || `${trip.title} — expedition photo ${index + 1} — Chasingted adventure travel`,
      caption: img.caption || scene?.caption || `Photo ${index + 1} from the Chasingted ${trip.title} expedition.`,
    }
  })

  await client.patch(trip._id).set({gallery: updatedGallery}).commit()
  console.log(`✓ ${trip.title} — ${trip.gallery.length} gallery image(s) updated`)
}

console.log('\n✅ All gallery alt text and captions added.')
