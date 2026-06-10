'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  {label: 'HOME', href: '/'},
  {label: 'TRIPS', href: '/trips'},
  {label: 'ABOUT', href: '/about'},
  {label: 'STORIES', href: '/stories'},
  {label: 'FAQ', href: '/faq'},
  {label: 'JOIN US', href: '/contact'},
]

const portalLinks = [
  {label: 'My Dashboard', href: '/portal/dashboard'},
  {label: 'Checklist', href: '/portal/trip/checklist'},
  {label: 'Documents', href: '/portal/trip/documents'},
  {label: 'Messages', href: '/portal/trip/messages'},
  {label: 'My Profile', href: '/portal/profile'},
]

type Props = {
  logoUrl?: string
}

export default function Header({logoUrl}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<{ first_name?: string; avatar_url?: string; is_admin?: boolean } | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
    })
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(id: string) {
    const supabase = createClient()
    const {data} = await supabase.from('profiles').select('first_name, avatar_url, is_admin').eq('id', id).single()
    if (data) setProfile(data)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setDropdownOpen(false)
    setUser(null)
    setProfile(null)
    router.push('/')
    router.refresh()
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const initials = (profile?.first_name?.charAt(0) ?? user?.email?.charAt(0) ?? '?').toUpperCase()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#133425]/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoUrl ?? '/images/logo.png'}
            alt="Chasingted — Small-Group Adventure Expeditions"
            width={180}
            height={60}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-widest font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-[#f7b500]'
                  : 'text-[#F5F0E4]/80 hover:text-[#F5F0E4]'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/trips"
            className="bg-[#4e6358] text-[#F5F0E4] text-xs font-bold px-5 py-2.5 tracking-widest uppercase hover:bg-[#3a4a40] transition-colors duration-200"
          >
            Apply Now
          </Link>

          {/* Auth: avatar dropdown or My Trip link */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden bg-[#4e6358] flex items-center justify-center border-2 border-[#F5F0E4]/20 hover:border-[#F5F0E4]/60 transition-colors"
              >
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Profile" width={36} height={36} className="object-cover w-full h-full" unoptimized />
                ) : (
                  <span className="text-[#F5F0E4] text-xs font-bold">{initials}</span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-[#133425] border border-[#F5F0E4]/10 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#F5F0E4]/10 mb-1">
                    <p className="text-[#F5F0E4]/50 text-xs tracking-widest uppercase">My Portal</p>
                    {profile?.first_name && (
                      <p className="text-[#F5F0E4] text-sm font-bold mt-0.5">{profile.first_name}</p>
                    )}
                  </div>
                  {portalLinks.map(({label, href}) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDropdownOpen(false)}
                      className={`block px-4 py-2 text-xs tracking-widest uppercase transition-colors ${
                        pathname.startsWith(href)
                          ? 'text-[#f7b500]'
                          : 'text-[#F5F0E4]/70 hover:text-[#F5F0E4] hover:bg-[#F5F0E4]/5'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-[#F5F0E4]/10 mt-1 pt-1">
                    {profile?.is_admin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-xs tracking-widest uppercase text-[#f7b500]/80 hover:text-[#f7b500] hover:bg-[#F5F0E4]/5 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-xs tracking-widest uppercase text-[#F5F0E4]/40 hover:text-[#F5F0E4]/70 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/portal/login"
              className={`text-xs tracking-widest font-medium transition-colors duration-200 ${
                pathname?.startsWith('/portal')
                  ? 'text-[#f7b500]'
                  : 'text-[#F5F0E4]/80 hover:text-[#F5F0E4]'
              }`}
            >
              MY TRIP
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-[#F5F0E4] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#133425] border-t border-[#F5F0E4]/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm tracking-widest uppercase py-1 transition-colors ${
                pathname === link.href ? 'text-[#f7b500]' : 'text-[#F5F0E4]/80'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <div className="border-t border-[#F5F0E4]/10 pt-3">
                <p className="text-[#F5F0E4]/40 text-xs tracking-widest uppercase mb-2">My Portal</p>
                {portalLinks.map(({label, href}) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                    className="block text-sm tracking-widest uppercase py-1.5 text-[#F5F0E4]/70">
                    {label}
                  </Link>
                ))}
                {profile?.is_admin && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}
                    className="block text-sm tracking-widest uppercase py-1.5 text-[#f7b500]/80">
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => { setMenuOpen(false); signOut() }}
                  className="text-sm tracking-widest uppercase py-1.5 text-[#F5F0E4]/40 block mt-1">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/portal/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase py-1 text-[#F5F0E4]/80"
            >
              My Trip
            </Link>
          )}

          <Link
            href="/trips"
            onClick={() => setMenuOpen(false)}
            className="bg-[#4e6358] text-[#F5F0E4] text-xs font-bold px-5 py-3 tracking-widest uppercase text-center mt-2"
          >
            Apply Now
          </Link>
        </div>
      )}
    </header>
  )
}
