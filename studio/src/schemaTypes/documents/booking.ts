import {defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons'

export const booking = defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'application',
      title: 'Application',
      type: 'reference',
      to: [{type: 'application'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trip',
      title: 'Trip',
      type: 'reference',
      to: [{type: 'trip'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'depositPaid',
      title: 'Deposit Received',
      type: 'boolean',
      initialValue: false,
      description: 'Tick this once you have confirmed the bank transfer in your account.',
    }),
    defineField({
      name: 'depositPaidDate',
      title: 'Deposit Received On',
      type: 'date',
    }),
    defineField({
      name: 'balancePaid',
      title: 'Balance Received',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'balancePaidDate',
      title: 'Balance Received On',
      type: 'date',
    }),
    defineField({
      name: 'balanceDueDate',
      title: 'Balance Due Date',
      type: 'date',
      description: 'Deadline for the customer to pay the remaining balance.',
    }),
    defineField({
      name: 'portalAccessGranted',
      title: 'Portal Access Granted',
      type: 'boolean',
      initialValue: false,
      description: 'Turned on automatically when deposit is confirmed. Gives customer access to the portal.',
    }),
    defineField({
      name: 'supabaseUserId',
      title: 'Portal Account ID',
      type: 'string',
      description: 'Set automatically when the customer creates their portal account. Do not edit manually.',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      applicationFirstName: 'application.firstName',
      applicationLastName: 'application.lastName',
      tripTitle: 'trip.title',
      depositPaid: 'depositPaid',
      balancePaid: 'balancePaid',
    },
    prepare({applicationFirstName, applicationLastName, tripTitle, depositPaid, balancePaid}) {
      const paymentStatus = balancePaid
        ? '💰 Fully paid'
        : depositPaid
          ? '🏦 Deposit received'
          : '⏳ Awaiting deposit'
      return {
        title: `${applicationFirstName || ''} ${applicationLastName || ''}`.trim() || 'Unnamed traveler',
        subtitle: `${tripTitle || 'Unknown trip'} · ${paymentStatus}`,
      }
    },
  },
})
