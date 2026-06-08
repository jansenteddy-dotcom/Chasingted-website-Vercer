import type {Metadata} from 'next'
import Link from 'next/link'
import GtmEvent from '@/app/components/GtmEvent'

export const metadata: Metadata = {
  title: 'Application received',
}

export default function ThankYouPage() {
  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      {/* Fires GTM trigger: application_submitted */}
      <GtmEvent event="application_submitted" />

      <div className="container max-w-xl text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="font-serif text-4xl text-[#133425] mb-4">Application received!</h1>
        <p className="text-[#3a4a40] text-lg mb-4 leading-relaxed">
          Thanks for applying. Teddy reviews every application personally and will get back to you within{' '}
          <strong>3–5 days</strong>.
        </p>
        <p className="text-[#3a4a40]/60 text-sm mb-10">
          You&apos;ll receive a confirmation email shortly. If you don&apos;t hear back within a week, feel free to reach out at{' '}
          <a href="mailto:info@chasingted.com" className="underline hover:text-[#133425]">
            info@chasingted.com
          </a>
          .
        </p>
        <Link
          href="/trips"
          className="inline-block border-2 border-[#133425] text-[#133425] font-semibold px-8 py-3 rounded hover:bg-[#133425] hover:text-[#F5F0E4] transition-colors duration-200"
        >
          Browse more trips
        </Link>
      </div>
    </div>
  )
}
