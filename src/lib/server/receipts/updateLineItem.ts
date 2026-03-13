import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'
import { UpdateLineItemRequest, UpdateReceiptRequest } from '@/types/api'

export type UpdateLineItemResult =
  | { ok: true }
  | { ok: false; status: number; message: string }

export async function UpdateLineItem(
  receiptID: string,
  lineItemIndex: number,
  body: UpdateLineItemRequest,
): Promise<UpdateLineItemResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/receipts/${receiptID}/lineItem/${lineItemIndex}/update`,
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
        message: json?.error ?? 'Failed to update line item',
      }
    }

    return { ok: true }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}