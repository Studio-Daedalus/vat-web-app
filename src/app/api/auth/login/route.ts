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

    return NextResponse.json({
      ok: true,
      tokens: result.AuthenticationResult,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Login failed' }, { status: 400 })
  }
}
