'use client'

import {useState} from 'react'

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, firstName, lastName}),
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <p className="text-[#F5F0E4] text-sm tracking-wide py-4">
        You&apos;re on the list. We&apos;ll be in touch when new expeditions open.
      </p>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="flex-1 bg-transparent text-[#F5F0E4] placeholder-[#F5F0E4]/40 px-6 py-4 text-sm outline-none border border-[#F5F0E4]/30"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="flex-1 bg-transparent text-[#F5F0E4] placeholder-[#F5F0E4]/40 px-6 py-4 text-sm outline-none border border-[#F5F0E4]/30"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-0 border border-[#F5F0E4]/30">
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
            disabled={status === 'loading'}
            className="bg-[#F5F0E4] text-[#133425] font-bold text-xs tracking-widest uppercase px-8 py-4 hover:bg-[#e7dbbf] transition-colors duration-200 shrink-0 disabled:opacity-60"
          >
            {status === 'loading' ? 'Saving...' : 'Join the List'}
          </button>
        </div>
      </form>
      {status === 'error' && (
        <p className="text-[#F5F0E4]/70 text-xs mt-3">Something went wrong — please try again.</p>
      )}
    </div>
  )
}
