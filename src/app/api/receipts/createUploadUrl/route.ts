import { NextResponse } from 'next/server'
import { createUploadUrl } from '@/lib/server/receipts/createUploadUrl'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const result = await createUploadUrl({
      filename: body?.filename,
      contentType: body?.contentType,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status },
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Internal proxy error' }, { status: 500 })
  }
}
