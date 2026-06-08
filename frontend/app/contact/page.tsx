import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Chasingted.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container max-w-2xl">
        <h1 className="font-serif text-4xl md:text-5xl text-[#133425] mb-4">Get in touch</h1>
        <p className="text-[#3a4a40]/70 mb-12">
          Questions about a trip, or just want to say hello? Reach out via email or WhatsApp.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          <a
            href="mailto:info@chasingted.com"
            className="group flex items-center gap-4 p-6 border border-[#E7DBBF] rounded-xl hover:border-[#f7b500] transition-colors"
          >
            <div className="text-3xl">✉️</div>
            <div>
              <p className="font-semibold text-[#133425]">Email</p>
              <p className="text-sm text-[#3a4a40]/70 group-hover:text-[#f7b500] transition-colors">
                info@chasingted.com
              </p>
            </div>
          </a>

          <a
            href="https://wa.me/31600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-6 border border-[#E7DBBF] rounded-xl hover:border-[#f7b500] transition-colors"
          >
            <div className="text-3xl">💬</div>
            <div>
              <p className="font-semibold text-[#133425]">WhatsApp</p>
              <p className="text-sm text-[#3a4a40]/70 group-hover:text-[#f7b500] transition-colors">
                Message Teddy directly
              </p>
            </div>
          </a>
        </div>

        <div className="bg-[#F5F0E4] rounded-xl p-8">
          <h2 className="font-serif text-2xl text-[#133425] mb-3">Ready to apply?</h2>
          <p className="text-[#3a4a40]/70 mb-6 text-sm">
            If you have a specific trip in mind, go ahead and apply — it&apos;s free and takes 5 minutes.
            Teddy will review it and reply within 3–5 days.
          </p>
          <a
            href="/trips"
            className="inline-block bg-[#f7b500] text-[#133425] font-semibold px-6 py-3 rounded hover:bg-[#d9a441] transition-colors"
          >
            See all trips
          </a>
        </div>
      </div>
    </div>
  )
}
