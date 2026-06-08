import './globals.css'

import type {Metadata} from 'next'
import {Montserrat, Inter} from 'next/font/google'
import {draftMode} from 'next/headers'
import Script from 'next/script'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {handleError} from '@/app/client-utils'

const GTM_ID = 'GTM-P7V9CJF3'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})

  return {
    metadataBase: new URL('https://chasingted.com'),
    title: {
      template: '%s | Chasingted',
      default: 'Chasingted — Small-Group Adventure Expeditions',
    },
    description:
      settings?.introText ||
      'Chasingted organises small-group adventure expeditions to extraordinary destinations worldwide.',
    openGraph: {
      siteName: 'Chasingted',
      images: settings?.ogImage?.asset ? [{url: (settings.ogImage as any).asset._ref}] : [],
    },
  }
}

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      {/* GTM <head> snippet */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <body className="bg-[#f5f0e4] text-[#1a1a1a] font-sans antialiased">
        {/* GTM <noscript> fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
