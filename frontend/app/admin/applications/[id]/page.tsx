import {createClient} from '@sanity/client'
import {notFound} from 'next/navigation'
import Link from 'next/link'
import ApplicationReviewClient from '@/app/components/admin/ApplicationReviewClient'
import ApplicationMessageClient from '@/app/components/admin/ApplicationMessageClient'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-09-25',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const experienceLabels: Record<string, string> = {
  beginner: 'Beginner – few trips abroad',
  some: 'Some experience – regular traveler',
  experienced: 'Experienced – done adventure trips',
  expert: 'Expert – extensive expedition experience',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})
}

function Row({label, value}: {label: string; value?: string | null}) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 w-44 shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a1a]">{value}</span>
    </div>
  )
}

export default async function ApplicationDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  const app = await sanity.fetch(`
    *[_type == "application" && _id == $id][0]{
      _id, firstName, lastName, email, phone, dateOfBirth, nationality,
      experienceLevel, motivation,
      emergencyContact{name, phone},
      medicalInfo, status, submittedAt, reviewNotes,
      "tripTitle": trip->title,
      "tripSlug": trip->slug.current
    }
  `, {id})

  if (!app) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/applications" className="text-xs text-gray-400 hover:text-[#1a1a1a]">← Applications</Link>
      </div>
      <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a] mb-1">
        {app.firstName} {app.lastName}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {app.tripTitle || '—'} · Applied {app.submittedAt ? formatDate(app.submittedAt) : '—'}
      </p>

      <ApplicationReviewClient id={app._id} currentStatus={app.status} currentNotes={app.reviewNotes} />

      <div className="mt-4">
        <ApplicationMessageClient
          id={app._id}
          applicantName={`${app.firstName} ${app.lastName}`}
          applicantEmail={app.email}
          tripTitle={app.tripTitle || 'the trip'}
        />
      </div>

      <div className="bg-white border border-gray-200 p-6 mt-6">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Personal Details</h2>
        <Row label="Email" value={app.email} />
        <Row label="Phone" value={app.phone} />
        <Row label="Date of Birth" value={app.dateOfBirth ? formatDate(app.dateOfBirth) : null} />
        <Row label="Nationality" value={app.nationality} />
      </div>

      <div className="bg-white border border-gray-200 p-6 mt-4">
        <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Travel Experience</h2>
        <Row label="Experience level" value={app.experienceLevel ? experienceLabels[app.experienceLevel] : null} />
        {app.motivation && (
          <div className="pt-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Motivation</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{app.motivation}</p>
          </div>
        )}
      </div>

      {(app.emergencyContact?.name || app.emergencyContact?.phone) && (
        <div className="bg-white border border-gray-200 p-6 mt-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Emergency Contact</h2>
          <Row label="Name" value={app.emergencyContact?.name} />
          <Row label="Phone" value={app.emergencyContact?.phone} />
        </div>
      )}

      {app.medicalInfo && (
        <div className="bg-white border border-gray-200 p-6 mt-4">
          <h2 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Health & Medical</h2>
          <p className="text-sm text-[#1a1a1a] leading-relaxed">{app.medicalInfo}</p>
        </div>
      )}
    </div>
  )
}
