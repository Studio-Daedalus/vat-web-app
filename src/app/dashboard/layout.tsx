import { AppSidebarLayout } from '@/components/AppSidebar'
import { GetUser } from '@/lib/server/user/getUser'
import { Alert } from '@/components/Alert'
import { ReceiptUploadModalProvider } from '@/components/ReceiptUploadModalContext'
import React from 'react'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const result = await GetUser()
  if (!result.ok) {
    return (
      <div className="p-4">
        <Alert type={'error'} message="Something went wrong" />
      </div>
    )
  }
  const user = result.user

  return (
    <ReceiptUploadModalProvider>
      <AppSidebarLayout
        companyName={user.companyName ?? 'Welcome Back!'}
        companyAvatarSrc={undefined} // or "https://.../company.png"
        userName={user.first + ' ' + user.last}
        userAvatarSrc={undefined} // or "https://.../me.png"
        planName={user.planType ?? 'Free Plan'}
      >
        {children}
      </AppSidebarLayout>
    </ReceiptUploadModalProvider>
  )
}