# Chasingted.com — Conversion Tracking Plan
Last updated: 2026-06-07

## Business Context
Chasingted sells high-value small-group adventure expeditions (€1,300–€4,000).
The sales process is personal — people apply, then Teddy qualifies them.
The goal of tracking is to know which ads and pages drive real trip inquiries.

---

## Tools
- **Google Analytics 4** — already installed
- **Google Tag Manager** — already installed
- **Google Ads** — conversion import from GA4

---

## Conversions — Priority Overview

| Priority | Event | Why it matters |
|----------|-------|----------------|
| 🔴 Primary | `apply_now_clicked` | Strongest signal of purchase intent |
| 🔴 Primary | `application_submitted` | Confirmed trip application |
| 🔴 Primary | `whatsapp_clicked` | Direct sales conversation started |
| 🔴 Primary | `contact_form_submitted` | Qualified lead generated |
| 🟡 Secondary | `newsletter_signup` | Top-of-funnel lead |
| 🟡 Secondary | `email_link_clicked` | Direct contact intent |
| ⚪ Micro | `trip_page_viewed` | Engagement / audience building |

---

## Event Details

### 1. apply_now_clicked
- **What it tracks:** Any "Apply Now" button click across the site
- **Trigger:** Click on any element containing text "Apply Now"
- **Properties:**
  - `click_location` — which page the click happened on
  - `trip_name` — trip name if visible in context
- **Use in Google Ads:** Yes — import as conversion

### 2. application_submitted
- **What it tracks:** Successful form submission on the Join Us / trip application page
- **Trigger:** Form submission success on `/join-us` page
- **Properties:**
  - `role` — selected role from dropdown
  - `page_location` — page URL
- **Use in Google Ads:** Yes — primary conversion, highest value

### 3. whatsapp_clicked
- **What it tracks:** Clicks on any WhatsApp button or link
- **Trigger:** Click on links containing `wa.me` or `api.whatsapp`
- **Properties:**
  - `click_location` — which page
  - `button_label` — text of the button clicked
- **Use in Google Ads:** Yes — import as conversion

### 4. contact_form_submitted
- **What it tracks:** Successful contact form submission on `/contact`
- **Trigger:** Form submission on contact page
- **Properties:**
  - `page_location` — URL
- **Use in Google Ads:** Yes — import as conversion

### 5. newsletter_signup
- **What it tracks:** Email newsletter subscription
- **Trigger:** Form submission on newsletter signup form
- **Properties:**
  - `page_location` — where they signed up
- **Use in Google Ads:** No — use in GA4 audiences only

### 6. email_link_clicked
- **What it tracks:** Clicks on `mailto:info@chasingted.com`
- **Trigger:** Click on links starting with `mailto:`
- **Properties:**
  - `click_location` — page URL
- **Use in Google Ads:** Optional

### 7. trip_page_viewed
- **What it tracks:** Views of individual trip/expedition pages
- **Trigger:** Page view on `/trips/*` URLs
- **Properties:**
  - `trip_name` — name from page title
  - `page_location` — full URL
- **Use in Google Ads:** No — use for remarketing audiences

---

## Google Ads Conversion Setup

| Conversion Action | Count | Attribution Window | Value |
|------------------|-------|-------------------|-------|
| apply_now_clicked | Once per session | 30 days | No value |
| application_submitted | Once per session | 30 days | No value |
| whatsapp_clicked | Once per session | 30 days | No value |
| contact_form_submitted | Once per session | 30 days | No value |

---

## GTM Implementation Plan

### Variables needed
- `dlv_trip_name` — Data Layer Variable for trip name
- `dlv_click_location` — Data Layer Variable for page location
- `dlv_role` — Data Layer Variable for application role
- `cv_click_url` — Built-in Click URL variable
- `cv_click_text` — Built-in Click Text variable
- `cv_page_url` — Built-in Page URL variable

### Triggers needed
- `trigger_apply_now_click` — Click trigger, click text contains "Apply Now"
- `trigger_whatsapp_click` — Click trigger, click URL contains "wa.me"
- `trigger_email_click` — Click trigger, click URL starts with "mailto:"
- `trigger_joinus_form_submit` — Form submit trigger on /join-us
- `trigger_contact_form_submit` — Form submit trigger on /contact
- `trigger_newsletter_submit` — Form submit trigger, newsletter form
- `trigger_trip_page` — Page view trigger, page URL matches /trips/

### Tags needed (GA4 Events)
- `tag_ga4_apply_now` — fires on apply_now_clicked trigger
- `tag_ga4_application_submitted` — fires on join-us form submit
- `tag_ga4_whatsapp` — fires on whatsapp click trigger
- `tag_ga4_contact_form` — fires on contact form submit
- `tag_ga4_newsletter` — fires on newsletter submit
- `tag_ga4_email_click` — fires on email click trigger
- `tag_ga4_trip_page` — fires on trip page view trigger

---

## GA4 Conversions to Mark

In GA4 Admin → Events → mark these as conversions:
- `apply_now_clicked`
- `application_submitted`
- `whatsapp_clicked`
- `contact_form_submitted`

---

## Next Step: GTM Implementation
All tags, triggers, and variables above will be created automatically
via the GTM API using your Google ADC credentials.
