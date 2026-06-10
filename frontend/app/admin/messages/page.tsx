import { createAdminClient } from '@/lib/supabase/admin'
import AdminMessagesClient from '@/app/components/admin/AdminMessagesClient'

export default async function AdminMessagesPage() {
  const admin = createAdminClient()

  const { data: messages } = await admin
    .from('messages')
    .select('*, profiles(first_name, last_name, email)')
    .order('created_at', { ascending: true })

  // Group by booking_id
  const threads: Record<string, any[]> = {}
  for (const msg of messages ?? []) {
    const key = msg.booking_id ?? msg.user_id
    if (!threads[key]) threads[key] = []
    threads[key].push(msg)
  }

  const threadList = Object.entries(threads).map(([key, msgs]) => ({
    key,
    profile: msgs[0]?.profiles,
    messages: msgs,
    hasUnread: msgs.some((m: any) => !m.read_at && !m.is_from_admin),
  }))

  return <AdminMessagesClient threads={threadList} />
}
