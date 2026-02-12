import { NextResponse } from 'next/server'
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
})

export async function POST(req: Request) {
  const body = await req.json()

  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: body.email,
    ConfirmationCode: body.code,
  })

  try {
    await client.send(command)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 400 })
  }
}
