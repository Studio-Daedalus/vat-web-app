import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'
import { UpdateReceiptRequest } from '@/types/api'

export type UpdateReceiptResult =
  | { ok: true }
  | { ok: false; status: number; message: string }

export async function UpdateReceipt(
  id: string,
  body: UpdateReceiptRequest,
): Promise<UpdateReceiptResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/receipts/${id}/update`,
      {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!res.ok) {
      const json = await res.json().catch(() => null)
      return {
        ok: false,
        status: res.status,
        message: json?.error ?? 'Failed to update receipt',
      }
    }

    return { ok: true }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}