# Chasingted Website — Design Specification
**Date:** 2026-06-08  
**Project:** Rebuild of chasingted.com (adventure travel, small-group expeditions)  
**Owner:** Teddy Jansen

---

## 1. Project Overview

A full rebuild of chasingted.com from WordPress to a modern Next.js stack. The new site keeps the same visual identity (colours, photography, tone) but adds a customer portal where booked travelers can log in, see their trip details, and see who else is going. The backend moves from WordPress to Sanity Studio — a clean, easy-to-use content dashboard where Teddy manages trips, reviews applications, and tracks bookings.

**Business context:** Chasingted sells small-group adventure expeditions priced at €1,300–€4,000 per trip. The booking flow is: apply → Teddy approves → bank transfer deposit → portal access granted → balance paid before departure.

---

## 2. Tech Stack

| Tool | Role | Cost |
|---|---|---|
| **Next.js 15** | Website framework (builds all pages) | Free |
| **Sanity.io** | Content management (trips, applications, bookings, pages) | Free tier |
| **Supabase** | User accounts, traveler profiles, portal access | Free tier |
| **Vercel Pro** | Hosting + automatic deployment from GitHub | $20/month |
| **GitHub** | Version control (already set up: `Chasingted-website-Vercer`) | Free |
| **Resend** | Transactional email (all automated emails) | Free tier (3,000/month) |
| **Google Tag Manager** | Conversion tracking for Google Ads | Free (already configured) |

**Why Next.js 15 (not 16):** A known bug in Next.js 16 combined with Sanity causes excessive API requests and cost spikes. Stay on 15 until resolved.

**Why Vercel Pro (not Hobby):** Chasingted is a commercial site. Vercel's Hobby plan explicitly prohibits commercial use.

**Supabase free tier note:** Free projects pause after 1 week of inactivity. Mitigation: set up a scheduled ping (cron job) to keep the database awake. Upgrade to Pro ($25/month) only if needed.

---

## 3. Pages

### 3a. Public Website (visible to everyone)

| Page | URL | Description |
|---|---|---|
| Homepage | `/` | Hero image, intro text, featured trips grid |
| All Trips | `/trips` | Cards for every open expedition |
| Trip Detail | `/trips/[slug]` | Full trip info: itinerary, dates, price, photos, apply button |
| Application Form | `/trips/[slug]/apply` | Application form for a specific trip |
| Thank You | `/apply/thank-you` | Shown after submitting. Confirms receipt, sets response time expectation |
| About | `/about` | Story behind Chasingted, Teddy's background |
| Contact | `/contact` | Contact form + WhatsApp link |
| FAQ | `/faq` | Common questions, editable in Sanity |

### 3b. Customer Portal (login required)

| Page | URL | Description |
|---|---|---|
| Login / Sign Up | `/portal/login` | Email + password. No self-signup — accounts are created only via the magic link Resend sends after deposit is confirmed. Returning users log in with email + password. |
| My Trip | `/portal/trip` | Trip name, dates, meeting point, packing list, countdown |
| Fellow Travelers | `/portal/travelers` | Profile cards of others on the same trip |
| My Profile | `/portal/profile` | Edit personal info, photo, bio, languages, experience level |
| Payment Status | `/portal/payment` | Shows deposit paid ✅ / balance due (amount + due date) |

### 3c. Admin (Teddy only)

| Area | URL | Description |
|---|---|---|
| Sanity Studio | `/studio` | Full content management dashboard, password protected |

---

## 4. Architecture

```
Visitor / Teddy
     │
     ▼
Vercel (hosts the site, auto-deploys from GitHub)
     │
     ├── Next.js 15 (renders all pages)
     │        ├── fetches trip/page content from Sanity
     │        ├── handles auth via Supabase
     │        └── triggers emails via Resend
     │
     ├── Sanity Studio (/studio)
     │        └── Teddy manages trips, applications, bookings, pages
     │
     ├── Supabase (database)
     │        └── user accounts, traveler profiles, portal access records
     │
     └── Google Tag Manager (GTM-P7V9CJF3)
              └── tracks conversions for Google Ads
```

**DNS setup when going live:**
- Update A/CNAME records to point to Vercel
- Leave MX records untouched (email stays with current WordPress host)

---

## 5. Content Model — Sanity

### Trip
- `title` (text)
- `slug` (URL-friendly version of title)
- `destination` (text)
- `startDate` / `endDate` (date)
- `price` (object: `deposit`, `total`, `currency`)
- `maxGroupSize` (number)
- `currentBookings` (number — not stored; calculated at query time by counting approved Bookings for this trip)
- `difficultyLevel` (easy / moderate / challenging / expert)
- `status` (open / full / archived)
- `heroImage` (image)
- `gallery` (array of images)
- `shortDescription` (text — shown on trip cards)
- `fullDescription` (rich text)
- `itinerary` (array of day objects: `day`, `title`, `description`)
- `included` / `excluded` (arrays of text items)
- `packingList` (rich text — shown in portal)
- `meetingPoint` (text — shown in portal)

### Application
- `trip` (reference to Trip)
- `firstName` / `lastName`
- `email`
- `phone`
- `dateOfBirth`
- `nationality`
- `experienceLevel`
- `motivation` (long text)
- `emergencyContact` (name + phone)
- `medicalInfo` (text)
- `status` (pending / approved / rejected)
- `submittedAt` (datetime)
- `reviewedAt` (datetime)
- `reviewNotes` (internal notes for Teddy)

### Booking
- `application` (reference to Application)
- `trip` (reference to Trip)
- `depositPaid` (boolean)
- `depositPaidDate` (date)
- `balancePaid` (boolean)
- `balancePaidDate` (date)
- `balanceDueDate` (date)
- `supabaseUserId` (string — links to Supabase account)
- `portalAccessGranted` (boolean)

### Page (editable content)
- Homepage: hero text, featured trips selection, intro paragraph
- About: full rich text + photos
- FAQ: array of question/answer pairs

---

## 6. Database Model — Supabase

### Table: `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | matches Supabase auth user id |
| `email` | text | |
| `first_name` | text | |
| `last_name` | text | |
| `date_of_birth` | date | |
| `nationality` | text | |
| `profile_photo_url` | text | |
| `bio` | text | short "about me" shown to fellow travelers |
| `languages` | text[] | array of languages spoken |
| `travel_experience` | text | beginner / some / experienced / expert |
| `created_at` | timestamp | |

### Table: `portal_access`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `user_id` | uuid | references `profiles.id` |
| `sanity_booking_id` | text | links back to Sanity booking record |
| `sanity_trip_id` | text | links to the trip |
| `granted_at` | timestamp | when Teddy marked deposit received |

---

## 7. Booking Flow (Step by Step)

1. **Visitor applies** — fills in application form on `/trips/[slug]/apply`
2. **Thank You page shown** — customer lands on `/apply/thank-you`
3. **Notification sent** — Resend emails info@chasingted.com: "New application from [Name] for [Trip]"
4. **Application stored** — saved in Sanity with status `pending`
5. **Teddy reviews** — opens Sanity Studio, reads application, clicks Approve or Reject
6. **If rejected** — Resend sends polite decline email to applicant. Flow ends.
7. **If approved** — Resend sends approval email to applicant with bank transfer details (IBAN, amount, reference)
8. **Teddy confirms deposit** — sees transfer in bank, clicks "Deposit received" in Sanity Studio
9. **Portal invite sent** — Resend sends email to customer with a magic link to create their portal account
10. **Customer sets up account** — sets password, fills in profile (photo, bio, languages etc.)
11. **Customer accesses portal** — sees trip details, packing list, fellow travelers' profiles
12. **Balance reminder** — Resend sends automated reminder email X weeks before departure date
13. **Teddy confirms balance** — clicks "Balance received" in Sanity Studio. Portal updates to "Fully paid ✅"

---

## 8. Email Notifications — Resend

All emails sent from `info@chasingted.com` via Resend. Inbox stays with current WordPress host — no migration needed.

| Trigger | Recipient | Email content |
|---|---|---|
| Application submitted | Teddy (info@chasingted.com) | New application alert with applicant name, trip, link to Sanity |
| Application submitted | Applicant | Confirmation: "We received your application, expect a reply within 3–5 days" |
| Teddy clicks Approve | Applicant | Approved + bank transfer details (IBAN, deposit amount, payment reference, deadline) |
| Teddy clicks Reject | Applicant | Polite decline |
| Teddy clicks Deposit Received | Applicant | Deposit confirmed + magic link to create portal account |
| X weeks before trip | Applicant | Balance reminder with bank details and due date |
| Teddy clicks Balance Received | Applicant | Balance confirmed, "See you on the trip!" |

**Email service:** Resend free tier (3,000 emails/month). Domain verification required for `chasingted.com`.

---

## 9. Google Tag Manager & Conversion Tracking

**Existing GTM container:** GTM-P7V9CJF3 (already configured with tags)  
**GA4 Property:** G-2DEC87PY9P

**Implementation:** Add GTM snippet to Next.js `_app` or root layout file. No rebuild of tags needed — container already has:
- Google Tag (GA4)
- Trigger: `application_submitted` — fires on Thank You page
- Trigger: `whatsapp_clicked` — fires on WhatsApp link click
- Trigger: `contact_form_submitted` — fires on Contact page submit
- Trigger: `apply_now_clicked` — fires on Apply button click

**After launch:**
1. Publish GTM container (Submit button in tagmanager.google.com)
2. Mark `application_submitted` as a conversion in GA4
3. Import that conversion into Google Ads

---

## 10. Deployment & DNS

### Initial setup order
1. Create Sanity project + connect to GitHub repo
2. Set up Next.js 15 with official Sanity template (`sanity-template-nextjs-clean`)
3. Configure Supabase project (free tier)
4. Configure Resend account + verify chasingted.com domain
5. Set all environment variables in Vercel (Sanity project ID, Supabase URL + keys, Resend API key)
6. Deploy to Vercel on a preview URL (e.g. `chasingted-website-vercer.vercel.app`)
7. Build and test all features on preview URL
8. Go live: update DNS A/CNAME records to Vercel, leave MX records untouched

### Environment variables needed (in Vercel)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

---

## 11. Visual Design

- Colours, typography, and overall look stays the same as current chasingted.com
- Photography provided by Teddy
- No Figma mockups required — rebuild matches existing site visually
- Application form fields to be confirmed separately (out of scope for this spec)

---

## 12. Out of Scope (for now)

- Online payment processing (Stripe) — designed to be added later without major changes
- Application form field adjustments — separate conversation
- Blog / content marketing pages — can be added to Sanity later
- Multi-language support

---

## 13. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Supabase free tier pauses after 7 days inactivity | Set up a daily cron ping to keep it alive |
| DNS change breaks email when going live | Only update A/CNAME, never touch MX records |
| Next.js 16 request overflow with Sanity | Stay on Next.js 15 until next-sanity v13 is released |
| URL structure changes break Google rankings | Keep all existing URL slugs identical during rebuild |
