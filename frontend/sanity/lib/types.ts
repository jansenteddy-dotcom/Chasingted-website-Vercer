import type {TripBySlugQueryResult, AllTripsQueryResult, SettingsQueryResult} from '@/sanity.types'

export type Trip = NonNullable<TripBySlugQueryResult>
export type TripCard = NonNullable<AllTripsQueryResult>[number]
export type SiteSettings = NonNullable<SettingsQueryResult>
