import AdminNav from '@/app/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="container py-10">{children}</main>
    </div>
  )
}
