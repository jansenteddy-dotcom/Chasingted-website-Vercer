import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#133425] text-[#F5F0E4]">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl mb-3">Chasingted</h3>
            <p className="text-[#F5F0E4]/70 text-sm leading-relaxed">
              Small-group adventure expeditions to extraordinary destinations. Apply, get approved, and explore with like-minded travelers.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f7b500] mb-4 font-sans font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-[#F5F0E4]/80">
              <li><Link href="/trips" className="hover:text-[#F5F0E4] transition-colors">All Trips</Link></li>
              <li><Link href="/about" className="hover:text-[#F5F0E4] transition-colors">About Chasingted</Link></li>
              <li><Link href="/faq" className="hover:text-[#F5F0E4] transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#F5F0E4] transition-colors">Contact</Link></li>
              <li><Link href="/portal/login" className="hover:text-[#F5F0E4] transition-colors">Traveler Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#f7b500] mb-4 font-sans font-semibold">Get in touch</h4>
            <ul className="space-y-2 text-sm text-[#F5F0E4]/80">
              <li>
                <a href="mailto:info@chasingted.com" className="hover:text-[#F5F0E4] transition-colors">
                  info@chasingted.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/31600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F0E4] transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F5F0E4]/10 mt-12 pt-6 text-center text-xs text-[#F5F0E4]/40">
          © {new Date().getFullYear()} Chasingted. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
