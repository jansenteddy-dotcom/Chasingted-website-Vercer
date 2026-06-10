'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type GearItem = { id: string; item_name: string; required: boolean; notes: string | null; category: string }

export default function GearClient({
  grouped, packedIds: initial, userId
}: { grouped: Record<string, GearItem[]>; packedIds: Set<string>; userId: string }) {
  const [packed, setPacked] = useState<Set<string>>(initial)
  const supabase = createClient()

  async function toggle(itemId: string) {
    const isPacked = packed.has(itemId)
    setPacked(prev => { const next = new Set(prev); isPacked ? next.delete(itemId) : next.add(itemId); return next })
    if (isPacked) {
      await supabase.from('gear_packed').delete().eq('gear_item_id', itemId).eq('user_id', userId)
    } else {
      await supabase.from('gear_packed').insert({ gear_item_id: itemId, user_id: userId })
    }
  }

  const categories = Object.keys(grouped)
  if (categories.length === 0) return (
    <div className="bg-white border border-[#d4c5a0] p-10 text-center">
      <p className="text-sm text-[#3a4a40]">No gear list yet.</p>
      <p className="text-xs text-[#3a4a40]/60 mt-1">Teddy will add the gear list closer to departure.</p>
    </div>
  )

  const allItems = categories.flatMap(c => grouped[c])
  const packedCount = allItems.filter(i => packed.has(i.id)).length

  return (
    <div>
      <p className="text-xs text-[#3a4a40]/60 mb-4">{packedCount} of {allItems.length} packed</p>
      <div className="w-full bg-[#d4c5a0] h-1.5 mb-6 rounded">
        <div className="bg-[#133425] h-1.5 rounded transition-all" style={{ width: `${(packedCount / allItems.length) * 100}%` }} />
      </div>
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h2 className="font-bold text-xs uppercase tracking-widest text-[#3a4a40]/60 mb-3">{category}</h2>
            <div className="space-y-2">
              {grouped[category].map(item => {
                const isPacked = packed.has(item.id)
                return (
                  <button key={item.id} onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-4 bg-white border px-5 py-3 text-left transition-colors ${isPacked ? 'border-[#133425] bg-[#f5f0e4]' : 'border-[#d4c5a0] hover:border-[#133425]'}`}>
                    <div className={`w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${isPacked ? 'bg-[#133425] border-[#133425]' : 'border-[#d4c5a0]'}`}>
                      {isPacked && <svg className="w-3 h-3 text-[#F5F0E4]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-bold ${isPacked ? 'line-through text-[#3a4a40]/50' : 'text-[#133425]'}`}>{item.item_name}</span>
                      {item.required && !isPacked && <span className="ml-2 text-xs text-red-600 font-bold uppercase tracking-wide">Required</span>}
                      {item.notes && <p className="text-xs text-[#3a4a40]/60 mt-0.5">{item.notes}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
