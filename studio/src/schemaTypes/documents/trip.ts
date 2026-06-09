import {defineField, defineType} from 'sanity'
import {TiersIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {MultiImageUpload} from '../../components/MultiImageUpload'

export const trip = defineType({
  name: 'trip',
  title: 'Trip',
  type: 'document',
  icon: TiersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Trip Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the URL: chasingted.com/trips/[slug]',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      fields: [
        defineField({
          name: 'deposit',
          title: 'Deposit Amount',
          type: 'number',
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: 'total',
          title: 'Total Price',
          type: 'number',
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'EUR',
          options: {
            list: ['EUR', 'USD', 'GBP'],
          },
        }),
      ],
    }),
    defineField({
      name: 'maxGroupSize',
      title: 'Maximum Group Size',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'difficultyLevel',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          {title: 'Easy', value: 'easy'},
          {title: 'Moderate', value: 'moderate'},
          {title: 'Challenging', value: 'challenging'},
          {title: 'Expert', value: 'expert'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '🟢 Open', value: 'open'},
          {title: '🔴 Full', value: 'full'},
          {title: '⚫ Archived', value: 'archived'},
        ],
      },
      initialValue: 'open',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          description: 'Describe what is happening in the photo. Include the activity and destination. Example: "Motorcyclists crossing a high mountain pass in Kyrgyzstan — Chasingted adventure expedition"',
          validation: (rule) => rule.required().warning('Add alt text to help Google understand this image and improve your search rankings.'),
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              title: 'Alt Text (for SEO & accessibility)',
              type: 'string',
              description: 'Describe what is in this photo. Example: "Campfire at base camp near a lake in Kyrgyzstan during Chasingted expedition"',
            },
            {
              name: 'caption',
              title: 'Caption / Description',
              type: 'string',
              description: 'A short sentence shown under the photo and used by Google to understand your images. Example: "Riding through the Tien Shan mountains on day 4 of the Chasingted Kyrgyzstan expedition."',
            },
          ],
        },
      ],
      components: {input: MultiImageUpload},
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      description: 'Shown on the trip card on the trips listing page (max 300 characters).',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [{type: 'itineraryDay'}],
    }),
    defineField({
      name: 'included',
      title: "What's Included",
      description: 'List each item on a new line.',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'excluded',
      title: "What's NOT Included",
      description: 'List each item on a new line.',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'fitnessLevel',
      title: 'Fitness Level',
      description: 'What physical condition travelers need to be in.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'meetingPoint',
      title: 'Meeting Point',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'cancellationPolicy',
      title: 'Cancellation Policy',
      type: 'text',
      rows: 3,
      initialValue:
        'Full refund up to 60 days before departure. 50% refund 30–59 days. No refund within 30 days. Travel insurance strongly recommended.',
    }),
    defineField({
      name: 'gearList',
      title: 'Gear List',
      description: 'Items travelers need to bring. Each item on a separate line.',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'packingList',
      title: 'Detailed Packing List',
      description: 'Shown to booked travelers in the customer portal.',
      type: 'blockContentTextOnly',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      destination: 'destination',
      startDate: 'startDate',
      status: 'status',
      media: 'heroImage',
    },
    prepare({title, destination, startDate, status, media}) {
      const statusIcon = status === 'open' ? '🟢' : status === 'full' ? '🔴' : '⚫'
      const dateStr = startDate ? format(parseISO(startDate), 'MMM yyyy') : 'No date'
      return {
        title,
        media,
        subtitle: `${destination} · ${dateStr} · ${statusIcon} ${status}`,
      }
    },
  },
})
