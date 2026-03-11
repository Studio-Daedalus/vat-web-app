import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'

export type UpdateUserBody = {
  email: string
  first: string
  last: string
  occupation?: string
}

export type UpdateUserResult =
  | { ok: true }
  | { ok: false; status: number; message: string }

export async function UpdateUser(body: UpdateUserBody): Promise<UpdateUserResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')

    const res = await fetchApiWithAutoRefresh(`${process.env.API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token.value}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: json?.error ?? 'Failed to update user',
      }
    }

    return { ok: true }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}