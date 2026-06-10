'use client'

import { useState } from 'react'

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminUpdatesClient({ slug, updates }: { slug: string; updates: any[] }) {
  const [list, setList] = useState(updates)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)

  async function add() {
    if (!title.trim() || !body.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_slug: slug, title: title.trim(), body: body.trim() }),
    })
    const data = await res.json()
    if (data.update) {
      setList(prev => [data.update, ...prev])
      setTitle('')
      setBody('')
    }
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch(`/api/admin/updates?id=${id}`, { method: 'DELETE' })
    setList(prev => prev.filter(u => u.id !== id))
  }

  const inputCls = 'border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] w-full'

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-6 space-y-3">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">Post Update</h2>
        <input className={inputCls} placeholder="Title (e.g. Flights confirmed!)" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea rows={4} className={inputCls} placeholder="Write the update here…" value={body} onChange={e => setBody(e.target.value)} />
        <button onClick={add} disabled={saving || !title.trim() || !body.trim()}
          className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
          {saving ? 'Posting…' : 'Post Update'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {!list.length ? (
          <p className="px-6 py-4 text-sm text-gray-400">No updates yet.</p>
        ) : list.map(u => (
          <div key={u.id} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-[#1a1a1a]">{u.title}</p>
                <p className="text-xs text-gray-400 mb-2">{formatDate(u.created_at)}</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{u.body}</p>
              </div>
              <button onClick={() => remove(u.id)}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 shrink-0">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
