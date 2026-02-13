
import { BreadCrumb } from '@/components/BreadCrumb'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 px-6 pt-8">
        <BreadCrumb />
      </div>

      {/* Page Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
