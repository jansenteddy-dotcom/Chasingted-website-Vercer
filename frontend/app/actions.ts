'use server'

import {draftMode} from 'next/headers'

export async function disableDraftMode() {
  'use server'
  const {disable} = await draftMode()
  disable()
}
