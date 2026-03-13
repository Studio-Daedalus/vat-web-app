import { NextResponse } from 'next/server'
import { UpdateLineItem } from '@/lib/server/receipts/updateLineItem'
import { UpdateLineItemRequest } from '@/types/api'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; index: string }> },
) {
  const { id, index } = await params

  let body: UpdateLineItemRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = await UpdateLineItem(id, Number(index), body)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    )
  }

  return NextResponse.json({}, { status: 200 })
}
