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
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
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
        defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
