import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'
import type { GetReceiptResponse } from '@/types/api'

export type GetReceiptResult =
  | { ok: true; data: GetReceiptResponse }
  | { ok: false; status: number; message: string }

export async function GetReceipt(id: string): Promise<GetReceiptResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/receipts/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
        },
        cache: 'no-store',
      },
    )

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: json?.error ?? 'Failed to fetch receipt',
      }
    }

    return { ok: true, data: json.receipt as GetReceiptResponse }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}
