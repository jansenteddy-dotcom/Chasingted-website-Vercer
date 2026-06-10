'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navLinks = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/trip', label: 'My Trip' },
  { href: '/portal/profile', label: 'Profile' },
]

export default function PortalNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <header className="bg-[#133425] text-[#F5F0E4] sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/portal/dashboard" className="font-bold text-sm tracking-widest uppercase shrink-0">
          Chasingted
        </Link>
        <nav className="flex items-center gap-5 md:gap-7">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-widest uppercase transition-opacity hidden sm:block ${
                pathname.startsWith(href) ? 'opacity-100 font-bold' : 'opacity-55 hover:opacity-100'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-xs tracking-widest uppercase opacity-55 hover:opacity-100 transition-opacity"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  )
}
