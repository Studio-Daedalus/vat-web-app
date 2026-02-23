import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { fetchApiWithAutoRefresh } from '@/lib/fetchWithAuth'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('id-token')

    const body = await req.json().catch(() => null)

    if (!body?.filename || typeof body.filename !== 'string') {
      return NextResponse.json(
        { error: 'filename is required' },
        { status: 400 },
      )
    }

    const res = await fetchApiWithAutoRefresh(
      'https://ukemh71u1e.execute-api.eu-west-2.amazonaws.com/dev/receipts/uploadURL',
      {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: body.filename,
          contentType: body.contentType, // optional
        }),
        cache: 'no-store',
      },
    )

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error ?? 'Failed to create upload URL' },
        { status: res.status },
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal proxy error' }, { status: 500 })
  }
}
