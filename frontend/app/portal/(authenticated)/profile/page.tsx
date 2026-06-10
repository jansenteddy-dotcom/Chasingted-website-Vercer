import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/app/components/portal/ProfileForm'
import PortalPageBanner from '@/app/components/portal/PortalPageBanner'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <PortalPageBanner
        title="My Profile"
        subtitle="Your Account"
        imageUrl="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
      />
      <div className="max-w-2xl mx-auto">
        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}
