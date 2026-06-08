# Chasingted Website — Phase 1: Foundation + Public Website

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the Next.js 15 + Sanity project, deploy to Vercel Pro, define all Sanity content schemas, and build every public-facing page of the new chasingted.com.

**Architecture:** Next.js 15 App Router fetches content from Sanity using GROQ queries. All pages are server-rendered for SEO. Sanity Studio is embedded at `/studio`. Tailwind CSS handles styling to match the existing chasingted.com visual identity. The GitHub repo `Chasingted-website-Vercer` already exists — we scaffold the project into it.

**Tech Stack:** Next.js 15, TypeScript, Sanity.io (free tier), Tailwind CSS, `next-sanity`, `@sanity/image-url`, `react-hook-form`, Vercel Pro

**Spec reference:** `docs/superpowers/specs/2026-06-08-chasingted-website-design.md`

---

## Pre-flight: Account Setup (do this before any code)

- [ ] Create a Sanity account at sanity.io — free plan
- [ ] Create a Vercel account at vercel.com — upgrade to Pro ($20/month), required for commercial use
- [ ] Create a Resend account at resend.com — free plan (needed in Phase 3 but verify domain now)
- [ ] Create a Supabase account at supabase.com — free plan (needed in Phase 2)
- [ ] Note down: Sanity Project ID (shown after creating project), Sanity Dataset (default: `production`)

---

## File Structure

```
/                                        ← repo root (Chasingted-website-Vercer)
├── app/
│   ├── layout.tsx                       ← root layout: fonts, GTM snippet, nav, footer
│   ├── globals.css                      ← Tailwind base styles + chasingted colour tokens
│   ├── page.tsx                         ← Homepage
│   ├── trips/
│   │   ├── page.tsx                     ← All Trips listing
│   │   └── [slug]/
│   │       ├── page.tsx                 ← Trip Detail
│   │       └── apply/
│   │           └── page.tsx             ← Application Form
│   ├── apply/
│   │   └── thank-you/
│   │       └── page.tsx                 ← Thank You page
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── studio/
│   │   └── [[...tool]]/
│   │       └── page.tsx                 ← Sanity Studio (embedded)
│   └── api/
│       └── applications/
│           └── route.ts                 ← POST handler: save application to Sanity
├── components/
│   ├── Navigation.tsx                   ← Site header + mobile menu
│   ├── Footer.tsx                       ← Site footer
│   ├── TripCard.tsx                     ← Trip card used on listing page
│   └── ApplicationForm.tsx             ← Client component: application form
├── sanity/
│   ├── sanity.config.ts                 ← Sanity Studio config
│   ├── sanity.client.ts                 ← Sanity client (server-side reads)
│   ├── image.ts                         ← Image URL builder helper
│   ├── queries.ts                       ← All GROQ queries
│   └── schemaTypes/
│       ├── index.ts                     ← Exports all schemas
│       ├── trip.ts                      ← Trip document schema
│       ├── application.ts               ← Application document schema
│       ├── booking.ts                   ← Booking document schema
│       └── pages.ts                     ← Homepage / About / FAQ schemas
├── lib/
│   └── types.ts                         ← Shared TypeScript types
├── .env.local                           ← Local env vars (gitignored)
├── .env.example                         ← Template showing required vars
├── next.config.ts
├── tailwind.config.ts
└── sanity.cli.ts                        ← Sanity CLI config
```

---

## Task 1: Scaffold the Project

**Files:**
- Create: all root config files
- Modify: existing `README.md`

- [ ] **Step 1: Initialise from the official Sanity + Next.js clean template**

Run from inside the repo root:
```bash
npm create sanity@latest -- \
  --template sanity-io/sanity-template-nextjs-clean \
  --project chasingted \
  --dataset production \
  --output-path .
```
When prompted, sign in to Sanity with your account. Accept all defaults. This scaffolds Next.js 15 + Sanity Studio into the current directory.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @sanity/image-url react-hook-form
```

- [ ] **Step 3: Create `.env.local` with your credentials**

```bash
# .env.local  (never commit this file — it is already in .gitignore)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_write_token_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

To get `SANITY_API_TOKEN`: go to sanity.io/manage → your project → API → Tokens → Add API token → choose "Editor" permissions.

- [ ] **Step 4: Create `.env.example` (safe to commit)**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

- [ ] **Step 5: Verify the app starts**

```bash
npm run dev
```
Expected: site loads at http://localhost:3000 with the default Sanity template. Studio loads at http://localhost:3000/studio.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + Sanity project from clean template"
git push
```

---

## Task 2: Define Sanity Schemas

**Files:**
- Create: `sanity/schemaTypes/trip.ts`
- Create: `sanity/schemaTypes/application.ts`
- Create: `sanity/schemaTypes/booking.ts`
- Create: `sanity/schemaTypes/pages.ts`
- Modify: `sanity/schemaTypes/index.ts`

- [ ] **Step 1: Create `sanity/schemaTypes/trip.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'destination', title: 'Destination', type: 'string' }),
    defineField({ name: 'startDate', title: 'Start Date', type: 'date' }),
    defineField({ name: 'endDate', title: 'End Date', type: 'date' }),
    defineField({
      name: 'price', title: 'Price', type: 'object',
      fields: [
        defineField({ name: 'deposit', title: 'Deposit (€)', type: 'number' }),
        defineField({ name: 'total', title: 'Total Price (€)', type: 'number' }),
        defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'EUR' }),
      ]
    }),
    defineField({ name: 'maxGroupSize', title: 'Max Group Size', type: 'number' }),
    defineField({
      name: 'difficultyLevel', title: 'Difficulty Level', type: 'string',
      options: { list: ['easy', 'moderate', 'challenging', 'expert'], layout: 'radio' }
    }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['open', 'full', 'archived'], layout: 'radio' },
      initialValue: 'open'
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', title: 'Photo Gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'shortDescription', title: 'Short Description (shown on cards)', type: 'text', rows: 3 }),
    defineField({ name: 'fullDescription', title: 'Full Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'itinerary', title: 'Itinerary', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'day', title: 'Day', type: 'number' }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text' }),
        ]
      }]
    }),
    defineField({ name: 'included', title: "What's Included", type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'excluded', title: "What's Excluded", type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'packingList', title: 'Packing List (shown in portal)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'meetingPoint', title: 'Meeting Point (shown in portal)', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'destination', media: 'heroImage' }
  }
})
```

- [ ] **Step 2: Create `sanity/schemaTypes/application.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'application',
  title: 'Application',
  type: 'document',
  fields: [
    defineField({ name: 'trip', title: 'Trip', type: 'reference', to: [{ type: 'trip' }], validation: R => R.required() }),
    defineField({ name: 'firstName', title: 'First Name', type: 'string', validation: R => R.required() }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string', validation: R => R.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: R => R.required().email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'dateOfBirth', title: 'Date of Birth', type: 'date' }),
    defineField({ name: 'nationality', title: 'Nationality', type: 'string' }),
    defineField({
      name: 'experienceLevel', title: 'Experience Level', type: 'string',
      options: { list: ['beginner', 'some', 'experienced', 'expert'], layout: 'radio' }
    }),
    defineField({ name: 'motivation', title: 'Motivation', type: 'text', rows: 5 }),
    defineField({
      name: 'emergencyContact', title: 'Emergency Contact', type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
      ]
    }),
    defineField({ name: 'medicalInfo', title: 'Medical Info / Allergies', type: 'text', rows: 3 }),
    defineField({
      name: 'status', title: 'Status', type: 'string',
      options: { list: ['pending', 'approved', 'rejected'], layout: 'radio' },
      initialValue: 'pending'
    }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime', readOnly: true }),
    defineField({ name: 'reviewedAt', title: 'Reviewed At', type: 'datetime' }),
    defineField({ name: 'reviewNotes', title: 'Review Notes (internal)', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'firstName', subtitle: 'email', description: 'status' },
    prepare({ title, subtitle, description }) {
      return { title: `${title} — ${description?.toUpperCase()}`, subtitle }
    }
  }
})
```

- [ ] **Step 3: Create `sanity/schemaTypes/booking.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    defineField({ name: 'application', title: 'Application', type: 'reference', to: [{ type: 'application' }], validation: R => R.required() }),
    defineField({ name: 'trip', title: 'Trip', type: 'reference', to: [{ type: 'trip' }], validation: R => R.required() }),
    defineField({ name: 'depositPaid', title: 'Deposit Paid', type: 'boolean', initialValue: false }),
    defineField({ name: 'depositPaidDate', title: 'Deposit Paid Date', type: 'date' }),
    defineField({ name: 'balancePaid', title: 'Balance Paid', type: 'boolean', initialValue: false }),
    defineField({ name: 'balancePaidDate', title: 'Balance Paid Date', type: 'date' }),
    defineField({ name: 'balanceDueDate', title: 'Balance Due Date', type: 'date' }),
    defineField({ name: 'supabaseUserId', title: 'Supabase User ID', type: 'string', readOnly: true }),
    defineField({ name: 'portalAccessGranted', title: 'Portal Access Granted', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'application.firstName', subtitle: 'trip.title' },
    prepare({ title, subtitle }) {
      return { title: `Booking: ${title}`, subtitle }
    }
  }
})
```

- [ ] **Step 4: Create `sanity/schemaTypes/pages.ts`**

```typescript
import { defineField, defineType } from 'sanity'

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'string' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'introText', title: 'Intro Text', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'featuredTrips', title: 'Featured Trips', type: 'array', of: [{ type: 'reference', to: [{ type: 'trip' }] }] }),
  ]
})

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
  ]
})

export const faqPageType = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  fields: [
    defineField({
      name: 'items', title: 'FAQ Items', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string' }),
          defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
        ]
      }]
    })
  ]
})
```

- [ ] **Step 5: Register all schemas in `sanity/schemaTypes/index.ts`**

```typescript
import tripType from './trip'
import applicationType from './application'
import bookingType from './booking'
import { homepageType, aboutPageType, faqPageType } from './pages'

export const schemaTypes = [tripType, applicationType, bookingType, homepageType, aboutPageType, faqPageType]
```

- [ ] **Step 6: Verify schemas load in Studio**

```bash
npm run dev
```
Open http://localhost:3000/studio — you should see Trip, Application, Booking, Homepage, About Page, FAQ Page in the sidebar. Click into Trip and verify all fields appear.

- [ ] **Step 7: Commit**

```bash
git add sanity/schemaTypes/
git commit -m "feat: add Sanity schemas for trip, application, booking, and pages"
```

---

## Task 3: Sanity Client + GROQ Queries

**Files:**
- Create: `sanity/sanity.client.ts`
- Create: `sanity/image.ts`
- Create: `sanity/queries.ts`
- Create: `lib/types.ts`

- [ ] **Step 1: Create `sanity/sanity.client.ts`**

```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

- [ ] **Step 2: Create `sanity/image.ts`**

```typescript
import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { client } from './sanity.client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
```

- [ ] **Step 3: Create `lib/types.ts`**

```typescript
export type Trip = {
  _id: string
  title: string
  slug: { current: string }
  destination: string
  startDate: string
  endDate: string
  price: { deposit: number; total: number; currency: string }
  maxGroupSize: number
  difficultyLevel: 'easy' | 'moderate' | 'challenging' | 'expert'
  status: 'open' | 'full' | 'archived'
  heroImage: any
  gallery: any[]
  shortDescription: string
  fullDescription: any[]
  itinerary: { day: number; title: string; description: string }[]
  included: string[]
  excluded: string[]
  packingList: any[]
  meetingPoint: string
}

export type ApplicationFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  experienceLevel: string
  motivation: string
  emergencyContactName: string
  emergencyContactPhone: string
  medicalInfo: string
}
```

- [ ] **Step 4: Create `sanity/queries.ts`**

```typescript
import { groq } from 'next-sanity'
import { client } from './sanity.client'
import { Trip } from '@/lib/types'

const tripFields = groq`
  _id, title, slug, destination, startDate, endDate,
  price, maxGroupSize, difficultyLevel, status,
  heroImage, gallery, shortDescription, fullDescription,
  itinerary, included, excluded, packingList, meetingPoint
`

export async function getAllTrips(): Promise<Trip[]> {
  return client.fetch(groq`*[_type == "trip" && status != "archived"] | order(startDate asc) { ${tripFields} }`)
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  return client.fetch(groq`*[_type == "trip" && slug.current == $slug][0] { ${tripFields} }`, { slug })
}

export async function getFeaturedTrips(): Promise<Trip[]> {
  return client.fetch(groq`
    *[_type == "homepage"][0] {
      "trips": featuredTrips[]-> { ${tripFields} }
    }.trips
  `)
}

export async function getHomepage() {
  return client.fetch(groq`*[_type == "homepage"][0] { heroHeading, heroSubheading, heroImage, introText }`)
}

export async function getAboutPage() {
  return client.fetch(groq`*[_type == "aboutPage"][0] { heading, content, photo }`)
}

export async function getFaqPage() {
  return client.fetch(groq`*[_type == "faqPage"][0] { items }`)
}
```

- [ ] **Step 5: Commit**

```bash
git add sanity/sanity.client.ts sanity/image.ts sanity/queries.ts lib/types.ts
git commit -m "feat: add Sanity client, image builder, and GROQ queries"
```

---

## Task 4: Global Layout, Navigation, and Footer

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/Navigation.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Set colour tokens in `app/globals.css`**

Replace the existing globals.css content with:
```css
@import "tailwindcss";

:root {
  /* Match chasingted.com colours — update hex values to match exact brand colours */
  --color-primary: #1a1a2e;
  --color-accent: #e8b84b;
  --color-bg: #ffffff;
  --color-text: #1a1a2e;
  --color-muted: #6b7280;
}

body {
  color: var(--color-text);
  background: var(--color-bg);
}
```
**Note for Teddy:** Replace the hex values with the exact colours from your current chasingted.com site. Use the browser colour picker (Chrome DevTools → eyedropper) to get them.

- [ ] **Step 2: Create `components/Navigation.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          CHASINGTED
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/trips">Trips</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/portal/login" className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-full hover:opacity-90 transition">
            My Portal
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-800" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/trips" onClick={() => setOpen(false)}>Trips</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/faq" onClick={() => setOpen(false)}>FAQ</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/portal/login" onClick={() => setOpen(false)}>My Portal</Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Create `components/Footer.tsx`**

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-lg mb-2">CHASINGTED</p>
          <p className="text-gray-400 text-sm">Small-group adventure expeditions for those who want more than a holiday.</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/trips" className="hover:text-white transition">All Trips</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/faq" className="hover:text-white transition">FAQ</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold mb-3">Your Account</p>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link href="/portal/login" className="hover:text-white transition">Portal Login</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Chasingted. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Update `app/layout.tsx` to use Navigation and Footer**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Chasingted — Adventure Expeditions', template: '%s | Chasingted' },
  description: 'Small-group adventure expeditions. Join like-minded travellers on unforgettable expeditions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify layout renders**

```bash
npm run dev
```
Open http://localhost:3000 — navigation should appear at the top, footer at the bottom.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx components/
git commit -m "feat: add global layout with navigation and footer"
```

---

## Task 5: TripCard Component

**Files:**
- Create: `components/TripCard.tsx`

- [ ] **Step 1: Create `components/TripCard.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Trip } from '@/lib/types'
import { urlFor } from '@/sanity/image'

type Props = { trip: Trip }

export default function TripCard({ trip }: Props) {
  const imageUrl = trip.heroImage ? urlFor(trip.heroImage).width(600).height(400).url() : null

  return (
    <Link href={`/trips/${trip.slug.current}`} className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="relative h-56 bg-gray-100">
        {imageUrl && (
          <Image src={imageUrl} alt={trip.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
          trip.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trip.status === 'open' ? 'Open' : 'Full'}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{trip.destination}</p>
        <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{trip.shortDescription}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-[var(--color-accent)]">From €{trip.price?.deposit} deposit</span>
          <span className="text-gray-400">{trip.maxGroupSize} max</span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TripCard.tsx
git commit -m "feat: add TripCard component"
```

---

## Task 6: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from 'next-sanity'
import TripCard from '@/components/TripCard'
import { getHomepage, getFeaturedTrips } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

export const revalidate = 60

export default async function HomePage() {
  const [homepage, featuredTrips] = await Promise.all([getHomepage(), getFeaturedTrips()])

  const heroUrl = homepage?.heroImage ? urlFor(homepage.heroImage).width(1400).height(700).url() : null

  return (
    <>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center text-white">
        {heroUrl && <Image src={heroUrl} alt="Hero" fill className="object-cover" priority />}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {homepage?.heroHeading ?? 'Adventure Awaits'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {homepage?.heroSubheading ?? 'Small-group expeditions for those who want more than a holiday'}
          </p>
          <Link href="/trips" className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-full text-lg hover:opacity-90 transition">
            See All Trips
          </Link>
        </div>
      </section>

      {/* Intro */}
      {homepage?.introText && (
        <section className="max-w-3xl mx-auto px-4 py-20 text-lg leading-relaxed text-center prose prose-lg">
          <PortableText value={homepage.introText} />
        </section>
      )}

      {/* Featured Trips */}
      {featuredTrips?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Featured Expeditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTrips.map(trip => <TripCard key={trip._id} trip={trip} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/trips" className="inline-block px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-full hover:bg-[var(--color-primary)] hover:text-white transition">
              View All Trips
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
```

- [ ] **Step 2: Add a test trip in Sanity Studio and verify homepage**

Open http://localhost:3000/studio → Trip → New trip. Fill in title, slug (click Generate), destination, status = open, short description, and upload a photo. Save. Refresh http://localhost:3000 — the trip should appear in featured trips if you also add it to the Homepage document.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build homepage with hero, intro text, and featured trips"
```

---

## Task 7: All Trips Page

**Files:**
- Create: `app/trips/page.tsx`

- [ ] **Step 1: Create `app/trips/page.tsx`**

```tsx
import { Metadata } from 'next'
import TripCard from '@/components/TripCard'
import { getAllTrips } from '@/sanity/queries'

export const revalidate = 60
export const metadata: Metadata = { title: 'All Trips' }

export default async function TripsPage() {
  const trips = await getAllTrips()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">All Expeditions</h1>
      <p className="text-gray-500 mb-12">Small-group adventures. Pick your next expedition.</p>
      {trips.length === 0 ? (
        <p className="text-gray-400">No trips available right now. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => <TripCard key={trip._id} trip={trip} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Open http://localhost:3000/trips — your test trip should appear.

- [ ] **Step 3: Commit**

```bash
git add app/trips/page.tsx
git commit -m "feat: build all trips listing page"
```

---

## Task 8: Trip Detail Page

**Files:**
- Create: `app/trips/[slug]/page.tsx`

- [ ] **Step 1: Create `app/trips/[slug]/page.tsx`**

```tsx
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { getTripBySlug, getAllTrips } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

export const revalidate = 60

export async function generateStaticParams() {
  const trips = await getAllTrips()
  return trips.map(t => ({ slug: t.slug.current }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = await getTripBySlug(params.slug)
  return { title: trip?.title ?? 'Trip' }
}

export default async function TripDetailPage({ params }: { params: { slug: string } }) {
  const trip = await getTripBySlug(params.slug)
  if (!trip) notFound()

  const heroUrl = trip.heroImage ? urlFor(trip.heroImage).width(1400).height(600).url() : null
  const isFull = trip.status === 'full'

  return (
    <article className="max-w-4xl mx-auto px-4 pb-20">
      {/* Hero */}
      {heroUrl && (
        <div className="relative h-80 md:h-[500px] rounded-3xl overflow-hidden mb-10 -mx-4 md:mx-0">
          <Image src={heroUrl} alt={trip.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{trip.destination}</p>
          <h1 className="text-4xl font-bold mb-3">{trip.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>📅 {trip.startDate} → {trip.endDate}</span>
            <span>👥 Max {trip.maxGroupSize} people</span>
            <span>⛰ {trip.difficultyLevel}</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 min-w-[220px]">
          <p className="text-sm text-gray-500 mb-1">From</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] mb-1">€{trip.price?.deposit}</p>
          <p className="text-xs text-gray-400 mb-4">deposit · total €{trip.price?.total}</p>
          {isFull ? (
            <div className="text-center py-3 bg-red-50 text-red-600 rounded-xl font-semibold">Trip Full</div>
          ) : (
            <Link href={`/trips/${trip.slug.current}/apply`} className="block text-center py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold hover:opacity-90 transition">
              Apply Now
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      {trip.fullDescription && (
        <section className="prose prose-lg mb-12">
          <PortableText value={trip.fullDescription} />
        </section>
      )}

      {/* Itinerary */}
      {trip.itinerary?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
          <div className="space-y-4">
            {trip.itinerary.map(item => (
              <div key={item.day} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="font-bold text-[var(--color-accent)] min-w-[60px]">Day {item.day}</span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Included / Excluded */}
      {(trip.included?.length > 0 || trip.excluded?.length > 0) && (
        <section className="mb-12 grid md:grid-cols-2 gap-6">
          {trip.included?.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">✅ What's Included</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {trip.included.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          )}
          {trip.excluded?.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">❌ Not Included</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {trip.excluded.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      {!isFull && (
        <div className="text-center py-10 bg-gray-50 rounded-3xl">
          <h2 className="text-2xl font-bold mb-2">Ready to join?</h2>
          <p className="text-gray-500 mb-6">Submit your application — we'll get back to you within 3–5 days.</p>
          <Link href={`/trips/${trip.slug.current}/apply`} className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-full text-lg hover:opacity-90 transition">
            Apply for This Trip
          </Link>
        </div>
      )}
    </article>
  )
}
```

- [ ] **Step 2: Verify**

Click on your test trip from http://localhost:3000/trips — detail page should load with all sections.

- [ ] **Step 3: Commit**

```bash
git add app/trips/[slug]/page.tsx
git commit -m "feat: build trip detail page with itinerary and apply CTA"
```

---

## Task 9: Application Form + Thank You Page

**Files:**
- Create: `components/ApplicationForm.tsx`
- Create: `app/trips/[slug]/apply/page.tsx`
- Create: `app/apply/thank-you/page.tsx`
- Create: `app/api/applications/route.ts`

- [ ] **Step 1: Create the API route `app/api/applications/route.ts`**

This receives the form data and saves it to Sanity as a new Application document.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { tripId, firstName, lastName, email, phone, dateOfBirth, nationality,
          experienceLevel, motivation, emergencyContactName, emergencyContactPhone, medicalInfo } = body

  if (!tripId || !firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await writeClient.create({
    _type: 'application',
    trip: { _type: 'reference', _ref: tripId },
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    nationality,
    experienceLevel,
    motivation,
    emergencyContact: { name: emergencyContactName, phone: emergencyContactPhone },
    medicalInfo,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Create `components/ApplicationForm.tsx`**

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { ApplicationFormData } from '@/lib/types'

type Props = { tripId: string; tripTitle: string }

export default function ApplicationForm({ tripId, tripTitle }: Props) {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>()

  const onSubmit = async (data: ApplicationFormData) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tripId }),
    })
    if (res.ok) router.push('/apply/thank-you')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input {...register('firstName', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name *</label>
          <input {...register('lastName', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input type="email" {...register('email', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input {...register('phone')} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input type="date" {...register('dateOfBirth')} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nationality</label>
          <input {...register('nationality')} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <select {...register('experienceLevel')} className="w-full border rounded-lg px-3 py-2 text-sm">
          <option value="">Select...</option>
          <option value="beginner">Beginner — this is my first adventure trip</option>
          <option value="some">Some experience — I've done a few trips</option>
          <option value="experienced">Experienced — I travel adventurously regularly</option>
          <option value="expert">Expert — I lead or guide trips myself</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Why do you want to join this trip? *</label>
        <textarea {...register('motivation', { required: 'Please tell us a bit about yourself' })} rows={5} className="w-full border rounded-lg px-3 py-2 text-sm" />
        {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation.message}</p>}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-semibold mb-3">Emergency Contact</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input {...register('emergencyContactName')} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input {...register('emergencyContactPhone')} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Medical info / allergies (optional)</label>
        <textarea {...register('medicalInfo')} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50">
        {isSubmitting ? 'Submitting…' : `Submit Application for ${tripTitle}`}
      </button>
    </form>
  )
}
```

- [ ] **Step 3: Create `app/trips/[slug]/apply/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTripBySlug } from '@/sanity/queries'
import ApplicationForm from '@/components/ApplicationForm'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = await getTripBySlug(params.slug)
  return { title: `Apply for ${trip?.title ?? 'Trip'}` }
}

export default async function ApplyPage({ params }: { params: { slug: string } }) {
  const trip = await getTripBySlug(params.slug)
  if (!trip) notFound()
  if (trip.status === 'full') return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">This trip is full</h1>
      <p className="text-gray-500">Sorry, there are no spots left for {trip.title}.</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Apply for {trip.title}</h1>
      <p className="text-gray-500 mb-8">Fill in the form below. We'll review your application and reply within 3–5 days.</p>
      <ApplicationForm tripId={trip._id} tripTitle={trip.title} />
    </div>
  )
}
```

- [ ] **Step 4: Create `app/apply/thank-you/page.tsx`**

```tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Application Received' }

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-4xl font-bold mb-4">Application Received!</h1>
      <p className="text-lg text-gray-600 mb-4">
        Thank you for applying. We've received your application and will review it carefully.
      </p>
      <p className="text-gray-500 mb-10">
        Expect a reply from us within <strong>3–5 working days</strong>. Check your inbox (and spam folder) for an email from info@chasingted.com.
      </p>
      <Link href="/trips" className="inline-block px-6 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-full hover:opacity-90 transition">
        Explore More Trips
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Test the full application flow**

1. Go to http://localhost:3000/trips → click your test trip → click Apply Now
2. Fill in the form and submit
3. You should land on the Thank You page
4. Check Sanity Studio → Applications → a new pending application should appear

- [ ] **Step 6: Commit**

```bash
git add app/trips/[slug]/apply/ app/apply/ app/api/ components/ApplicationForm.tsx
git commit -m "feat: build application form, API route, and thank you page"
```

---

## Task 10: About, Contact, and FAQ Pages

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/contact/page.tsx`
- Create: `app/faq/page.tsx`

- [ ] **Step 1: Create `app/about/page.tsx`**

```tsx
import { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { getAboutPage } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

export const revalidate = 3600
export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const page = await getAboutPage()

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10">{page?.heading ?? 'About Chasingted'}</h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {page?.photo && (
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image src={urlFor(page.photo).width(600).height(800).url()} alt="About" fill className="object-cover" />
          </div>
        )}
        <div className="prose prose-lg">
          {page?.content && <PortableText value={page.content} />}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/contact/page.tsx`**

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
      <p className="text-gray-500 mb-10">Have a question before applying? We'd love to hear from you.</p>
      <div className="space-y-6 mb-12">
        <a href="mailto:info@chasingted.com" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
          <span className="text-2xl">📧</span>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-gray-500">info@chasingted.com</p>
          </div>
        </a>
        <a href="https://wa.me/31XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition" data-event="whatsapp_clicked">
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-semibold">WhatsApp</p>
            <p className="text-sm text-gray-500">Message us directly</p>
          </div>
        </a>
      </div>
    </div>
  )
}
```
**Note:** Replace `31XXXXXXXXX` with Teddy's actual WhatsApp number in international format (no + sign).

- [ ] **Step 3: Create `app/faq/page.tsx`**

```tsx
import { Metadata } from 'next'
import { getFaqPage } from '@/sanity/queries'

export const revalidate = 3600
export const metadata: Metadata = { title: 'FAQ' }

export default async function FaqPage() {
  const page = await getFaqPage()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">Frequently Asked Questions</h1>
      {page?.items?.length > 0 ? (
        <div className="space-y-6">
          {page.items.map((item: { question: string; answer: string }, i: number) => (
            <div key={i} className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
              <p className="text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">FAQ items coming soon. Add them in Sanity Studio → FAQ Page.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify all three pages load**

Visit http://localhost:3000/about, /contact, /faq — all should render without errors.

- [ ] **Step 5: Commit**

```bash
git add app/about/ app/contact/ app/faq/
git commit -m "feat: build about, contact, and FAQ pages"
```

---

## Task 11: GTM Integration

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add GTM snippet to `app/layout.tsx`**

The GTM container ID is `GTM-P7V9CJF3`. Add the script tag in `<head>` and the noscript tag immediately after `<body>`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Chasingted — Adventure Expeditions', template: '%s | Chasingted' },
  description: 'Small-group adventure expeditions. Join like-minded travellers on unforgettable expeditions.',
}

const GTM_ID = 'GTM-P7V9CJF3'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Navigation />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify GTM loads**

Run `npm run dev`. Open Chrome DevTools → Network tab → search for `gtm.js`. It should appear as a loaded resource.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: install GTM snippet (GTM-P7V9CJF3)"
```

---

## Task 12: Connect to Vercel + Deploy

- [ ] **Step 1: Push all code to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Connect Vercel to GitHub**

1. Log in at vercel.com
2. Click "Add New Project"
3. Import the `Chasingted-website-Vercer` repository
4. Framework: Next.js (auto-detected)

- [ ] **Step 3: Add environment variables in Vercel**

In the Vercel project settings → Environment Variables, add:
```
NEXT_PUBLIC_SANITY_PROJECT_ID    = your_project_id
NEXT_PUBLIC_SANITY_DATASET       = production
SANITY_API_TOKEN                 = your_token
NEXT_PUBLIC_BASE_URL             = https://chasingted-website-vercer.vercel.app
```

- [ ] **Step 4: Deploy**

Click Deploy. Wait for the build to complete (~2 minutes).

- [ ] **Step 5: Verify the live preview URL works**

Open the Vercel preview URL (e.g. `chasingted-website-vercer.vercel.app`). All public pages should load. Test the application form end-to-end on the live URL.

- [ ] **Step 6: Add CORS / allowed origins in Sanity**

Go to sanity.io/manage → your project → API → CORS Origins → Add `https://chasingted-website-vercer.vercel.app`. This allows the live site to talk to Sanity.

- [ ] **Step 7: Commit deployment notes**

```bash
git commit --allow-empty -m "chore: phase 1 deployed to Vercel preview"
```

---

## Task 13: Supabase Keep-Alive (prevent free tier pause)

**Files:**
- Create: `app/api/ping/route.ts`

- [ ] **Step 1: Create a simple ping route**

```typescript
// app/api/ping/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() })
}
```

- [ ] **Step 2: Set up a Vercel Cron Job**

Create `vercel.json` in the root:
```json
{
  "crons": [
    {
      "path": "/api/ping",
      "schedule": "0 9 * * *"
    }
  ]
}
```
This pings the site every day at 9am UTC — enough to keep Supabase awake. (Supabase keep-alive will be wired up in Phase 2 when Supabase is configured.)

- [ ] **Step 3: Commit**

```bash
git add app/api/ping/ vercel.json
git commit -m "chore: add daily ping cron to prevent Supabase free tier pause"
git push
```

---

## Phase 1 Complete ✅

After Phase 1, the following is live on Vercel:
- All 8 public pages (Homepage, Trips, Trip Detail, Apply, Thank You, About, Contact, FAQ)
- Sanity Studio at `/studio` — Teddy can add and edit trips
- Application form saving to Sanity
- GTM installed and firing
- GitHub auto-deploys on every push

**Next:** Phase 2 — Customer Portal (Supabase login, traveler profiles, portal pages)
