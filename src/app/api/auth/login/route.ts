import { NextResponse } from 'next/server'
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
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

    // Save the id-token JWT in the cookies list.
    const idToken = result.AuthenticationResult?.IdToken
    response.cookies.set('id-token', idToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    // Save the access-token JWT in the cookies list.
    const accessToken = result.AuthenticationResult?.AccessToken
    response.cookies.set('access-token', accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
