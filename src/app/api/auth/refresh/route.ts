import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { clearAuthCookies } from '@/lib/auth/clearAuthCookies'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
})

export async function POST() {
  const cookieStore = await cookies()

  const refreshToken = cookieStore.get('refresh-token')?.value
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const cmd = new InitiateAuthCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  })

  try {
    const result = await client.send(cmd)

    const accessToken = result.AuthenticationResult?.AccessToken
    const idToken = result.AuthenticationResult?.IdToken
    const expiresIn = result.AuthenticationResult?.ExpiresIn ?? 3600 // seconds

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Refresh returned no access token' },
        { status: 401 },
      )
    }

    const res = NextResponse.json({ ok: true })

    const opts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: expiresIn,
    }

    res.cookies.set('access-token', accessToken, opts)
    if (idToken) res.cookies.set('id-token', idToken, opts)

    return res
  } catch {
    await clearAuthCookies()
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
  }
}
