import { AppSidebarLayout } from '@/components/AppSidebar'
import { GetUser } from '@/lib/server/user/getUser'
import { Alert } from '@/components/Alert'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const result = await GetUser()
  if (!result.ok) {
    return (
      <div className="p-4">
        <Alert type={"error"} message="Something went wrong" />
      </div>
    )
  }
  const user = result.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebarLayout
        companyName={user.companyName ?? 'Welcome Back!'}
        companyAvatarSrc={undefined} // or "https://.../company.png"
        userName={user.first + ' ' + user.last}
        userAvatarSrc={undefined} // or "https://.../me.png"
        planName={user.planType ?? 'Free Plan'}
      >
        {children}
      </AppSidebarLayout>
    </div>
  )
}
