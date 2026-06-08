'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

const navLinks = [
  {label: 'Trips', href: '/trips'},
  {label: 'About', href: '/about'},
  {label: 'FAQ', href: '/faq'},
  {label: 'Contact', href: '/contact'},
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#133425]/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="text-[#F5F0E4] font-serif text-xl md:text-2xl tracking-wide">
          Chasingted
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors duration-200 ${
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
            className="bg-[#f7b500] text-[#133425] text-sm font-semibold px-5 py-2 rounded hover:bg-[#d9a441] transition-colors duration-200"
          >
            Book a trip
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#F5F0E4] p-2"
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
        <div className="md:hidden bg-[#133425] border-t border-[#F5F0E4]/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base py-1 transition-colors ${
                pathname === link.href ? 'text-[#f7b500]' : 'text-[#F5F0E4]/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/trips"
            onClick={() => setMenuOpen(false)}
            className="bg-[#f7b500] text-[#133425] text-sm font-semibold px-5 py-2 rounded text-center mt-2"
          >
            Book a trip
          </Link>
        </div>
      )}
    </header>
  )
}
