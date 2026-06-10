'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [redirectTo, setRedirectTo] = useState('/portal/dashboard')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [mode, setMode] = useState<'login' | 'reset'>('login')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) setRedirectTo(redirect)
    if (params.get('error') === 'auth_failed') setError('Login link expired. Please sign in manually.')
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/portal/update-password`,
    })
    if (error) {
      setError('Could not send reset email. Check the address and try again.')
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#133425] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="text-[#F5F0E4] font-bold text-xl tracking-widest uppercase">
            Chasingted
          </Link>
          <p className="text-[#F5F0E4]/50 text-xs tracking-widest uppercase mt-2">Traveler Portal</p>
        </div>

        <div className="bg-[#F5F0E4] p-8">
          {mode === 'login' ? (
            <>
              <h1 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-6">Sign In</h1>
              {error && <p className="text-red-700 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                    className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
                    placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <button onClick={() => { setMode('reset'); setError('') }}
                className="mt-4 text-xs text-[#3a4a40]/70 hover:text-[#133425] w-full text-center">
                Forgot your password?
              </button>
            </>
          ) : (
            <>
              <h1 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-2">Reset Password</h1>
              <p className="text-xs text-[#3a4a40]/70 mb-6">Enter your email and we'll send you a reset link.</p>
              {resetSent ? (
                <p className="text-green-700 text-xs bg-green-50 border border-green-200 px-3 py-3">
                  Check your inbox — a reset link is on its way.
                </p>
              ) : (
                <>
                  {error && <p className="text-red-700 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1">Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]"
                        placeholder="you@example.com" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                      {loading ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              )}
              <button onClick={() => { setMode('login'); setError('') }}
                className="mt-4 text-xs text-[#3a4a40]/70 hover:text-[#133425] w-full text-center">
                ← Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
