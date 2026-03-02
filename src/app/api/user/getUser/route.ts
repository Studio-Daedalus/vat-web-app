import { NextResponse } from 'next/server'
import { GetUser } from '@/lib/server/user/getUser'

export async function GET() {
  const result = await GetUser()

  if (!result.ok) {
    return NextResponse.json(
      { error: result.message },
      { status: result.status },
    )
  }

  return NextResponse.json(result.user, { status: 200 })
}
