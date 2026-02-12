'use client'

import Link from 'next/link'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { TextField } from '@/components/Fields'
import { Button } from '@/components/Button'
import { SlimLayout } from '@/components/SlimLayout'
import { Alert } from '@/components/Alert'

export default function Confirm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  // Handle Form Value states
  const [email, setEmail] = useState(emailFromUrl)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle whether the alert is shown, and in what state
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    setLoading(false)

    if (res.ok) {
      setAlert({
        type: 'success',
        message: 'Account confirmed successfully!',
      })

      router.push('/login?email=' + email)
    } else {
      setAlert({
        type: 'error',
        message: 'Invalid or expired confirmation code.',
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
            label="Email"
            name="email"
            type="text"
            placeholder={'Email'}
            value={emailFromUrl}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Confirmation Code"
            name="confirmation_code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
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
                    Confirm account <span aria-hidden="true">&rarr;</span>
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