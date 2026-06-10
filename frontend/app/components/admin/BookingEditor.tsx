'use client'

import { useState } from 'react'

type Booking = {
  id: string
  payment_status: string
  status: string
  total_amount: number | null
  deposit_amount: number | null
  balance_due_date: string | null
  admin_notes: string | null
}

export default function BookingEditor({ booking }: { booking: Booking }) {
  const [paymentStatus, setPaymentStatus] = useState(booking.payment_status)
  const [bookingStatus, setBookingStatus] = useState(booking.status)
  const [totalAmount, setTotalAmount] = useState(booking.total_amount?.toString() ?? '')
  const [depositAmount, setDepositAmount] = useState(booking.deposit_amount?.toString() ?? '')
  const [balanceDueDate, setBalanceDueDate] = useState(booking.balance_due_date ?? '')
  const [notes, setNotes] = useState(booking.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: booking.id,
        payment_status: paymentStatus,
        status: bookingStatus,
        total_amount: totalAmount ? parseFloat(totalAmount) : null,
        deposit_amount: depositAmount ? parseFloat(depositAmount) : null,
        balance_due_date: balanceDueDate || null,
        admin_notes: notes || null,
      }),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
  }

  const inputCls = 'border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] w-full'

  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Booking Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Payment Status</label>
          <select className={inputCls} value={paymentStatus} onChange={e => { setPaymentStatus(e.target.value); setSaved(false) }}>
            <option value="unpaid">Unpaid</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="fully_paid">Fully Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Booking Status</label>
          <select className={inputCls} value={bookingStatus} onChange={e => { setBookingStatus(e.target.value); setSaved(false) }}>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Total Amount (€)</label>
          <input type="number" step="0.01" className={inputCls} value={totalAmount} onChange={e => { setTotalAmount(e.target.value); setSaved(false) }} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Deposit Amount (€)</label>
          <input type="number" step="0.01" className={inputCls} value={depositAmount} onChange={e => { setDepositAmount(e.target.value); setSaved(false) }} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Balance Due Date</label>
          <input type="date" className={inputCls} value={balanceDueDate} onChange={e => { setBalanceDueDate(e.target.value); setSaved(false) }} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#1a1a1a] mb-1">Admin Notes</label>
        <textarea rows={3} className={inputCls} value={notes} onChange={e => { setNotes(e.target.value); setSaved(false) }} placeholder="Private notes about this booking…" />
      </div>
      <button onClick={save} disabled={saving}
        className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
      </button>
    </div>
  )
}
