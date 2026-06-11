'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

type Props = {
  id: string
  currentStatus: string
  currentNotes?: string
}

export default function ApplicationReviewClient({id, currentStatus, currentNotes}: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(newStatus: string) {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status: newStatus, reviewNotes: notes}),
    })
    if (res.ok) {
      setStatus(newStatus)
      setSaved(true)
      router.refresh()
    }
    setSaving(false)
  }

  async function saveNotes() {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status, reviewNotes: notes}),
    })
    if (res.ok) setSaved(true)
    setSaving(false)
  }

  const badgeColor = status === 'approved' ? 'text-green-700' : status === 'rejected' ? 'text-red-700' : 'text-yellow-700'

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-5">Review Decision</h2>

      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current status</p>
        <span className={`text-sm font-bold uppercase tracking-widest ${badgeColor}`}>{status}</span>
      </div>

      <div className="mb-5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
          Review notes (internal)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes about this applicant — not visible to them"
          className="w-full border border-gray-200 rounded px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#3a4a40]"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1a1a1a] transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save notes'}
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => save('approved')}
          disabled={saving || status === 'approved'}
          className="flex-1 bg-green-700 text-white font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Approve
        </button>
        <button
          onClick={() => save('rejected')}
          disabled={saving || status === 'rejected'}
          className="flex-1 bg-red-700 text-white font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Reject
        </button>
        {status !== 'pending' && (
          <button
            onClick={() => save('pending')}
            disabled={saving}
            className="flex-1 border border-gray-300 text-gray-600 font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Reset to Pending
          </button>
        )}
      </div>
    </div>
  )
}
