'use client'

import Link from 'next/link'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Alert } from "@/components/Alert";

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  // Handle Form Value states
  const [email, setEmail] = useState(emailFromUrl)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle whether the alert is shown, and in what state
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    setLoading(false)

    if (res.ok) {
      setAlert({type: 'success', message: 'Login successful'})
      router.push('/dashboard')
    } else {
      setAlert({type: 'error', message: 'Login failed'})
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Don’t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>{' '}
          for a free trial.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-y-8"
        >
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div>
            <Button
              type="submit"
              variant="solid"
              color="blue"
              className="w-full"
            >
              {loading ? (
                LoadingCircle()
              ) : (
                <span>
                  Sign in <span aria-hidden="true">&rarr;</span>
                </span>
              )}
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
