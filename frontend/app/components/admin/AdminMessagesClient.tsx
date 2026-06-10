'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function AdminMessagesClient({ threads }: { threads: any[] }) {
  const [active, setActive] = useState<string | null>(threads[0]?.key ?? null)
  const [localThreads, setLocalThreads] = useState(threads)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const activeThread = localThreads.find(t => t.key === active)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active, localThreads])

  async function send() {
    if (!input.trim() || !activeThread) return
    setSending(true)
    const msg = activeThread.messages[0]

    await supabase.from('messages').insert({
      booking_id: msg.booking_id,
      user_id: msg.user_id,
      body: input.trim(),
      is_from_admin: true,
    })

    // Mark unread traveler messages as read
    await supabase.from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('booking_id', msg.booking_id)
      .eq('is_from_admin', false)
      .is('read_at', null)

    setLocalThreads(prev => prev.map(t =>
      t.key === active
        ? {
            ...t,
            hasUnread: false,
            messages: [...t.messages, {
              id: Math.random().toString(),
              body: input.trim(),
              is_from_admin: true,
              created_at: new Date().toISOString(),
            }]
          }
        : t
    ))
    setInput('')
    setSending(false)
  }

  return (
    <div className="max-w-5xl">
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-6">Messages</h1>

      {!localThreads.length ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">No messages yet.</p>
        </div>
      ) : (
        <div className="flex gap-4 h-[600px]">
          {/* Thread list */}
          <div className="w-64 shrink-0 bg-white border border-gray-200 overflow-y-auto divide-y divide-gray-100">
            {localThreads.map(t => (
              <button key={t.key} onClick={() => setActive(t.key)}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-gray-50 ${active === t.key ? 'bg-[#133425] text-[#F5F0E4]' : ''}`}>
                <div className="flex items-center gap-2">
                  {t.hasUnread && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                  <p className={`font-bold text-xs truncate ${active === t.key ? 'text-[#F5F0E4]' : 'text-[#1a1a1a]'}`}>
                    {t.profile?.first_name} {t.profile?.last_name}
                  </p>
                </div>
                <p className={`text-xs truncate mt-0.5 ${active === t.key ? 'opacity-60' : 'text-gray-400'}`}>
                  {t.messages[t.messages.length - 1]?.body}
                </p>
              </button>
            ))}
          </div>

          {/* Message thread */}
          {activeThread && (
            <div className="flex-1 flex flex-col bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-xs uppercase tracking-widest text-[#1a1a1a]">
                  {activeThread.profile?.first_name} {activeThread.profile?.last_name}
                </p>
                <p className="text-xs text-gray-400">{activeThread.profile?.email}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {activeThread.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.is_from_admin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-sm px-4 py-2 text-sm ${msg.is_from_admin
                      ? 'bg-[#133425] text-[#F5F0E4]'
                      : 'bg-gray-100 text-[#1a1a1a]'}`}>
                      <p>{msg.body}</p>
                      <p className={`text-xs mt-1 ${msg.is_from_admin ? 'opacity-50' : 'text-gray-400'}`}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-gray-100 p-3 flex gap-2">
                <input
                  className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1a1a1a]"
                  placeholder="Type a reply…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                />
                <button onClick={send} disabled={sending || !input.trim()}
                  className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-6 py-2 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
