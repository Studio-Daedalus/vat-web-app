import { cookies } from 'next/headers'

export async function clearAuthCookies() {
  const cookieStore = await cookies()

  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }

  cookieStore.set('access-token', '', opts)
  cookieStore.set('id-token', '', opts)
  cookieStore.set('refresh-token', '', opts)
}
