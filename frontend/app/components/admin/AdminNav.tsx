'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/invite', label: 'Invite Traveler' },
  { href: '/admin/messages', label: 'Messages' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="font-bold text-sm tracking-widest uppercase text-white">
            Chasingted
          </Link>
          <span className="text-xs bg-[#d9a441] text-[#133425] font-bold px-2 py-0.5 uppercase tracking-widest">Admin</span>
        </div>
        <nav className="flex items-center gap-5 md:gap-7">
          {navLinks.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`text-xs tracking-widest uppercase transition-opacity hidden sm:block ${active ? 'opacity-100 font-bold' : 'opacity-50 hover:opacity-100'}`}>
                {label}
              </Link>
            )
          })}
          <Link href="/" className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity hidden sm:block">
            View Site
          </Link>
          <button onClick={handleLogout} className="text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  )
}
