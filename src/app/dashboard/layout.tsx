import React from 'react'
import { redirect } from 'next/navigation'
import { GetUser } from '@/lib/server/user/getUser'
import { Alert } from '@/components/Alert'
import { ReceiptUploadModalProvider } from '@/components/ReceiptUploadModalContext'
import { DesktopSidebarLayout } from '@/components/Sidebar/DesktopSidebar'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const result = await GetUser()
  if (!result.ok) {
    if (result.status === 401) redirect('/login')
    return (
      <div className="p-4">
        <Alert type={'error'} message="Something went wrong" />
      </div>
    )
  }
  const user = result.user

  return (
    <ReceiptUploadModalProvider>
      <DesktopSidebarLayout>
        {children}
      </DesktopSidebarLayout>
    </ReceiptUploadModalProvider>
  )
}