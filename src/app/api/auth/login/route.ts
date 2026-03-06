import { NextResponse } from 'next/server'
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION,
})

export async function POST(req: Request) {
  const body = await req.json()

  const command = new InitiateAuthCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: body.email,
      PASSWORD: body.password,
    },
  })

  try {
    const result = await client.send(command)

    const response = NextResponse.json({ ok: true })

    const idToken = result.AuthenticationResult?.IdToken
    const accessToken = result.AuthenticationResult?.AccessToken
    const refreshToken = result.AuthenticationResult?.RefreshToken
    const expiresIn = result.AuthenticationResult?.ExpiresIn ?? 3600

    const baseOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    // access-token and id-token expire when Cognito says (default 1 hour)
    response.cookies.set('id-token', idToken!, { ...baseOpts, maxAge: expiresIn })
    response.cookies.set('access-token', accessToken!, { ...baseOpts, maxAge: expiresIn })

    // refresh-token matches Cognito's refresh token validity (default 30 days)
    response.cookies.set('refresh-token', refreshToken!, {
      ...baseOpts,
      maxAge: 30 * 24 * 60 * 60,
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
