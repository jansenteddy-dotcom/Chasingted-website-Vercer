'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/portal/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#133425] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-[#F5F0E4] font-bold text-xl tracking-widest uppercase">Chasingted</span>
          <p className="text-[#F5F0E4]/50 text-xs tracking-widest uppercase mt-2">Set Your Password</p>
        </div>
        <div className="bg-[#F5F0E4] p-8">
          <h1 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-2">Welcome to the portal</h1>
          <p className="text-xs text-[#3a4a40]/70 mb-6">Choose a password to access your expedition portal.</p>
          {error && <p className="text-red-700 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8}
                className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
              {loading ? 'Saving…' : 'Set Password & Enter Portal'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
