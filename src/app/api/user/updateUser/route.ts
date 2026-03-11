import { NextRequest, NextResponse } from 'next/server'
import { UpdateUser, UpdateUserBody } from '@/lib/server/user/updateUser'

export async function POST(req: NextRequest) {
  const body: UpdateUserBody = await req.json()

  const result = await UpdateUser(body)

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: result.status })
  }

  return NextResponse.json({}, { status: 200 })
}