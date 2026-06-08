import {defineField, defineType} from 'sanity'

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Itinerary Day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day Number',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Day Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      day: 'day',
      title: 'title',
    },
    prepare({day, title}) {
      return {title: `Day ${day}: ${title}`}
    },
  },
})
