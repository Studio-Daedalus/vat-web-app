'use client'

import Link from 'next/link'

import { Button } from '@/components/Button'
import { SelectField, TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { useRouter } from 'next/navigation'
import { Alert } from '@/components/Alert'
import { useState } from 'react'

export default function Register() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  // Handle whether the alert is shown, and in what state
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true)
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const payload = {
      first_name: form.get('first_name'),
      last_name: form.get('last_name'),
      email: form.get('email'),
      password: form.get('password'),
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })
    setLoading(false)

    if (res.ok) {
      setAlert({
        type: 'info',
        message: 'A confirmation code has been sent to your email',
      })

      router.push('/confirm?email=' + payload.email)
    } else {
      setAlert({
        type: 'error',
        message: 'Unable to send Confirmation Code.',
      })
    }
  }

  return (
    <>
      {/* Show alert based on response from API */}
      {alert && <Alert type={alert.type} message={alert.message} />}

      <SlimLayout>
        <div className="flex">
          <Link href="/" aria-label="Home">
            <Logo className="h-10 w-auto" />
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900">
          Get started for free
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Already registered?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>{' '}
          to your account.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
        >
          <TextField
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <TextField
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          {/*<SelectField*/}
          {/*  className="col-span-full"*/}
          {/*  label="How did you hear about us?"*/}
          {/*  name="referral_source"*/}
          {/*>*/}
          {/*  <option>AltaVista search</option>*/}
          {/*  <option>Super Bowl commercial</option>*/}
          {/*  <option>Our route 34 city bus ad</option>*/}
          {/*  <option>The “Never Use This” podcast</option>*/}
          {/*</SelectField>*/}
          <div className="col-span-full">
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  LoadingCircle()
                ) : (
                  <>
                    Sign up <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </SlimLayout>
    </>
  )
}

// Graphics for spinner when element is loading
function LoadingCircle() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  )
}
