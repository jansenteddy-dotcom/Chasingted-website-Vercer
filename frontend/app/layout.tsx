import './globals.css'

import type {Metadata} from 'next'
import {Inter, Playfair_Display} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {handleError} from '@/app/client-utils'

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

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-[#1a1a1a] font-sans antialiased">
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
