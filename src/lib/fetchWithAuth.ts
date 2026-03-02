import { cookies, headers } from 'next/headers'

function baseUrlFromRequestHeaders(h: Headers) {
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  if (!host) throw new Error('Missing host headers')
  return `${proto}://${host}`
}

export async function fetchApiWithAutoRefresh(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const h = await headers()
  const base = baseUrlFromRequestHeaders(h)
  const cookieHeader = h.get('cookie') ?? ''

  const doFetch = async (accessToken?: string) => {
    return fetch(url, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
      cache: 'no-store',
    })
  }

  // ✅ use access-token, not id-token
  const cookieStore = await cookies()
  let accessToken = cookieStore.get('access-token')?.value

  let res = await doFetch(accessToken)

  if (res.status === 401) {
    const refreshed = await fetch(`${base}/api/auth/refresh`, {
      method: 'POST',
      headers: { cookie: cookieHeader }, // ✅ refresh endpoint can read refresh-token
      cache: 'no-store',
    })

    if (refreshed.ok) {
      const refreshedJson = await refreshed.json().catch(() => null)
      const newAccess = refreshedJson?.accessToken as string | undefined

      if (newAccess) {
        accessToken = newAccess
        res = await doFetch(accessToken) // ✅ retry using new token directly
      }
    }
  }

  return res
}
