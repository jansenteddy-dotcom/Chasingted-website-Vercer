# Chasingted — Session Summary
Date: 2026-06-07

---

## What we did in this session

### 1. Set up Google ADC (Application Default Credentials)
Claude can now access Google services (Sheets, Drive, Gmail, Tag Manager) automatically without you logging in every time.

**What was installed:**
- Google Cloud CLI (`gcloud`) — installed via Homebrew
- Google Python packages — `google-auth`, `google-auth-oauthlib`, `google-api-python-client`
- ADC credentials file saved at: `~/.config/gcloud/application_default_credentials.json`

**Google Cloud project used:**
- Project name: (new project created)
- Project ID: `velvety-carving-498712-j2`
- Account: `teddy@wespikegrowth.io`

**OAuth credentials (your own app):**
- App name: Claude Tools
- Client ID: `78335493563-mae1td8796pejmmmgo70tko66e1opq38.apps.googleusercontent.com`
- Credentials file: `~/Downloads/client_secret_78335493563-mae1td8796pejmmmgo70tko66e1opq38.apps.googleusercontent.com.json`

---

### 2. Analyzed chasingted.com for conversions
Visited the live site and identified all key conversion opportunities.

**Site:** chasingted.com — small-group adventure expeditions (€1,300–€4,000)
**Active trips:** Kyrgyzstan (€4,000), Oman (€2,000), Poland (€1,300)

---

### 3. Created a conversion tracking plan
File saved at: `chasingted/tracking-plan.md`

**7 conversion events defined:**

| Event | Priority | Google Ads |
|-------|----------|------------|
| `apply_now_clicked` | Primary | Yes |
| `application_submitted` | Primary | Yes |
| `whatsapp_clicked` | Primary | Yes |
| `contact_form_submitted` | Primary | Yes |
| `newsletter_signup` | Secondary | No |
| `email_link_clicked` | Secondary | Optional |
| `trip_page_viewed` | Micro | No |

---

### 4. Implemented tracking in Google Tag Manager
**GTM Container:** GTM-P7V9CJF3
**GA4 Property:** G-2DEC87PY9P

**Created via GTM API (automatically, no clicking):**
- 1 Google Tag (GA4 configuration for G-2DEC87PY9P)
- 8 triggers (All Pages, Apply Now click, WhatsApp click, Email click, Join Us form, Contact form, Newsletter form, Trip page view)
- 7 GA4 event tags (one per conversion event)
- Built-in variables enabled: Click URL, Click Text, Click Element, Form URL, etc.

**Status:** GTM container built and ready. Needs to be **published** in GTM UI (Submit button) and the GTM snippet needs to be **added to the WordPress site**.

---

### 5. GTM snippet — still needs to be added to WordPress

The GTM code is NOT yet on the chasingted.com website.

**Fix:** Install the **WPCode Lite** plugin in WordPress admin, then:

**Header code:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P7V9CJF3');</script>
<!-- End Google Tag Manager -->
```

**Body code:**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P7V9CJF3"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

---

## What still needs to happen (in order)

- [ ] **Publish GTM container** — go to tagmanager.google.com → Chasingted → click Submit → Publish
- [ ] **Add GTM snippet to WordPress** — install WPCode Lite plugin, add head + body code
- [ ] **Verify tags fire** — Claude can check once the snippet is live
- [ ] **Mark conversions in GA4** — Admin → Events → mark `apply_now_clicked`, `application_submitted`, `whatsapp_clicked`, `contact_form_submitted` as conversions
- [ ] **Import conversions into Google Ads** — Link GA4 to Google Ads and import the 4 primary conversion events

---

## Scripts created (in chasingted/ folder)

| File | Purpose |
|------|---------|
| `tracking-plan.md` | Full conversion tracking plan |
| `find_gtm_ids.py` | Finds GTM account/container IDs via API |
| `inspect_gtm.py` | Lists existing tags/triggers in container |
| `implement_tracking.py` | Creates triggers + Google Tag in GTM |
| `create_tags.py` | Creates all 7 GA4 event tags in GTM |
| `publish_gtm.py` | Publishes GTM container via API |

## If you need to re-run the ADC login

Run this in Claude Code (copy exactly, one line):
```
! /opt/homebrew/share/google-cloud-sdk/bin/gcloud auth application-default login --client-id-file="/Users/teddyjansen/Downloads/client_secret_78335493563-mae1td8796pejmmmgo70tko66e1opq38.apps.googleusercontent.com.json" --scopes=https://www.googleapis.com/auth/spreadsheets,https://www.googleapis.com/auth/drive,https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/tagmanager.readonly,https://www.googleapis.com/auth/tagmanager.edit.containers,https://www.googleapis.com/auth/tagmanager.publish,openid,https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/userinfo.profile
```
