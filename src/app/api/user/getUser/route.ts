import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // If user is already logged in, take them straight to the dashboard
    const cookieStore = await cookies()
    const token = cookieStore.get('id-token')

    const res = await fetch(
      'https://0363asb5xk.execute-api.eu-west-2.amazonaws.com/dev/user',
      {
        headers: {
          Authorization: token ? `Bearer ${token.value}` : '',
        },
        cache: 'no-store', // ensures fresh data from backend
      },
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: res.status },
      )
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: 'Internal proxy error' }, { status: 500 })
  }
}
