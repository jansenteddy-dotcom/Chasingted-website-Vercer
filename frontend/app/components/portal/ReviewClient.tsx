'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Booking = { id: string; trip_name: string; trip_end_date: string }
type Review = { id: string; rating: number; title: string | null; content: string; published: boolean } | null

export default function ReviewClient({ booking, existing, userId }: { booking: Booking; existing: Review; userId: string }) {
  const [review, setReview] = useState<Review>(existing)
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [hovered, setHovered] = useState(0)
  const [title, setTitle] = useState(existing?.title ?? '')
  const [content, setContent] = useState(existing?.content ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showCert, setShowCert] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError('Please select a star rating.'); return }
    if (!content.trim()) { setError('Please write something about your experience.'); return }
    setSaving(true); setError('')
    const supabase = createClient()
    const { data, error } = await supabase.from('reviews').upsert({
      booking_id: booking.id, user_id: userId, rating, title: title || null, content: content.trim()
    }, { onConflict: 'booking_id' }).select().single()
    if (error) { setError('Could not save. Try again.'); setSaving(false); return }
    setReview(data)
    setSaving(false)
  }

  const displayRating = hovered || rating

  return (
    <div className="space-y-6">
      {/* Review form */}
      <div className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-4">Share Your Experience</h2>
        {review && !review.published && (
          <p className="text-xs text-[#d9a441] bg-yellow-50 border border-yellow-200 px-3 py-2 mb-4">
            Your review has been submitted and is waiting for approval before it appears on the website.
          </p>
        )}
        {review?.published && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-4">Your review is published on the website. Thank you!</p>
        )}
        {error && <p className="text-red-700 text-xs bg-red-50 border border-red-200 px-3 py-2 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                  className="text-2xl transition-transform hover:scale-110">
                  {s <= displayRating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Title <span className="font-normal normal-case tracking-normal text-[#3a4a40]/50">(optional)</span></label>
            <input className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
              value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. An expedition I'll never forget" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Your Review</label>
            <textarea rows={5} className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
              value={content} onChange={e => setContent(e.target.value)} placeholder="Tell us about your experience…" />
          </div>
          <button type="submit" disabled={saving}
            className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : review ? 'Update Review' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Certificate */}
      <div className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-2">Completion Certificate</h2>
        <p className="text-xs text-[#3a4a40]/70 mb-4">Download a certificate of completion for your expedition.</p>
        <button onClick={() => { setShowCert(true); setTimeout(() => window.print(), 300) }}
          className="bg-[#d9a441] text-[#133425] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#c8933a] transition-colors">
          Download Certificate (PDF)
        </button>
      </div>

      {/* Hidden print certificate */}
      {showCert && (
        <div className="hidden print:block fixed inset-0 bg-white p-16 text-center">
          <p className="text-xs tracking-widest uppercase text-[#3a4a40]/60 mb-6">Certificate of Completion</p>
          <div className="border-4 border-[#133425] p-16 max-w-2xl mx-auto">
            <div className="text-4xl font-bold uppercase tracking-widest text-[#133425] mb-2">Chasingted</div>
            <p className="text-sm tracking-widest uppercase text-[#3a4a40]/60 mb-12">Adventure Expeditions</p>
            <p className="text-lg text-[#3a4a40] mb-4">This certifies that</p>
            <p className="text-3xl font-bold text-[#133425] uppercase tracking-widest mb-8">Explorer</p>
            <p className="text-lg text-[#3a4a40] mb-2">has successfully completed</p>
            <p className="text-2xl font-bold text-[#133425] uppercase tracking-wide mb-2">{booking.trip_name}</p>
            <p className="text-sm text-[#3a4a40]/60 mb-12">
              {new Date(booking.trip_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="border-t border-[#d4c5a0] pt-8">
              <p className="text-sm text-[#3a4a40]/60">ChasingTed · Chasingted.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
