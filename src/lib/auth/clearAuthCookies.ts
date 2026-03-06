import type { NextResponse } from 'next/server'

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set('access-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('id-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('refresh-token', '', { path: '/', maxAge: 0 })

  res.cookies.delete('access-token')
  res.cookies.delete('id-token')
  res.cookies.delete('refresh-token')
}