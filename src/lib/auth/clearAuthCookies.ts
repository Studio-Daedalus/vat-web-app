import type { NextResponse } from 'next/server'

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set('access-token', '', { path: '/', maxAge: 0 })
  res.cookies.set('id-token', '', { path: '/', maxAge: 0 })
}