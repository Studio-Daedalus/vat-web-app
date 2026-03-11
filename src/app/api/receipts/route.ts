import { NextResponse } from 'next/server'
import { SearchUserReceipts } from '@/lib/server/receipts/searchUserReceipts'

export async function GET() {
  const result = await SearchUserReceipts()

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    )
  }

  return NextResponse.json(result.data, { status: 200 })
}
