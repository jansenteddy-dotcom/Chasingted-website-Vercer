'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  nationality: string | null
  passport_number: string | null
  passport_expiry: string | null
  phone: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relation: string | null
  dietary_requirements: string | null
  medical_notes: string | null
  fitness_level: string | null
  bio: string | null
  avatar_url: string | null
}

export default function ProfileForm({ profile, userId }: { profile: Profile | null; userId: string }) {
  const [form, setForm] = useState({
    first_name: profile?.first_name ?? '',
    last_name: profile?.last_name ?? '',
    date_of_birth: profile?.date_of_birth ?? '',
    nationality: profile?.nationality ?? '',
    passport_number: profile?.passport_number ?? '',
    passport_expiry: profile?.passport_expiry ?? '',
    phone: profile?.phone ?? '',
    emergency_contact_name: profile?.emergency_contact_name ?? '',
    emergency_contact_phone: profile?.emergency_contact_phone ?? '',
    emergency_contact_relation: profile?.emergency_contact_relation ?? '',
    dietary_requirements: profile?.dietary_requirements ?? '',
    medical_notes: profile?.medical_notes ?? '',
    fitness_level: profile?.fitness_level ?? '',
    bio: profile?.bio ?? '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function resizeImage(file: File, maxSize = 400): Promise<Blob> {
    return new Promise((resolve) => {
      const img = document.createElement('img')
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.85)
      }
      img.src = url
    })
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const compressed = await resizeImage(file)
    const formData = new FormData()
    formData.append('file', new File([compressed], 'avatar.jpg', { type: 'image/jpeg' }))
    formData.append('userId', userId)
    const res = await fetch('/api/avatar', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) {
      setError(`Photo upload failed: ${data.error ?? 'unknown error'}`)
      setUploading(false)
      return
    }
    setAvatarUrl(data.url)
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({
      ...form,
      date_of_birth: form.date_of_birth || null,
      passport_expiry: form.passport_expiry || null,
      updated_at: new Date().toISOString(),
    }).eq('id', userId)
    if (error) { setError('Could not save. Try again.'); setSaving(false); return }
    setSaved(true)
    setSaving(false)
  }

  const inputCls = 'w-full border border-[#d4c5a0] bg-white px-3 py-2 text-sm text-[#133425] focus:outline-none focus:border-[#133425]'
  const labelCls = 'block text-xs font-bold uppercase tracking-widest text-[#133425] mb-1'
  const initials = `${form.first_name.charAt(0)}${form.last_name.charAt(0)}`.toUpperCase() || '?'

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {error && <p className="text-red-700 text-xs bg-red-50 border border-red-200 px-3 py-2">{error}</p>}

      {/* Avatar upload */}
      <div className="flex items-center gap-6">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-full overflow-hidden bg-[#133425] flex items-center justify-center shrink-0 group cursor-pointer">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Profile photo" fill className="object-cover" unoptimized />
          ) : (
            <span className="text-[#F5F0E4] font-bold text-xl">{initials}</span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>
        <div>
          <p className="font-bold text-sm text-[#133425]">Profile Photo</p>
          <p className="text-xs text-[#3a4a40]/60 mt-0.5">Visible to your fellow travelers</p>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="mt-2 text-xs font-bold uppercase tracking-widest text-[#133425] hover:underline disabled:opacity-50">
            {uploading ? 'Uploading…' : 'Change photo'}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Personal */}
      <section className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.first_name} onChange={e => set('first_name', e.target.value)} /></div>
          <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.last_name} onChange={e => set('last_name', e.target.value)} /></div>
          <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} /></div>
          <div><label className={labelCls}>Nationality</label><input className={inputCls} value={form.nationality} onChange={e => set('nationality', e.target.value)} /></div>
          <div><label className={labelCls}>Phone</label><input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+31 6 12345678" /></div>
          <div>
            <label className={labelCls}>Fitness Level</label>
            <select className={inputCls} value={form.fitness_level} onChange={e => set('fitness_level', e.target.value)}>
              <option value="">Select…</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelCls}>Short Bio <span className="text-[#3a4a40]/50 font-normal normal-case tracking-normal">(visible to fellow travelers)</span></label>
          <textarea rows={3} className={inputCls} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell your fellow travelers a little about yourself…" />
        </div>
      </section>

      {/* Passport */}
      <section className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-4">Passport</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Passport Number</label><input className={inputCls} value={form.passport_number} onChange={e => set('passport_number', e.target.value)} /></div>
          <div><label className={labelCls}>Expiry Date</label><input type="date" className={inputCls} value={form.passport_expiry} onChange={e => set('passport_expiry', e.target.value)} /></div>
        </div>
      </section>

      {/* Emergency contact */}
      <section className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-4">Emergency Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><label className={labelCls}>Full Name</label><input className={inputCls} value={form.emergency_contact_name} onChange={e => set('emergency_contact_name', e.target.value)} /></div>
          <div><label className={labelCls}>Phone</label><input type="tel" className={inputCls} value={form.emergency_contact_phone} onChange={e => set('emergency_contact_phone', e.target.value)} /></div>
          <div><label className={labelCls}>Relation</label><input className={inputCls} value={form.emergency_contact_relation} onChange={e => set('emergency_contact_relation', e.target.value)} placeholder="e.g. Partner, Parent" /></div>
        </div>
      </section>

      {/* Health */}
      <section className="bg-white border border-[#d4c5a0] p-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-[#133425] mb-1">Health & Dietary</h2>
        <p className="text-xs text-[#3a4a40]/60 mb-4">Only visible to the ChasingTed team — never shared with other travelers.</p>
        <div className="space-y-4">
          <div><label className={labelCls}>Dietary Requirements</label><input className={inputCls} value={form.dietary_requirements} onChange={e => set('dietary_requirements', e.target.value)} placeholder="e.g. Vegetarian, gluten-free, nut allergy" /></div>
          <div><label className={labelCls}>Medical Notes</label><textarea rows={3} className={inputCls} value={form.medical_notes} onChange={e => set('medical_notes', e.target.value)} placeholder="Any conditions, medications or physical limitations the ChasingTed team should know about" /></div>
        </div>
      </section>

      <button type="submit" disabled={saving}
        className="bg-[#133425] text-[#F5F0E4] font-bold text-xs tracking-widest uppercase px-10 py-3 hover:bg-[#3a4a40] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Profile'}
      </button>
    </form>
  )
}
