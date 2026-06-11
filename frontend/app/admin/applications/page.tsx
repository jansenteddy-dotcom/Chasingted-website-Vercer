import {createClient} from '@sanity/client'
import Link from 'next/link'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-09-25',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

type Application = {
  _id: string
  firstName: string
  lastName: string
  email: string
  tripTitle: string
  experienceLevel?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt?: string
}

const statusBadge = (s: string) => {
  if (s === 'approved') return 'bg-green-100 text-green-800'
  if (s === 'rejected') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})
}

export default async function ApplicationsPage() {
  const applications: Application[] = await sanity.fetch(`
    *[_type == "application"] | order(submittedAt desc) {
      _id, firstName, lastName, email,
      "tripTitle": trip->title,
      experienceLevel, status, submittedAt
    }
  `)

  const pending = applications.filter(a => a.status === 'pending')
  const rest = applications.filter(a => a.status !== 'pending')

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl uppercase tracking-widest text-[#1a1a1a]">Applications</h1>
          {pending.length > 0 && (
            <p className="text-sm text-yellow-700 mt-1">{pending.length} pending review</p>
          )}
        </div>
      </div>

      {!applications.length ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">No applications yet.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Pending Review</h2>
              <div className="bg-white border border-gray-200 divide-y divide-gray-100">
                {pending.map(a => <ApplicationRow key={a._id} a={a} statusBadge={statusBadge} formatDate={formatDate} />)}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reviewed</h2>
              <div className="bg-white border border-gray-200 divide-y divide-gray-100">
                {rest.map(a => <ApplicationRow key={a._id} a={a} statusBadge={statusBadge} formatDate={formatDate} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ApplicationRow({a, statusBadge, formatDate}: {
  a: Application
  statusBadge: (s: string) => string
  formatDate: (d: string) => string
}) {
  return (
    <Link href={`/admin/applications/${a._id}`}
      className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors gap-2">
      <div>
        <p className="font-bold text-sm text-[#1a1a1a]">
          {a.firstName} {a.lastName}
          <span className="font-normal text-gray-500 ml-2 text-xs">{a.email}</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {a.tripTitle || '—'} · {a.submittedAt ? formatDate(a.submittedAt) : '—'}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 ${statusBadge(a.status)}`}>
          {a.status}
        </span>
        <span className="text-xs text-gray-400">→</span>
      </div>
    </Link>
  )
}
