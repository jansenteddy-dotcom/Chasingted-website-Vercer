'use client'

import { useState } from 'react'

export default function AdminGearManagerClient({ slug, items }: { slug: string; items: any[] }) {
  const [list, setList] = useState(items)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [essential, setEssential] = useState(false)
  const [saving, setSaving] = useState(false)

  async function add() {
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/gear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_slug: slug, name: name.trim(),
        category: category.trim() || null,
        description: description.trim() || null,
        essential,
        sort_order: list.length,
      }),
    })
    const data = await res.json()
    if (data.item) {
      setList(prev => [...prev, data.item])
      setName('')
      setDescription('')
    }
    setSaving(false)
  }

  async function remove(id: string) {
    await fetch(`/api/admin/gear?id=${id}`, { method: 'DELETE' })
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
      <div className="bg-white border border-gray-200 p-6 space-y-3">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400">Add Item</h2>
        <div className="flex gap-3">
          <input className={`${inputCls} flex-1`} placeholder="Item name (e.g. Trekking poles)" value={name} onChange={e => setName(e.target.value)} />
          <input className={`${inputCls} w-36`} placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <input className={`${inputCls} w-full`} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#1a1a1a] cursor-pointer">
            <input type="checkbox" checked={essential} onChange={e => setEssential(e.target.checked)}
              className="accent-[#133425]" />
            Mark as essential
          </label>
          <button onClick={add} disabled={saving || !name.trim()}
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
              <div key={item.id} className="flex items-center justify-between px-6 py-3 gap-4">
                <div>
                  <p className="text-sm text-[#1a1a1a] font-bold flex items-center gap-2">
                    {item.name}
                    {item.essential && <span className="text-xs font-normal bg-amber-100 text-amber-800 px-2 py-0.5">Essential</span>}
                  </p>
                  {item.description && <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>}
                </div>
                <button onClick={() => remove(item.id)}
                  className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 shrink-0">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!list.length && (
        <div className="bg-white border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-400">No gear items yet.</p>
        </div>
      )}
    </div>
  )
}
