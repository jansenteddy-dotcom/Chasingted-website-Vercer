import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Page Content',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'identifier',
      title: 'Which Page',
      type: 'string',
      options: {
        list: [
          {title: 'About Page', value: 'about'},
          {title: 'FAQ Page', value: 'faq'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      description: 'Used for the About page.',
      type: 'blockContent',
      hidden: ({document}) => document?.identifier === 'faq',
    }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Questions',
      description: 'Add questions and answers for the FAQ page.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
          ],
          preview: {
            select: {title: 'question'},
          },
        },
      ],
      hidden: ({document}) => document?.identifier !== 'faq',
    }),
  ],
  preview: {
    select: {identifier: 'identifier'},
    prepare({identifier}) {
      const labels: Record<string, string> = {about: 'About Page', faq: 'FAQ Page'}
      return {title: labels[identifier as string] || identifier || 'Page'}
    },
  },
})
