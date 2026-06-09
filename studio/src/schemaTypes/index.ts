import {trip} from './documents/trip'
import {post} from './documents/post'
import {application} from './documents/application'
import {booking} from './documents/booking'
import {page} from './documents/page'
import {settings} from './singletons/settings'
import {itineraryDay} from './objects/itineraryDay'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  trip,
  post,
  application,
  booking,
  page,
  // Objects
  itineraryDay,
  blockContent,
  blockContentTextOnly,
]
