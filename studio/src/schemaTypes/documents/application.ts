import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'

export const application = defineType({
  name: 'application',
  title: 'Application',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'trip',
      title: 'Trip',
      type: 'reference',
      to: [{type: 'trip'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
    }),
    defineField({
      name: 'experienceLevel',
      title: 'Experience Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner – few trips abroad', value: 'beginner'},
          {title: 'Some experience – regular traveler', value: 'some'},
          {title: 'Experienced – done adventure trips', value: 'experienced'},
          {title: 'Expert – extensive expedition experience', value: 'expert'},
        ],
      },
    }),
    defineField({
      name: 'motivation',
      title: 'Motivation',
      description: "Why do you want to join this trip? (the applicant's own words)",
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'emergencyContact',
      title: 'Emergency Contact',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Full Name', type: 'string'}),
        defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
      ],
    }),
    defineField({
      name: 'medicalInfo',
      title: 'Medical Information',
      description: 'Any health conditions, allergies, or medications Teddy should know about.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: '⏳ Pending Review', value: 'pending'},
          {title: '✅ Approved', value: 'approved'},
          {title: '❌ Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed At',
      type: 'datetime',
    }),
    defineField({
      name: 'reviewNotes',
      title: 'Review Notes',
      description: 'Internal notes — never shown to the applicant.',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      tripTitle: 'trip.title',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({firstName, lastName, tripTitle, status, submittedAt}) {
      const statusIcon = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '⏳'
      const dateStr = submittedAt ? format(parseISO(submittedAt), 'dd MMM yyyy') : ''
      return {
        title: `${firstName || ''} ${lastName || ''}`.trim() || 'Unnamed applicant',
        subtitle: `${tripTitle || 'Unknown trip'} · ${statusIcon} ${status}${dateStr ? ` · ${dateStr}` : ''}`,
      }
    },
  },
})
