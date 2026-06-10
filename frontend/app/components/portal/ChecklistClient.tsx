'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Item = { id: string; title: string; description: string | null; due_days_before: number | null }

export default function ChecklistClient({
  items, completedIds: initial, userId
}: { items: Item[]; completedIds: Set<string>; userId: string }) {
  const [completed, setCompleted] = useState<Set<string>>(initial)
  const supabase = createClient()

  async function toggle(itemId: string) {
    const isDone = completed.has(itemId)
    setCompleted(prev => {
      const next = new Set(prev)
      isDone ? next.delete(itemId) : next.add(itemId)
      return next
    })
    if (isDone) {
      await supabase.from('checklist_completions')
        .delete().eq('checklist_item_id', itemId).eq('user_id', userId)
    } else {
      await supabase.from('checklist_completions')
        .insert({ checklist_item_id: itemId, user_id: userId })
    }
  }

  if (items.length === 0) return (
    <div className="bg-white border border-[#d4c5a0] p-10 text-center">
      <p className="text-sm text-[#3a4a40]">No checklist items yet.</p>
      <p className="text-xs text-[#3a4a40]/60 mt-1">ChasingTed will add tasks here as the expedition gets closer.</p>
    </div>
  )

  const done = items.filter(i => completed.has(i.id)).length

  return (
    <div>
      <p className="text-xs text-[#3a4a40]/60 mb-4">{done} of {items.length} complete</p>
      <div className="w-full bg-[#d4c5a0] h-1.5 mb-6 rounded">
        <div className="bg-[#133425] h-1.5 rounded transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <div className="space-y-3">
        {items.map(item => {
          const isDone = completed.has(item.id)
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`w-full flex items-start gap-4 bg-white border px-5 py-4 text-left transition-colors ${isDone ? 'border-[#133425] bg-[#f5f0e4]' : 'border-[#d4c5a0] hover:border-[#133425]'}`}>
              <div className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${isDone ? 'bg-[#133425] border-[#133425]' : 'border-[#d4c5a0]'}`}>
                {isDone && <svg className="w-3 h-3 text-[#F5F0E4]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>}
              </div>
              <div>
                <p className={`font-bold text-sm uppercase tracking-wide ${isDone ? 'line-through text-[#3a4a40]/50' : 'text-[#133425]'}`}>{item.title}</p>
                {item.description && <p className="text-xs text-[#3a4a40]/60 mt-1">{item.description}</p>}
                {item.due_days_before && <p className="text-xs text-[#d9a441] mt-1">{item.due_days_before} days before departure</p>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
