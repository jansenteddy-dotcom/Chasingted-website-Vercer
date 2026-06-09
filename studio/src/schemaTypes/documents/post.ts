import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'

export const post = defineType({
  name: 'post',
  title: 'Story / Blog Post',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the URL: chasingted.com/stories/[slug]. Generate it automatically by clicking the button.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Expedition Report', value: 'expedition-report'},
          {title: 'Destination Guide', value: 'destination-guide'},
          {title: 'Gear & Tips', value: 'gear-tips'},
          {title: 'Behind the Scenes', value: 'behind-the-scenes'},
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text (for SEO & accessibility)',
          type: 'string',
          description: 'Describe what is in the photo. Example: "Sunset over the Atlas Mountains during a Chasingted expedition"',
          validation: (rule) => rule.required().warning('Add alt text to help Google understand this image.'),
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A short summary shown on the Stories page (1–2 sentences, max 200 characters).',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Post Content',
      description: 'Write the full blog post here. You can add headings, bold text, images, and links.',
      type: 'blockContent',
    }),
    defineField({
      name: 'relatedTrip',
      title: 'Related Trip (optional)',
      description: 'Link this post to a specific trip — a "Join this expedition" button will appear at the bottom.',
      type: 'reference',
      to: [{type: 'trip'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, category, publishedAt, media}) {
      const dateStr = publishedAt ? format(parseISO(publishedAt), 'dd MMM yyyy') : 'No date'
      const cat = category ? category.replace(/-/g, ' ') : 'Uncategorised'
      return {
        title,
        media,
        subtitle: `${dateStr} · ${cat}`,
      }
    },
  },
})
