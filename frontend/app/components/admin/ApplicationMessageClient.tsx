'use client'

import {useState} from 'react'

type Props = {
  id: string
  applicantName: string
  applicantEmail: string
  tripTitle: string
}

export default function ApplicationMessageClient({id, applicantName, applicantEmail, tripTitle}: Props) {
  const [subject, setSubject] = useState(`Let's schedule a call — ${tripTitle}`)
  const [message, setMessage] = useState(
    `Hi ${applicantName.split(' ')[0]},\n\nThanks for applying for ${tripTitle} — I've reviewed your application and would love to have a quick call to get to know each other a bit better and answer any questions you might have.\n\nWould any of the following times work for you?\n\n- \n- \n- \n\nLooking forward to speaking with you!\n\nTeddy\nChasingted`
  )
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send() {
    setSending(true)
    setError(null)
    const res = await fetch(`/api/admin/applications/${id}/message`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({subject, message, applicantEmail, applicantName}),
    })
    if (res.ok) {
      setSent(true)
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Failed to send. Try again.')
    }
    setSending(false)
  }

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Message Applicant</h2>
        <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800 text-sm">
          Email sent to {applicantEmail} ✓
        </div>
        <button
          onClick={() => setSent(false)}
          className="mt-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1a1a1a] transition-colors"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">Message Applicant</h2>
      <p className="text-xs text-gray-400 mb-5">Sending to: {applicantEmail}</p>

      <div className="mb-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Subject</label>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border border-gray-200 rounded px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#3a4a40]"
        />
      </div>

      <div className="mb-5">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Message</label>
        <textarea
          rows={12}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border border-gray-200 rounded px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#3a4a40] font-mono leading-relaxed"
        />
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">{error}</div>
      )}

      <button
        onClick={send}
        disabled={sending || !subject.trim() || !message.trim()}
        className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-4 hover:bg-[#3a4a40] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {sending ? 'Sending…' : 'Send Email'}
      </button>
    </div>
  )
}
