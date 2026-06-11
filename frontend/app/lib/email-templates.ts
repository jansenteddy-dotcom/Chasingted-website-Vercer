import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-09-25',
  useCdn: true,
})

type EmailTrip = {
  title: string
  slug: string
  destination: string
  startDate: string
  endDate: string
  price?: { deposit?: number; total?: number; currency?: string }
  imageRef?: string
}

function buildImageUrl(ref: string | undefined): string {
  if (!ref) return ''
  const stripped = ref.replace(/^image-/, '')
  const lastDash = stripped.lastIndexOf('-')
  const ext = stripped.slice(lastDash + 1)
  const name = stripped.slice(0, lastDash)
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${name}.${ext}?w=600&auto=format&q=85`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export async function fetchUpcomingTrips(excludeSlug?: string): Promise<EmailTrip[]> {
  try {
    const trips = await sanity.fetch<EmailTrip[]>(`
      *[_type == "trip" && status == "open"] | order(startDate asc) [0...4] {
        title, "slug": slug.current, destination, startDate, endDate,
        "price": price{deposit, total, currency},
        "imageRef": heroImage.asset._ref
      }
    `)
    return (excludeSlug ? trips.filter(t => t.slug !== excludeSlug) : trips).slice(0, 2)
  } catch {
    return []
  }
}

function tripCard(trip: EmailTrip): string {
  const img = buildImageUrl(trip.imageRef)
  const currency = trip.price?.currency ?? '€'
  const price = trip.price?.deposit ? `From ${currency}${trip.price.deposit} deposit` : trip.price?.total ? `From ${currency}${trip.price.total}` : ''
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;border:1px solid #d4c5a0;">
      <tr>
        <td>
          ${img ? `<a href="https://chasingted.com/trips/${trip.slug}" style="display:block;"><img src="${img}" alt="${trip.title}" width="520" style="display:block;width:100%;height:auto;" /></a>` : ''}
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;padding:20px 24px;">
          <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#f7b500;margin:0 0 6px;">${trip.destination}</p>
          <p style="font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#133425;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px;">${trip.title}</p>
          <p style="font-family:Arial,sans-serif;font-size:12px;color:#3a4a40;margin:0 0 4px;">${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}</p>
          ${price ? `<p style="font-family:Arial,sans-serif;font-size:12px;color:#3a4a40;margin:0 0 14px;">${price}</p>` : '<p style="margin:0 0 14px;"></p>'}
          <a href="https://chasingted.com/trips/${trip.slug}" style="font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#ffffff;background:#133425;text-decoration:none;padding:10px 20px;display:inline-block;">VIEW EXPEDITION →</a>
        </td>
      </tr>
    </table>
  `
}

function emailHeader(): string {
  return `
    <tr>
      <td style="background:#133425;padding:30px 40px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:7px;text-transform:uppercase;color:#F5F0E4;margin:0;">CHASINGTED</p>
        <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#f7b500;margin:8px 0 0;">Adventure Expeditions</p>
      </td>
    </tr>
  `
}

function emailFooter(): string {
  return `
    <tr>
      <td style="background:#133425;padding:28px 40px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#F5F0E4;margin:0 0 8px;">Chasingted · chasingted.com</p>
        <a href="mailto:info@chasingted.com" style="font-family:Arial,sans-serif;font-size:12px;color:#f7b500;text-decoration:none;">info@chasingted.com</a>
      </td>
    </tr>
  `
}

function stepRow(num: string, title: string, desc: string): string {
  return `
    <tr>
      <td width="32" style="vertical-align:top;padding-bottom:18px;">
        <div style="width:26px;height:26px;background:#f7b500;border-radius:50%;text-align:center;line-height:26px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;color:#133425;">${num}</div>
      </td>
      <td style="padding-left:14px;padding-bottom:18px;vertical-align:top;">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:bold;color:#133425;margin:0 0 3px;letter-spacing:1px;text-transform:uppercase;">${title}</p>
        <p style="font-family:Georgia,serif;font-size:13px;color:#3a4a40;margin:0;line-height:1.6;">${desc}</p>
      </td>
    </tr>
  `
}

function sectionLabel(text: string): string {
  return `
    <tr>
      <td style="padding:0 0 16px;">
        <p style="font-family:Arial,sans-serif;font-size:9px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;color:#133425;margin:0;border-bottom:2px solid #f7b500;padding-bottom:10px;">${text}</p>
      </td>
    </tr>
  `
}

export function waitlistEmailHtml(firstName: string, trips: EmailTrip[]): string {
  const tripsHtml = trips.length > 0
    ? trips.map(tripCard).join('')
    : `<p style="font-family:Georgia,serif;font-size:14px;color:#3a4a40;">New expeditions are announced regularly. <a href="https://chasingted.com/trips" style="color:#133425;">Check the full schedule →</a></p>`

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#e8e3d6;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e3d6;padding:32px 0;">
        <tr>
          <td>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

              ${emailHeader()}

              <!-- Gold bar -->
              <tr><td style="background:#f7b500;height:4px;font-size:0;">&nbsp;</td></tr>

              <!-- Body -->
              <tr>
                <td style="background:#F5F0E4;padding:40px 40px 8px;">
                  <p style="font-family:Georgia,serif;font-size:16px;color:#133425;margin:0 0 20px;">Hi ${firstName},</p>
                  <h1 style="font-family:Georgia,serif;font-size:28px;color:#133425;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;line-height:1.3;">You're on the list.</h1>
                  <p style="font-family:Georgia,serif;font-size:15px;color:#3a4a40;line-height:1.8;margin:0 0 12px;">Chasingted runs small-group expeditions for people who want to go further. We don't do mass tourism — every trip is carefully curated, every group is hand-picked.</p>
                  <p style="font-family:Georgia,serif;font-size:15px;color:#3a4a40;line-height:1.8;margin:0 0 32px;">We'll reach out personally when we find the right match for you.</p>
                </td>
              </tr>

              <!-- What happens next -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${sectionLabel('What happens next')}
                    <tr><td>
                      <table cellpadding="0" cellspacing="0" border="0">
                        ${stepRow('1', 'We review your sign-up', 'Every submission is read by a real person. No bots, no automation.')}
                        ${stepRow('2', 'We match you to the right trip', 'Based on your experience, interests, and availability.')}
                        ${stepRow('3', 'You get a personal invite', 'If there\'s a match, we\'ll reach out directly with details.')}
                      </table>
                    </td></tr>
                  </table>
                </td>
              </tr>

              <!-- Divider -->
              <tr><td style="background:#F5F0E4;padding:0 40px;"><hr style="border:none;border-top:1px solid #d4c5a0;margin:0 0 32px;" /></td></tr>

              <!-- Upcoming trips -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 8px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${sectionLabel('Upcoming Expeditions')}
                    <tr><td>${tripsHtml}</td></tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="background:#F5F0E4;padding:8px 40px 48px;text-align:center;">
                  <a href="https://chasingted.com/trips" style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;color:#133425;background:#f7b500;text-decoration:none;padding:16px 36px;display:inline-block;">BROWSE ALL EXPEDITIONS</a>
                </td>
              </tr>

              <!-- Contact note -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 40px;text-align:center;border-top:1px solid #d4c5a0;">
                  <p style="font-family:Georgia,serif;font-size:13px;color:#3a4a40;line-height:1.7;margin:24px 0 0;">Questions? Reply to this email or write to <a href="mailto:info@chasingted.com" style="color:#133425;">info@chasingted.com</a>.</p>
                </td>
              </tr>

              ${emailFooter()}

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export function applicationEmailHtml(firstName: string, tripTitle: string, tripSlug: string, trips: EmailTrip[]): string {
  const tripsHtml = trips.length > 0
    ? trips.map(tripCard).join('')
    : ''

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#e8e3d6;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8e3d6;padding:32px 0;">
        <tr>
          <td>
            <table width="600" align="center" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

              ${emailHeader()}

              <!-- Gold bar with APPLICATION RECEIVED badge -->
              <tr>
                <td style="background:#f7b500;padding:14px 40px;text-align:center;">
                  <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:5px;text-transform:uppercase;color:#133425;margin:0;">✓ Application Received</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:#F5F0E4;padding:40px 40px 8px;">
                  <p style="font-family:Georgia,serif;font-size:16px;color:#133425;margin:0 0 20px;">Hi ${firstName},</p>
                  <p style="font-family:Georgia,serif;font-size:15px;color:#3a4a40;line-height:1.8;margin:0 0 20px;">Your application is in. Here's what you applied for:</p>

                  <!-- Trip highlight box -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="background:#133425;padding:20px 24px;border-left:4px solid #f7b500;">
                        <p style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#f7b500;margin:0 0 6px;">Your Application</p>
                        <p style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#F5F0E4;text-transform:uppercase;letter-spacing:2px;margin:0;">${tripTitle}</p>
                        <a href="https://chasingted.com/trips/${tripSlug}" style="font-family:Arial,sans-serif;font-size:10px;color:#f7b500;text-decoration:none;letter-spacing:1px;display:inline-block;margin-top:10px;">View trip details →</a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-family:Georgia,serif;font-size:15px;color:#3a4a40;line-height:1.8;margin:0 0 20px;">We review every application personally — not a form letter. Expect a reply within <strong>3–5 days</strong>.</p>
                  <p style="font-family:Georgia,serif;font-size:13px;color:#3a4a40;line-height:1.7;margin:0 0 32px;background:#fff8e6;border-left:3px solid #f7b500;padding:12px 16px;">To make sure our reply reaches you, please add <strong>info@chasingted.com</strong> to your contacts now.</p>
                </td>
              </tr>

              <!-- What happens next -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${sectionLabel('What happens next')}
                    <tr><td>
                      <table cellpadding="0" cellspacing="0" border="0">
                        ${stepRow('1', 'Application reviewed', 'We read your motivation and experience to understand who you are.')}
                        ${stepRow('2', 'Personal reply within 3–5 days', 'We\'ll let you know if you\'re a good fit for this expedition.')}
                        ${stepRow('3', 'Spot confirmed', 'If it\'s a match, we\'ll confirm your place and send next steps.')}
                      </table>
                    </td></tr>
                  </table>
                </td>
              </tr>

              ${trips.length > 0 ? `
              <!-- Divider -->
              <tr><td style="background:#F5F0E4;padding:0 40px;"><hr style="border:none;border-top:1px solid #d4c5a0;margin:0 0 32px;" /></td></tr>

              <!-- Other trips -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 8px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${sectionLabel('While you wait — other expeditions')}
                    <tr><td>${tripsHtml}</td></tr>
                  </table>
                </td>
              </tr>
              ` : ''}

              <!-- CTA -->
              <tr>
                <td style="background:#F5F0E4;padding:8px 40px 48px;text-align:center;">
                  <a href="https://chasingted.com/trips" style="font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:4px;text-transform:uppercase;color:#133425;background:#f7b500;text-decoration:none;padding:16px 36px;display:inline-block;">BROWSE ALL EXPEDITIONS</a>
                </td>
              </tr>

              <!-- Contact note -->
              <tr>
                <td style="background:#F5F0E4;padding:0 40px 40px;text-align:center;border-top:1px solid #d4c5a0;">
                  <p style="font-family:Georgia,serif;font-size:13px;color:#3a4a40;line-height:1.7;margin:24px 0 0;">Questions? Reply to this email or write to <a href="mailto:info@chasingted.com" style="color:#133425;">info@chasingted.com</a>.</p>
                </td>
              </tr>

              ${emailFooter()}

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
