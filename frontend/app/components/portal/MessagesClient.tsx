'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type Message = { id: string; content: string; is_from_admin: boolean; created_at: string }

export default function MessagesClient({
  messages: initial, userId, tripSlug
}: { messages: Message[]; userId: string; tripSlug: string }) {
  const [messages, setMessages] = useState<Message[]>(initial)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)
    const { data, error } = await supabase.from('messages').insert({
      user_id: userId, trip_slug: tripSlug, content: text.trim(), is_from_admin: false
    }).select().single()
    if (!error && data) {
      setMessages(prev => [...prev, data])
      setText('')
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-[#d4c5a0] p-4 min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-xs text-[#3a4a40]/50 text-center my-auto">No messages yet — send the first one below.</p>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.is_from_admin ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
              m.is_from_admin
                ? 'bg-[#133425] text-[#F5F0E4]'
                : 'bg-[#d4c5a0] text-[#133425]'
            }`}>
              {m.is_from_admin && <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">ChasingTed</p>}
              <p>{m.content}</p>
              <p className={`text-xs mt-1 ${m.is_from_admin ? 'opacity-50' : 'text-[#3a4a40]/50'}`}>
                {new Date(m.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={text} onChange={e => setText(e.target.value)} placeholder="Type your message…"
          className="flex-1 border border-[#d4c5a0] bg-white px-3 py-2.5 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
        />
        <button type="submit" disabled={sending || !text.trim()}
          className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-[#3a4a40] transition-colors disabled:opacity-40">
          Send
        </button>
      </form>
    </div>
  )
}
