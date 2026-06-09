type BeholdPost = {
  id: string
  mediaUrl: string
  mediaType: string
  permalink: string
  thumbnailUrl?: string
  caption?: string
  sizes?: {
    small?:  {mediaUrl: string}
    medium?: {mediaUrl: string}
    large?:  {mediaUrl: string}
    full?:   {mediaUrl: string}
  }
}

async function getInstagramPosts(): Promise<BeholdPost[]> {
  const feedId = process.env.BEHOLD_FEED_ID
  if (!feedId) return []

  try {
    const res = await fetch(`https://feeds.behold.so/${feedId}`, {
      next: {revalidate: 3600},
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.slice(0, 6) : data?.posts?.slice(0, 6) ?? []
  } catch {
    return []
  }
}

export default async function InstagramSection() {
  const posts = await getInstagramPosts()
  const instagramUrl = 'https://instagram.com/chasingted.adventures'

  return (
    <section className="bg-white py-20">
      <div className="container text-center">
        <h2 className="font-bold text-3xl md:text-4xl text-[#133425] uppercase tracking-widest mb-3">
          Follow the Journey
        </h2>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4e6358] text-xs font-bold tracking-widest uppercase hover:underline"
        >
          @chasingted.adventures
        </a>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-10 mb-10">
          {posts.length > 0
            ? posts.map((post) => {
                const imgUrl = post.mediaType === 'VIDEO'
                  ? (post.sizes?.medium?.mediaUrl ?? post.thumbnailUrl)
                  : (post.sizes?.medium?.mediaUrl ?? post.sizes?.large?.mediaUrl ?? post.mediaUrl)
                return imgUrl ? (
                  <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square block overflow-hidden group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={post.caption?.slice(0, 100) || 'Chasingted adventure on Instagram'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                ) : null
              })
            : [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-[#3a4a40]/20" />
              ))}
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-4 hover:bg-[#3a4a40] transition-colors duration-200"
        >
          Follow on Instagram
        </a>
      </div>
    </section>
  )
}
