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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) setRedirectTo(redirect)
    if (params.get('error') === 'auth_failed') setError('Login link expired. Please sign in manually.')
  }, [])

  function switchMode(next: 'login' | 'register' | 'reset') {
    setMode(next)
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/portal/dashboard`,
      },
    })
  }

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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/portal/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess('Check your inbox — we sent you a confirmation link. Click it to activate your account.')
    setLoading(false)
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
      setSuccess('Check your inbox — a reset link is on its way.')
    }
    setLoading(false)
  }

  const inputClass = 'w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]'
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1'

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

          {/* Tabs — only show for login/register */}
          {mode !== 'reset' && (
            <div className="flex mb-6 border-b border-[#d4c5a0]">
              <button
                onClick={() => switchMode('login')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  mode === 'login'
                    ? 'text-[#133425] border-b-2 border-[#133425] -mb-px'
                    : 'text-[#3a4a40]/50 hover:text-[#133425]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => switchMode('register')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                  mode === 'register'
                    ? 'text-[#133425] border-b-2 border-[#133425] -mb-px'
                    : 'text-[#3a4a40]/50 hover:text-[#133425]'
                }`}
              >
                Create Account & Sign In
              </button>
            </div>
          )}

          {error && <p className="text-red-700 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
          {success && <p className="text-green-700 text-xs mb-4 bg-green-50 border border-green-200 px-3 py-3">{success}</p>}

          {/* Sign In */}
          {mode === 'login' && !success && (
            <>
              <button type="button" onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-[#d4c5a0] bg-white px-4 py-2.5 text-sm text-[#133425] font-medium hover:bg-gray-50 transition-colors mb-4">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#d4c5a0]" />
                <span className="text-xs text-[#133425]/40 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-[#d4c5a0]" />
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                    className={inputClass} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>
              <button onClick={() => switchMode('reset')}
                className="mt-4 text-xs text-[#3a4a40]/70 hover:text-[#133425] w-full text-center">
                Forgot your password?
              </button>
            </>
          )}

          {/* Create Account */}
          {mode === 'register' && !success && (
            <>
              <button type="button" onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-[#d4c5a0] bg-white px-4 py-2.5 text-sm text-[#133425] font-medium hover:bg-gray-50 transition-colors mb-4">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#d4c5a0]" />
                <span className="text-xs text-[#133425]/40 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-[#d4c5a0]" />
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password"
                    className={inputClass} placeholder="At least 8 characters" />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password"
                    className={inputClass} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                  {loading ? 'Creating account…' : 'Create Account & Sign In'}
                </button>
              </form>
            </>
          )}

          {/* Reset Password */}
          {mode === 'reset' && (
            <>
              <h1 className="font-bold text-sm uppercase tracking-widest text-[#133425] mb-2">Reset Password</h1>
              <p className="text-xs text-[#3a4a40]/70 mb-6">Enter your email and we'll send you a reset link.</p>
              {!success && (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className={inputClass} placeholder="you@example.com" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
              )}
              <button onClick={() => switchMode('login')}
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
