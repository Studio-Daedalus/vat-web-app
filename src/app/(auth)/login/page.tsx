import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import LoginForm from './LoginForm'

export default async function Page() {

  // If user is already logged in, take them straight to the dashboard
  const cookieStore = await cookies()
  const token = cookieStore.get('access-token')
  if (token) {
    redirect('/dashboard')
  }

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
