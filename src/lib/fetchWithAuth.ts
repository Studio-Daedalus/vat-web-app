import { cookies, headers } from 'next/headers'

async function baseUrlFromRequestHeaders() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'

  if (!host) throw new Error('Missing host headers')

  return `${proto}://${host}`
}

export async function fetchApiWithAutoRefresh(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const doFetch = async () => {
    const cookieStore = await cookies()

    const access = cookieStore.get('id-token')?.value
    return fetch(url, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: access ? `Bearer ${access}` : '',
      },
      cache: 'no-store',
    })
  }

  let res = await doFetch()

  // If the access token expired, refresh and retry once
  if (res.status === 401) {
    const base = await baseUrlFromRequestHeaders()
    const refreshed = await fetch(`${base}/api/auth/refresh`, {
      method: 'POST',
      cache: 'no-store',
    })

    if (refreshed.ok) {
      res = await doFetch()
    }
  }

  return res
}
