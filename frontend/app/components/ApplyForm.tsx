'use client'

import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  nationality: string
  experienceLevel: string
  motivation: string
  emergencyName: string
  emergencyPhone: string
  medicalInfo: string
}

type Props = {
  tripId: string
  tripSlug: string
  tripTitle: string
}

export default function ApplyForm({tripId, tripSlug, tripTitle}: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {register, handleSubmit, formState: {errors}} = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          tripId,
          tripSlug,
          tripTitle,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          nationality: data.nationality,
          experienceLevel: data.experienceLevel,
          motivation: data.motivation,
          emergencyContact: {name: data.emergencyName, phone: data.emergencyPhone},
          medicalInfo: data.medicalInfo,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }

      router.push('/apply/thank-you')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  const fieldClass = 'w-full border border-[#E7DBBF] rounded px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#3a4a40] bg-white'
  const labelClass = 'block text-sm font-medium text-[#133425] mb-1'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal details */}
      <div>
        <h2 className="font-serif text-xl text-[#133425] mb-4">Personal details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First name *</label>
            <input className={fieldClass} {...register('firstName', {required: 'Required'})} />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Last name *</label>
            <input className={fieldClass} {...register('lastName', {required: 'Required'})} />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email address *</label>
            <input type="email" className={fieldClass} {...register('email', {required: 'Required'})} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone number</label>
            <input type="tel" className={fieldClass} {...register('phone')} />
          </div>
          <div>
            <label className={labelClass}>Date of birth</label>
            <input type="date" className={fieldClass} {...register('dateOfBirth')} />
          </div>
          <div>
            <label className={labelClass}>Nationality</label>
            <input className={fieldClass} {...register('nationality')} />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="font-serif text-xl text-[#133425] mb-4">Travel experience</h2>
        <div>
          <label className={labelClass}>Experience level *</label>
          <select className={fieldClass} {...register('experienceLevel', {required: 'Required'})}>
            <option value="">Select your level</option>
            <option value="beginner">Beginner – few trips abroad</option>
            <option value="some">Some experience – regular traveler</option>
            <option value="experienced">Experienced – done adventure trips</option>
            <option value="expert">Expert – extensive expedition experience</option>
          </select>
          {errors.experienceLevel && <p className={errorClass}>{errors.experienceLevel.message}</p>}
        </div>
        <div className="mt-4">
          <label className={labelClass}>
            Why do you want to join this trip? *
            <span className="font-normal text-[#3a4a40]/60 ml-1">(min. 50 characters)</span>
          </label>
          <textarea
            rows={5}
            className={fieldClass}
            placeholder="Tell us what draws you to this expedition and what kind of traveler you are..."
            {...register('motivation', {required: 'Required', minLength: {value: 50, message: 'Please write at least 50 characters'}})}
          />
          {errors.motivation && <p className={errorClass}>{errors.motivation.message}</p>}
        </div>
      </div>

      {/* Emergency contact */}
      <div>
        <h2 className="font-serif text-xl text-[#133425] mb-4">Emergency contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact name</label>
            <input className={fieldClass} {...register('emergencyName')} />
          </div>
          <div>
            <label className={labelClass}>Contact phone</label>
            <input type="tel" className={fieldClass} {...register('emergencyPhone')} />
          </div>
        </div>
      </div>

      {/* Medical */}
      <div>
        <h2 className="font-serif text-xl text-[#133425] mb-4">Health & medical</h2>
        <div>
          <label className={labelClass}>
            Anything we should know?
            <span className="font-normal text-[#3a4a40]/60 ml-1">(allergies, medications, conditions)</span>
          </label>
          <textarea
            rows={3}
            className={fieldClass}
            placeholder="Leave blank if nothing to report"
            {...register('medicalInfo')}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#f7b500] text-[#133425] font-semibold py-4 rounded hover:bg-[#d9a441] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? 'Submitting…' : 'Submit application'}
      </button>

      <p className="text-xs text-center text-[#3a4a40]/50">
        Your application is free. You are not committing to anything by applying.
      </p>
    </form>
  )
}
