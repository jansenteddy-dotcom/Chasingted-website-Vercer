'use client'

import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

const navLinks = [
  {label: 'HOME', href: '/'},
  {label: 'TRIPS', href: '/trips'},
  {label: 'ABOUT', href: '/about'},
  {label: 'STORIES', href: '/stories'},
  {label: 'FAQ', href: '/faq'},
  {label: 'JOIN US', href: '/contact'},
]

type Props = {
  logoUrl?: string
}

export default function Header({logoUrl}: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#133425]/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Chasingted"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <>
              <svg width="40" height="36" viewBox="0 0 40 36" fill="none" className="shrink-0">
                <path d="M20 2 L4 28 L20 22 L36 28 Z" stroke="#F5F0E4" strokeWidth="1.5" fill="none"/>
                <path d="M20 2 L20 22" stroke="#F5F0E4" strokeWidth="1.5"/>
                <path d="M8 32 L32 32" stroke="#F5F0E4" strokeWidth="1.5"/>
              </svg>
              <div>
                <div className="text-[#F5F0E4] font-sans font-bold text-lg tracking-widest uppercase leading-none">Chasingted</div>
                <div className="text-[#F5F0E4]/50 text-[8px] tracking-widest uppercase">What boundaries will you push?</div>
              </div>
            </>
          )}
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
