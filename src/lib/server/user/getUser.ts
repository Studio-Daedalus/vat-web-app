import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'

export type User = {
  sub: string
  email: string
  first: string
  last: string
  companyName?: string
  planType?: string
  created_at: string
  updated_at: string
}

export type GetUserResult =
  | { ok: true; user: User }
  | { ok: false; status: number; message: string }

export async function GetUser(): Promise<GetUserResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('id-token')

    const res = await fetchApiWithAutoRefresh(
      'https://0363asb5xk.execute-api.eu-west-2.amazonaws.com/dev/user',
      {
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
        },
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message:
          res.status === 401
            ? 'You are not authenticated.'
            : 'Failed to load user information.',
      }
    }

    const data = (await res.json()) as User
    return { ok: true, user: data }
  } catch {
    return {
      ok: false,
      status: 500,
      message: 'Unexpected server error while fetching user.',
    }
  }
}
