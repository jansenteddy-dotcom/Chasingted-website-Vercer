import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

let keyCounter = 0
const k = () => `k${++keyCounter}`

const span = (text, marks = []) => ({_key: k(), _type: 'span', text, marks})
const block = (style, ...texts) => ({
  _key: k(), _type: 'block', style,
  markDefs: [],
  children: texts.map(t => typeof t === 'string' ? span(t) : t),
})
const h2 = (text) => block('h2', text)
const h3 = (text) => block('h3', text)
const p = (...texts) => block('normal', ...texts)
const strong = (text) => span(text, ['strong'])

const body = [
  p('Around day two on the Krutynia river kayak route, something shifts. You stop thinking about your paddle technique and just let the river carry you. The forest closes in on both sides, there are no roads, no engine noise — just water and trees and the occasional splash of a beaver disappearing into the bank. That\'s when you realise this is something special.'),

  h2('What Is the Krutynia River Kayak Route?'),
  p('The Krutynia is one of Europe\'s finest lowland paddling routes, stretching around 102–109 kilometres through the Masuria region of northeastern Poland. The journey begins in Sorkwity and ends in Ruciane-Nida, passing through 20 lakes, 8 connecting rivers, 2 canals, and 6 nature reserves along the way. Most paddlers take 7 to 9 days to complete the full route, though shorter versions are possible.'),
  p('The river has two distinct personalities. The upper section is narrow and fast-moving, cutting through dense ancient forest with occasional log obstacles to navigate around. Further downstream it slows and opens out into reed beds and wide lake crossings. Neither section is technically challenging — there is no white water, no portaging, nothing that requires experience. It is genuinely suitable for beginners.'),

  h2('The Route Stage by Stage'),
  p(strong('Days 1–2 — Sorkwity to Zielony Lasek:'), ' The route starts narrow and forested, with swift sections and the occasional downed log to navigate. Beaver dams and otter slides appear regularly along the banks. The forest is thick and the paddling is active.'),
  p(strong('Days 3–4 — Puszcza Piska:'), ' You enter the Puszcza Piska, one of Poland\'s largest remaining primeval forests. White-tailed eagles are a constant overhead presence. The village of Krutyń sits at roughly the midpoint and offers a chance to restock. The Krutyń to Ukta section — around 13 km, taking 3 to 4 hours — is considered the most scenic stretch of the entire route.'),
  p(strong('Days 5–6 — The Lakes Section:'), ' The landscape opens up as you cross a series of lakes — Mokre, Gardyńskie, and Dłużec. Lake Mokre is best crossed in the morning before afternoon wind picks up. These open sections feel completely different from the forest — vast, bright, and exposed.'),
  p(strong('Days 7–9 — Masurian Landscape Park to Ruciane-Nida:'), ' The final section passes through an area containing 11 nature reserves and around 850 recorded plant species. The paddling becomes more contemplative as the journey draws to a close at Ruciane-Nida.'),

  h2('Wildlife on the Krutynia River'),
  p('The Krutynia corridor passes through some of Poland\'s most ecologically intact forest. White-tailed eagles, golden eagles, great grey herons, and kingfishers are a regular presence. More elusive, but genuinely present, are wolves, lynx, elk, and European bison. You\'ll find evidence of beavers everywhere — the chewed stumps, the slides worn smooth into the bank, the half-submerged dams.'),
  p('Over 200 bird species have been recorded along the route. The single best thing you can do to maximise wildlife sightings is to start early — on the water by 7 am puts you ahead of other paddlers and into the most active part of the day for most animals.'),

  h2('Practical Information'),
  h3('Difficulty'),
  p('Easy. No white water experience needed, no portaging, no technical skills required. It\'s genuinely suitable for first-time kayakers, solo paddlers, and families with older children. The lake crossings require basic awareness of weather and wind conditions, and you\'ll need reasonable fitness to manage a loaded kayak across a full week of paddling — but nothing more than that.'),

  h3('Best Time to Go'),
  p('The paddling season runs May through September. June is arguably the best month — the forest is at peak greenery, insect populations are lower than July and August, and you\'ll encounter fewer other paddlers. Early June and mid-September offer the most solitude while still guaranteeing adequate water levels.'),

  h3('Getting There'),
  p('The nearest major city is Olsztyn, which connects to Warsaw by direct train in roughly 2.5 hours. From Olsztyn, buses and taxis serve Sorkwity. If you\'re joining an organised group, transfers and vehicle logistics are typically arranged as part of the trip.'),

  h2('Where to Sleep'),
  p('The Polish PTTK (national tourism organisation) maintains a series of riverside hostels spaced roughly every 13 kilometres along the route. They range from basic camping cabins to dormitory rooms with showers, and most have a small shop or can arrange meals. It\'s a simple but well-functioning system that makes the logistics of a multi-day paddle very manageable.'),
  p('There are also agritourism farms, guesthouses, and small hotels in villages along the way. Wild camping is technically restricted through the nature reserve sections, but designated campsites provide more than enough options. If you\'re going in July or August, book accommodation in advance — particularly for weekends.'),

  h2('What to See Beyond the River'),
  h3('Wojnowo'),
  p('A short detour brings you to the Filiponi Monastery — an Eastern Orthodox community established in the 19th century. The architecture is striking and the setting, deep in the forest, is unlike anything else in Poland. Worth the stop.'),

  h3('Kadzidłowo'),
  p('The Wild Animal Park here rehabilitates large European species — wolves, lynx, bison, and bears — in semi-wild enclosures. It gives you a close look at the animals that share the forest you\'ve been paddling through, and the context is genuinely good.'),

  h2('Going Solo vs. Joining a Group'),
  p('The Krutynia is perfectly set up for independent paddlers — rentals are available, GPX routes exist, the hostel system works, and you can put together a solid trip without any outside help. That said, going with a small guided group has real advantages: knowing exactly where and when to be on the river for wildlife, local knowledge about conditions and timing, and the simple pleasure of sharing the experience with a small number of like-minded people rather than navigating it alone.'),
  p('When we run the Mazury expedition at Chasingted, we keep the group to ten people maximum. The logistics are handled, but the focus is entirely on paddling — the kind of days where you cover ground, see extraordinary things, and arrive at camp genuinely tired in the best possible way.'),

  h2('Final Thoughts'),
  p('The Krutynia doesn\'t offer dramatic mountain scenery or the kind of landscapes that look good on a poster. What it offers is better than that — uncomplicated days, extraordinary wildlife, self-powered progress through ancient forest, and the kind of quiet that is increasingly hard to find in Europe. It\'s one of the best things you can do in Poland, and not enough people outside Poland know it exists yet. Go while the forest is still quiet.'),
]

const post = {
  _type: 'post',
  _id: 'post-krutynia-route-guide',
  title: 'Krutynia River Kayak Route: The Complete Guide to Paddling Mazury',
  slug: {_type: 'slug', current: 'krutynia-river-kayak-route-guide'},
  publishedAt: '2024-09-01',
  category: 'destination-guide',
  excerpt: 'A complete guide to paddling the Krutynia river kayak route in Poland\'s Mazury region — 102 km through ancient forests, 20 lakes, and some of Europe\'s best wildlife.',
  body,
}

console.log('Creating post...')
const result = await client.createOrReplace(post)
console.log('✓ Post created:', result._id)
console.log('  View it at: https://chasingted.sanity.studio/structure/post;post-krutynia-route-guide')
