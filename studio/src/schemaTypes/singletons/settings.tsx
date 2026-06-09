import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      description: 'Large text shown at the top of the homepage.',
      type: 'string',
      initialValue: 'Adventure awaits.',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      description: 'Smaller text below the hero heading.',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          description: 'Describe what is happening in the photo. Include the activity and destination. Example: "Group of adventurers crossing a mountain pass in Kyrgyzstan on a Chasingted expedition"',
        }),
      ],
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      description: 'A short paragraph shown below the hero section on the homepage.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'featuredTrips',
      title: 'Featured Trips',
      description: 'Select up to 3 trips to highlight on the homepage.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'trip'}]}],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      description: 'Image shown when chasingted.com is shared on social media or WhatsApp.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          description: 'Describe what is shown. Example: "Chasingted expedition group in the Oman desert at sunset — adventure travel"',
        }),
      ],
    }),

    defineField({
      name: 'whyImage',
      title: '"Why Chasingted" Section Image',
      description: 'The photo shown in the "Small Groups. Real Wilderness." section on the homepage. Upload something different from the hero image.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          description: 'Describe what is in the photo. Example: "Lone hiker on a mountain ridge during a Chasingted small-group expedition"',
        }),
      ],
    }),

    // ── Branding ──────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Upload your logo here. It will appear in the header and footer. PNG or SVG with transparent background works best.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          initialValue: 'Chasingted — Small-Group Adventure Expeditions',
          description: 'Describes the logo for Google and screen readers. The default is fine — only change it if you upload a different version.',
        }),
      ],
    }),

    // ── Footer text ───────────────────────────────────────────────────
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      description: 'Short quote shown in the footer, e.g. "From somewhere to Somewhere."',
      type: 'string',
      initialValue: 'From somewhere to Somewhere.',
    }),
    defineField({
      name: 'footerSubtagline',
      title: 'Footer Sub-tagline',
      description: 'Smaller text below the tagline.',
      type: 'string',
      initialValue: 'Not a holiday. An expedition.',
    }),

    // ── Contact ───────────────────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'info@chasingted.com',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      initialValue: '+31 6 55 82 55 37',
    }),
    defineField({
      name: 'contactLocation',
      title: 'Location Text',
      description: 'Shown in the footer under contact info.',
      type: 'string',
      initialValue: 'Amsterdam — expeditions worldwide',
    }),

    // ── Social media ──────────────────────────────────────────────────
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/chasingted.adventures',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      initialValue: 'https://facebook.com/chasingted',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      initialValue: 'https://youtube.com/@chasingted',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      initialValue: 'https://tiktok.com/@chasingted',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
