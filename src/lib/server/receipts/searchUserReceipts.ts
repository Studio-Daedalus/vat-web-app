import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'
import { SearchUserReceiptsResponse } from '@/types/api'

export type GetAllReceiptsResult =
  | { ok: true; data: SearchUserReceiptsResponse }
  | { ok: false; status: number; message: string }

export async function SearchUserReceipts(): Promise<GetAllReceiptsResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/receipts`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
        },
        cache: 'no-store',
      },
    )

    const json = await res.json().catch(() => null)

    if (!res.ok || json === null) {
      return {
        ok: false,
        status: res.status,
        message: json?.error ?? 'Failed to fetch receipts',
      }
    }

    return { ok: true, data: json as SearchUserReceiptsResponse }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}