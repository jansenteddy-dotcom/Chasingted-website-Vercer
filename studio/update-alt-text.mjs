import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

const altTexts = {
  'trip-kyrgyzstan': 'Adventure motorcyclists crossing a remote mountain pass in Kyrgyzstan — Chasingted small-group expedition through Central Asia',
  'trip-oman':       'Overland expedition vehicles on the red sand dunes of the Oman desert at sunset — Chasingted small-group adventure travel',
  'trip-mazury':     'Kayakers paddling through the pristine lakes of the Mazury lake district in Poland — Chasingted small-group kayak expedition',
}

for (const [id, alt] of Object.entries(altTexts)) {
  const trip = await client.getDocument(id)
  if (!trip) {
    console.log(`⚠  ${id} not found — skipping`)
    continue
  }

  if (!trip.heroImage?.asset) {
    console.log(`⚠  ${id} has no hero image yet — skipping alt text patch`)
    continue
  }

  await client.patch(id).set({'heroImage.alt': alt}).commit()
  console.log(`✓ ${id} — alt text set`)
}

console.log('\n✅ Done.')
