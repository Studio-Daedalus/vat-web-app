import { NextResponse } from 'next/server'
import { GetReceipt } from '@/lib/server/receipts/getReceipt'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await GetReceipt(id)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    )
  }

  console.log('result: ', result)

  return NextResponse.json(result.data, { status: 200 })
}
