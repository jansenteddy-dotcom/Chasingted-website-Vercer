'use client'

import {useEffect} from 'react'

type Props = {
  event: string
  data?: Record<string, unknown>
}

export default function GtmEvent({event, data}: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({event, ...data})
    }
  }, [event, data])

  return null
}
