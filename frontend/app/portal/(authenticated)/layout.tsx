import PortalNav from '@/app/components/portal/PortalNav'

export default function AuthenticatedPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f0e4]">
      <PortalNav />
      <main className="container py-10">{children}</main>
    </div>
  )
}
