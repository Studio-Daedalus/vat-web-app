import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'

export type CreateUploadUrlInput = {
  filename: string
  contentType?: string
}

export type CreateUploadUrlResponse = {
  receiptId: string
  s3Key: string
  uploadUrl: string
  uploadMethod?: string
  expiresInSecs?: number
}

export type CreateUploadUrlResult =
  | { ok: true; data: CreateUploadUrlResponse }
  | { ok: false; status: number; message: string }

export async function createUploadUrl(
  input: CreateUploadUrlInput,
): Promise<CreateUploadUrlResult> {
  try {
    if (!input?.filename || typeof input.filename !== 'string') {
      return { ok: false, status: 400, message: 'filename is required' }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('id-token')

    const res = await fetchApiWithAutoRefresh(
      `${process.env.API_BASE_URL}/receipts/uploadURL`,
      {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: input.filename,
          contentType: input.contentType, // optional
        }),
        cache: 'no-store',
      },
    )

    const json = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: json?.error ?? 'Failed to create upload URL',
      }
    }

    if (!json?.uploadUrl || typeof json.uploadUrl !== 'string') {
      return {
        ok: false,
        status: 502,
        message: 'Backend did not return a valid uploadUrl',
      }
    }

    return { ok: true, data: json as CreateUploadUrlResponse }
  } catch {
    return { ok: false, status: 500, message: 'Internal server error' }
  }
}
