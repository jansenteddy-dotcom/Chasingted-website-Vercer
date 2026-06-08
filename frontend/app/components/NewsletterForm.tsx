'use client'

import {useState} from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p className="text-[#F5F0E4] text-sm tracking-wide py-4">
        You&apos;re on the list. We&apos;ll be in touch when new expeditions open.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto border border-[#F5F0E4]/30"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 bg-transparent text-[#F5F0E4] placeholder-[#F5F0E4]/40 px-6 py-4 text-sm outline-none"
      />
      <button
        type="submit"
        className="bg-[#F5F0E4] text-[#133425] font-bold text-xs tracking-widest uppercase px-8 py-4 hover:bg-[#e7dbbf] transition-colors duration-200 shrink-0"
      >
        Join the List
      </button>
    </form>
  )
}
