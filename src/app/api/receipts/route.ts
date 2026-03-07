import { NextResponse } from 'next/server'
import { GetAllReceipts } from '@/lib/server/receipts/getAllReceipts'

export async function GET() {
  const result = await GetAllReceipts()

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    )
  }

  return NextResponse.json(result.data, { status: 200 })
}
