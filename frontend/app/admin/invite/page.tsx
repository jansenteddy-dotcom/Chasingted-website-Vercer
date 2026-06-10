'use client'

import { useState } from 'react'

export default function InvitePage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [tripName, setTripName] = useState('')
  const [tripSlug, setTripSlug] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok?: boolean; error?: string } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email, firstName, lastName,
        tripName, tripSlug, startDate, endDate,
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
      }),
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const inputCls = 'border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] w-full'

  return (
    <div className="max-w-xl">
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-2">Invite Traveler</h1>
      <p className="text-sm text-gray-500 mb-8">This creates a booking and sends the traveler an email to set their password.</p>

      {result?.ok && (
        <div className="bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 mb-6 font-bold">
          Invite sent! The traveler will receive an email with a link to set their password.
        </div>
      )}
      {result?.error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-6">
          Error: {result.error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">Traveler</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">First Name</label>
              <input required className={inputCls} value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Last Name</label>
              <input required className={inputCls} value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Email Address</label>
            <input required type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">Trip</h2>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Trip Name</label>
            <input required className={inputCls} value={tripName} onChange={e => setTripName(e.target.value)} placeholder="e.g. Nepal Everest Base Camp" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Trip Slug</label>
            <input required className={inputCls} value={tripSlug} onChange={e => setTripSlug(e.target.value)} placeholder="e.g. nepal-everest-base-camp" />
            <p className="text-xs text-gray-400 mt-1">This must match the URL slug from Sanity CMS</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Start Date</label>
              <input required type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">End Date</label>
              <input required type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Total Amount (€)</label>
              <input type="number" step="0.01" className={inputCls} value={totalAmount} onChange={e => setTotalAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Deposit Amount (€)</label>
              <input type="number" step="0.01" className={inputCls} value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="0.00" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-4 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
          {loading ? 'Sending Invite…' : 'Create Booking & Send Invite'}
        </button>
      </form>
    </div>
  )
}
