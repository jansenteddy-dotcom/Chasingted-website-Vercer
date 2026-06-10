'use client'

import { useState } from 'react'

export default function AdminDocumentsClient({ slug, documents }: { slug: string; documents: any[] }) {
  const [docs, setDocs] = useState(documents)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [saving, setSaving] = useState(false)

  async function add() {
    if (!label.trim() || !url.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_slug: slug, label: label.trim(), url: url.trim() }),
    })
    const data = await res.json()
    if (data.document) {
      setDocs(prev => [data.document, ...prev])
      setLabel('')
      setUrl('')
    }
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch(`/api/admin/documents?id=${id}`, { method: 'DELETE' })
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  const inputCls = 'border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]'

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Add Document</h2>
        <div className="flex gap-3 mb-3">
          <input className={`${inputCls} flex-1`} placeholder="Label (e.g. Flight Voucher)" value={label} onChange={e => setLabel(e.target.value)} />
          <input className={`${inputCls} flex-1`} placeholder="URL (Google Drive, Dropbox…)" value={url} onChange={e => setUrl(e.target.value)} />
          <button onClick={add} disabled={saving || !label.trim() || !url.trim()}
            className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-2 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
            {saving ? '…' : 'Add'}
          </button>
        </div>
        <p className="text-xs text-gray-400">Paste a link to any file — Google Drive, Dropbox, WeTransfer, etc. The traveler will see a download button.</p>
      </div>

      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {!docs.length ? (
          <p className="px-6 py-4 text-sm text-gray-400">No documents yet.</p>
        ) : docs.map(doc => (
          <div key={doc.id} className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-bold text-sm text-[#1a1a1a]">{doc.label}</p>
              <p className="text-xs text-gray-400 truncate max-w-sm">{doc.url}</p>
            </div>
            <button onClick={() => remove(doc.id)}
              className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
