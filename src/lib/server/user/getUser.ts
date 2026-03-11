import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'
import { GetUserResponse } from '@/types/api'

export type GetUserResult =
  | { ok: true; user: GetUserResponse }
  | { ok: false; status: number; message: string }

export async function GetUser(): Promise<GetUserResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('id-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/user`,
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

    const data = (await res.json()) as GetUserResponse
    return { ok: true, user: data }
  } catch {
    return {
      ok: false,
      status: 500,
      message: 'Unexpected server error while fetching user.',
    }
  }
}
