import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '2c36900p',
  dataset: 'production',
  apiVersion: '2024-06-01',
  token: 'skHg97U3fMrYBOHYfEfXjbDcShfrAcAc3xWqXEhYpF0TEtylJQejGNkjRVetrKUswVDsD74JIwAmgJ2MBlBJEiROShAUClzZy7BYclKc7ZuixBPyOpHRyWSFXQXmMx7zl6qX8UiREfvZw50MCdBX8jqzRI8U8C8EXirPZ9FvMPKy1IlxE5lV',
  useCdn: false,
})

let n = 0
const k = () => `k${++n}`
const span = (text, marks = []) => ({_key: k(), _type: 'span', text, marks})
const block = (style, ...children) => ({_key: k(), _type: 'block', style, markDefs: [], children: children.map(c => typeof c === 'string' ? span(c) : c)})
const h2 = t => block('h2', t)
const h3 = t => block('h3', t)
const p = (...c) => block('normal', ...c)
const bold = t => span(t, ['strong'])
const em = t => span(t, ['em'])

// ─────────────────────────────────────────────────────────────────────────────
// POST 1: The Three Pillars of Chasingted
// ─────────────────────────────────────────────────────────────────────────────
const pillarsBody = [
  p('Every company has values. Most of them live on a wall somewhere, framed above a printer, forgotten by Tuesday. At Chasingted, our pillars aren\'t branding. They\'re the actual criteria we use when we\'re deciding where to go, how to build a route, who to travel with, and what counts as a successful expedition. They shape every decision — from the destinations we choose to the number of people we invite.'),
  p('There are three of them. Here\'s what each one actually means.'),

  h2('Curated Expeditions'),
  p('The word ', bold('curated'), ' gets overused. Everything is curated these days — playlists, meal kits, hotel lobbies. We use it deliberately, because it means something specific to us.'),
  p('A Chasingted expedition is not assembled from a catalogue. Every route we run has been researched, walked, paddled, or driven by hand. We choose destinations that reward the kind of slow, attentive travel that most itineraries don\'t have time for. We don\'t fill days with activity for the sake of it. We build in silence. We build in time to get lost.'),
  p('Curation also means saying no — to destinations that are beautiful but overrun, to routes that look impressive on paper but leave you feeling like a tourist, to formats that prioritise spectacle over depth. We\'d rather take ten people somewhere extraordinary and largely unknown than fifty people somewhere everyone else has already been.'),
  p('Each expedition is also tailored to the group. Before we depart, we know who\'s coming. We know roughly what they carry — physically, emotionally, in terms of experience. The route reflects that. The pace reflects that. This isn\'t a one-size-fits-all product. It\'s a journey designed around the people making it.'),

  h2('Real Connection'),
  p('This is probably the pillar people are most sceptical about when they first hear it. Connection is easy to promise. It\'s much harder to actually create the conditions for it.'),
  p('Most group travel puts people in proximity without creating connection. You\'re on the same bus, in the same hotel, at the same dinner table — but the group is too large, the schedule too tight, the setting too comfortable for anything real to happen. You leave having met people. You don\'t leave having known them.'),
  p('We keep our groups small — a handful of people — not because it\'s exclusive, but because connection requires a certain kind of quiet. When the noise fades, when there are no crowds and no performance and no one performing for each other, something shifts. You start talking differently. You listen better. You share things you wouldn\'t share at a dinner party.'),
  p('There\'s a reason stories happen around campfires and not in conference rooms. The setting matters. The scale matters. The absence of distraction matters. We design for all of it.'),
  p('Real connection at Chasingted also means authentic engagement with the places we visit — not as tourists, but as travellers who are genuinely curious. We seek out local knowledge, local food, local perspective. We try to leave places feeling like we paid attention.'),

  h2('Growth Through Challenge'),
  p('The third pillar is the one that most distinguishes an expedition from a holiday. We are not trying to keep you comfortable. We are trying to take you somewhere beyond what you thought your edges were.'),
  p('That doesn\'t mean suffering. It means long days. It means weather you didn\'t plan for. It means the moment on day three when your arms are tired and the campsite is still two hours away and you keep going, and then you arrive, and you sit down, and the feeling of that arrival is something no spa could replicate.'),
  p('Growth on a Chasingted expedition doesn\'t come from effort alone. It comes from ', em('immersion'), ' — from being so fully present in a place and a moment that your usual mental noise simply can\'t compete. There\'s no inbox out there. No algorithm. No performance. Just water and weather and the people beside you.'),
  p('We\'ve watched people cross thresholds on these journeys they didn\'t know they needed to cross. Someone who hadn\'t been alone with their thoughts in years. Someone who hadn\'t used their body hard since they were a teenager. Someone who hadn\'t let strangers see them vulnerable in a long time. The wilderness has a way of stripping back the layers you didn\'t know you were wearing.'),

  h2('Why These Three'),
  p('These pillars aren\'t independent. They reinforce each other. A curated expedition creates the conditions for real connection. Real connection makes growth through challenge possible, because you\'re not facing the hard moments alone. And the growth itself deepens the connection — shared difficulty creates bonds that last.'),
  p('Chasingted is a curated adventure platform offering small-group expeditions to wild, beautiful places. We design journeys that feel grounded and personal, built for travellers who value authenticity, connection, and challenge. It\'s adventure, without the excess.'),
  p('That\'s the whole thing, really. Everything else is detail.'),
]

// ─────────────────────────────────────────────────────────────────────────────
// POST 2: Why We Keep Groups Small
// ─────────────────────────────────────────────────────────────────────────────
const smallGroupBody = [
  p('There\'s a number that changes everything. Not dramatically, not all at once — but cross it, and something in the quality of a shared experience quietly collapses. Add one more person to the campfire and the conversations fragment. Add five more and people start performing instead of talking. Add fifteen more and you\'re no longer a group. You\'re an audience.'),
  p('Chasingted is capped at a handful of people. That number is not a marketing choice. It\'s a philosophical one.'),

  h2('The Problem With Scale'),
  p('The travel industry is built around scale. More passengers means lower cost per head, which means more competitive pricing, which means more bookings. The logic is entirely rational and it produces a product that is entirely hollow.'),
  p('We\'ve all been on the trip where there are forty people and a guide with a flag. Where the "intimate dinner" is a table of twelve at a restaurant that seats two hundred. Where you spend more time moving through logistics than actually experiencing where you are. Where you come home having seen a place but not having felt it.'),
  p('Scale isn\'t just an operational problem. It\'s a human one. Large groups generate a kind of ambient noise — social noise, the noise of performance and impression management, the noise of trying to fit in with people you don\'t know and may never see again. That noise drowns out the quieter frequencies: genuine curiosity, vulnerability, the slow rhythm of real conversation.'),

  h2('What Happens When the Noise Fades'),
  p('Put eight people in the middle of a forest. Give them three days, a river, and no reliable phone signal. Watch what happens.'),
  p('By the second evening something has shifted. The social armour has come off — not because anyone demanded it, but because there\'s no longer any reason to keep it on. You\'ve seen each other struggle with a current. You\'ve cooked together in the rain. You\'ve sat in silence watching the same eagle circle overhead. These moments don\'t bond people through intensity. They bond people through ', em('presence'), '.'),
  p('Real connection happens when the noise fades. Not the external noise — though that matters too — but the internal noise that tells you to be impressive, to be interesting, to fill every silence. In a small group in a wild place, that noise has nowhere to hide and nothing to feed on. So it quiets. And in that quiet, people actually meet each other.'),

  h2('The Campfire Test'),
  p('There is a simple test for the right group size: how many people can sit around a single fire and have one conversation?'),
  p('The answer is roughly eight to ten. Beyond that, the circle fractures into two or three separate conversations. Intimacy becomes arithmetic — you can\'t maintain it across too many people. Someone always ends up on the edge. Someone always gets lost in the noise.'),
  p('We design our expeditions to pass the campfire test every night. Every person in the group sits in the same circle, hears the same stories, contributes to the same conversation. No one falls through the cracks. No one is peripheral. The group is small enough that everyone is visible.'),

  h2('Not Exclusivity — Conditions'),
  p('We want to be clear about something. Keeping groups small is not about exclusivity. It\'s not about curating a certain type of person or creating scarcity for its own sake. The cap exists because it\'s the only number at which the thing we\'re trying to do is actually possible.'),
  p('You cannot manufacture the depth of connection we care about at scale. It\'s not a feature you can add to a larger product. It requires a specific set of conditions: enough people to create genuine group energy, few enough that no one disappears into the background. A threshold where strangers can become, over the course of a week, something closer to the people who know you best.'),
  p('We\'ve thought carefully about what that number is. We\'ve landed on a handful. It\'s the number that makes the campfire work, that makes the conversations go somewhere, that makes every person feel the weight of the group\'s attention at least once. A number where the group is small enough to have a character — its own rhythm, its own inside references, its own shape — by the time the journey ends.'),

  h2('What You Carry Home'),
  p('The people who come back from a Chasingted expedition don\'t usually talk about the scenery first. They talk about the people. They talk about the conversation that went late into the night on day four. The person who surprised everyone, including themselves. The moment the group moved through something hard together and came out the other side.'),
  p('That\'s what a small group makes possible. Not despite its size, but because of it. The constraint is the point. The quiet is where the real things happen.'),
]

// ─────────────────────────────────────────────────────────────────────────────
// POST 3: Co-Creation
// ─────────────────────────────────────────────────────────────────────────────
const coCreationBody = [
  p('Most travel is something that happens to you. You arrive. Someone shows you things. You consume — the views, the food, the curated experience. Then you leave. You were a passenger. A very willing, very satisfied passenger, perhaps — but a passenger nonetheless.'),
  p('Chasingted was built on a different idea. The expedition is not something we do to you. It\'s something we build together.'),

  h2('What Co-Creation Actually Means'),
  p('Co-creation is a word that can mean almost anything, so let\'s be precise about what it means to us.'),
  p('When we invite people on an expedition, we\'re not inviting them to fill seats. We\'re inviting them to bring themselves — their specific knowledge, their way of seeing, their history, their questions, their strengths. We look at who is in the group and we ask: what does this particular group of people make possible that no other group could?'),
  p('Every person who joins a Chasingted expedition carries something the others don\'t. A skill. A perspective shaped by a life lived somewhere different. A way of reading a landscape or a moment. A story that, told at the right time, changes how everyone else understands where they are. We don\'t know in advance what those things are. But we create the conditions for them to surface.'),

  h2('The Podium'),
  p('Here is something we believe: every person, given the right conditions, has something worth sharing. Not a performance — not a TED talk around the campfire — but something genuine. A moment when they\'re the one who sees something clearly, who knows something the others don\'t, who has exactly the right thing to say.'),
  p('We call this the podium. Not literally — there\'s no stage, no spotlight, no scheduled moment for each person to take the floor. The podium is simply the space we try to create where every person gets the chance to be, at least once, the one who contributes something irreplaceable to the group.'),
  p('Sometimes that\'s practical. Someone knows how to read river currents. Someone can identify every bird we pass. Someone has camped in conditions like this before and their calm becomes the group\'s calm. Sometimes it\'s emotional. Someone tells a story that shifts the tone of the evening in a way that opens everyone up. Someone asks the question that nobody else thought to ask.'),
  p('We look at the individual. We watch. We notice what they carry. And we try to create a moment — sometimes deliberately, sometimes just by staying out of the way — where that thing gets to matter.'),

  h2('The Difference Between a Group and a Community'),
  p('A group is people who happen to be in the same place. A community is people who have built something together.'),
  p('The difference is contribution. Communities are formed through shared creation — shared effort, shared risk, shared authorship of something. When everyone in a group has contributed something that changed the experience for the others, the group becomes a community. The journey becomes ', em('theirs'), ', collectively, not just individually.'),
  p('This is why the shape of a Chasingted expedition is never fixed. We have a route. We have a framework. But the texture of the journey — the conversations that define it, the detours taken, the moments that become the stories everyone tells afterwards — those emerge from the group. We don\'t write those in advance. We couldn\'t.'),

  h2('Learning and Flourishing Together'),
  p('There\'s a kind of learning that only happens in groups. Not instruction — not one person transferring knowledge to another — but the learning that comes from watching someone different from you navigate the same situation. From disagreeing about something and discovering you were both partly right. From being surprised by your own reaction to someone else\'s courage or calm or honesty.'),
  p('On a week-long expedition in the wild, this learning is compressed and intensified. You encounter more of each other, more quickly, than you would in months of ordinary life. The setting removes the usual buffers. Nature doesn\'t care how composed you\'d like to appear.'),
  p('We\'ve watched people flourish in ways they didn\'t anticipate. Someone who came in thinking they\'d contribute nothing special and ended up being the emotional anchor of the group. Someone who thought they were coming for the landscape and left understanding that what they\'d needed was the company. Someone who arrived not knowing how to set up a tent and departed knowing something much more important about what they were capable of.'),
  p('This is co-creation at its fullest. Not just building the trip together, but growing together through it. Each person\'s presence changing what\'s possible for all the others. A group that, by the end, has made something that none of them could have made alone.'),

  h2('Why This Matters to Us'),
  p('We could run Chasingted differently. We could design tighter itineraries, more controlled experiences, a more predictable product. It would probably be easier to sell. It would certainly be easier to replicate.'),
  p('But we\'d lose the thing that makes it worth doing. The moment when someone who was quiet for two days suddenly finds their voice and says something that stays with everyone for the rest of the journey. The moment when the group, facing something hard, finds a solution that none of them would have found alone. The moment when it becomes clear that what\'s being built here is not just a memory but a relationship — between people, and between each person and something truer in themselves.'),
  p('That\'s what we\'re building toward. Every time. We just need the right people in the circle to build it with.'),
]

const posts = [
  {
    _type: 'post',
    _id: 'post-pillars-of-chasingted',
    title: 'The Three Pillars of Chasingted: What We Stand For',
    slug: {_type: 'slug', current: 'the-three-pillars-of-chasingted'},
    publishedAt: '2025-03-01',
    category: 'behind-the-scenes',
    excerpt: 'Every expedition we run is built on three foundations: curated routes, real connection, and growth through challenge. Here\'s what each one actually means — and why they\'re inseparable.',
    body: pillarsBody,
  },
  {
    _type: 'post',
    _id: 'post-why-small-groups',
    title: 'Why Real Connection Happens When the Noise Fades',
    slug: {_type: 'slug', current: 'why-real-connection-happens-when-the-noise-fades'},
    publishedAt: '2025-04-01',
    category: 'behind-the-scenes',
    excerpt: 'Most group travel puts people in proximity without creating connection. Chasingted is capped at a handful of people — not because it\'s exclusive, but because the right number is everything.',
    body: smallGroupBody,
  },
  {
    _type: 'post',
    _id: 'post-co-creation',
    title: 'Co-Creation: Why Every Person Gets a Stage',
    slug: {_type: 'slug', current: 'co-creation-why-every-person-gets-a-stage'},
    publishedAt: '2025-05-01',
    category: 'behind-the-scenes',
    excerpt: 'A Chasingted expedition isn\'t something that happens to you. We look at every individual and create a podium for them. Because when each person contributes something irreplaceable, the group flourishes together.',
    body: coCreationBody,
  },
]

for (const post of posts) {
  console.log(`Creating: ${post.title}`)
  await client.createOrReplace(post)
  console.log(`✓ Done: /stories/${post.slug.current}`)
}

console.log('\nAll three posts created.')
