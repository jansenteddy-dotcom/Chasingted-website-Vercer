'use client'

import { useState } from 'react'

export default function AdminChecklistManagerClient({ slug, items }: { slug: string; items: any[] }) {
  const [list, setList] = useState(items)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)

  async function add() {
    if (!text.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_slug: slug, text: text.trim(), category: category.trim() || null, sort_order: list.length }),
    })
    const data = await res.json()
    if (data.item) {
      setList(prev => [...prev, data.item])
      setText('')
    }
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch(`/api/admin/checklist?id=${id}`, { method: 'DELETE' })
    setList(prev => prev.filter(i => i.id !== id))
  }

  const inputCls = 'border border-gray-200 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]'

  const grouped: Record<string, any[]> = {}
  for (const item of list) {
    const key = item.category ?? 'General'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Add Item</h2>
        <div className="flex gap-3">
          <input className={`${inputCls} flex-1`} placeholder="Item text (e.g. Confirm flights)" value={text} onChange={e => setText(e.target.value)} />
          <input className={`${inputCls} w-36`} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <button onClick={add} disabled={saving || !text.trim()}
            className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-2 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
            {saving ? '…' : 'Add'}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} className="bg-white border border-gray-200">
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-400">{cat}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {catItems.map(item => (
              <div key={item.id} className="flex items-center justify-between px-6 py-3">
                <p className="text-sm text-[#1a1a1a]">{item.text}</p>
                <button onClick={() => remove(item.id)}
                  className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!list.length && (
        <div className="bg-white border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-400">No checklist items yet.</p>
        </div>
      )}
    </div>
  )
}
