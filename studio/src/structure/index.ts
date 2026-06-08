import {CogIcon, TiersIcon, UserIcon, CheckmarkCircleIcon, DocumentIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

const SINGLETON_TYPES = ['settings', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Chasingted')
    .items([
      S.listItem()
        .title('Trips')
        .icon(TiersIcon)
        .child(S.documentTypeList('trip').title('All Trips')),

      S.listItem()
        .title('Applications')
        .icon(UserIcon)
        .child(S.documentTypeList('application').title('Applications')),

      S.listItem()
        .title('Bookings')
        .icon(CheckmarkCircleIcon)
        .child(S.documentTypeList('booking').title('Bookings')),

      S.divider(),

      S.listItem()
        .title('Page Content')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Page Content')),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings')),
    ])
