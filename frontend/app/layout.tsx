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
import {urlFor} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

const GTM_ID = 'GTM-P7V9CJF3'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})

  const defaultDescription =
    'Chasingted organises small-group adventure expeditions — max 10 travelers, expert local guides, extraordinary destinations worldwide. Based in Amsterdam.'

  return {
    metadataBase: new URL('https://chasingted.com'),
    title: {
      template: '%s | Chasingted',
      default: 'Chasingted — Small-Group Adventure Expeditions',
    },
    description: settings?.introText || defaultDescription,
    openGraph: {
      siteName: 'Chasingted',
      type: 'website',
      locale: 'en_US',
      images: settings?.ogImage?.asset ? [{url: (settings.ogImage as any).asset._ref}] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@chasingted',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {index: true, follow: true, 'max-image-preview': 'large'},
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
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})

  const logoUrl = settings?.logo?.asset ? urlFor(settings.logo).width(200).url() : undefined

  const footerSettings = {
    logoUrl,
    footerTagline: settings?.footerTagline ?? 'From somewhere to Somewhere.',
    footerSubtagline: settings?.footerSubtagline ?? 'Not a holiday. An expedition.',
    contactEmail: settings?.contactEmail ?? 'info@chasingted.com',
    contactPhone: settings?.contactPhone ?? '+31 6 55 82 55 37',
    contactLocation: settings?.contactLocation ?? 'Amsterdam — expeditions worldwide',
    instagramUrl: settings?.instagramUrl ?? 'https://instagram.com/chasingted.adventures',
    facebookUrl: settings?.facebookUrl ?? 'https://facebook.com/chasingted',
    youtubeUrl: settings?.youtubeUrl ?? 'https://youtube.com/@chasingted',
    tiktokUrl: settings?.tiktokUrl ?? 'https://tiktok.com/@chasingted',
  }

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
        {/* Organization structured data — tells Google who Chasingted is */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'Chasingted',
            url: 'https://chasingted.com',
            logo: 'https://chasingted.com/images/logo.png',
            description: 'Small-group adventure expeditions to extraordinary destinations. Max 10 travelers, expert local guides, no tourist shortcuts. Based in Amsterdam.',
            email: footerSettings.contactEmail,
            telephone: footerSettings.contactPhone,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Amsterdam',
              addressCountry: 'NL',
            },
            sameAs: [
              footerSettings.instagramUrl,
              footerSettings.facebookUrl,
              footerSettings.youtubeUrl,
              footerSettings.tiktokUrl,
            ],
          })}}
        />
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header logoUrl={logoUrl} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={footerSettings} />
      </body>
    </html>
  )
}
