import { NextResponse } from 'next/server'
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
})

export async function POST(req: Request) {
  const body = await req.json()

  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: body.email,
    Password: body.password,
    UserAttributes: [
      { Name: 'email', Value: body.email },
      { Name: 'given_name', Value: body.first_name },
      { Name: 'family_name', Value: body.last_name },
    ],
  })

  try {
    await client.send(command)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Signup failed' }, { status: 400 })
  }
}
