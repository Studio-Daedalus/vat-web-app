import { NextResponse } from 'next/server'
import { UpdateReceipt } from '@/lib/server/receipts/updateReceipt'
import { UpdateReceiptRequest } from '@/types/api'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let body: UpdateReceiptRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = await UpdateReceipt(id, body)

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status })
  }

  return NextResponse.json({}, { status: 200 })
}