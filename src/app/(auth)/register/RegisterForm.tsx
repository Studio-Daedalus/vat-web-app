'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { Alert } from '@/components/Alert'

function CheckBadge(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.2 12.9 7.3 11a1 1 0 0 0-1.4 1.4l2.6 2.6a1 1 0 0 0 1.5-.1l6.8-8.4A1 1 0 1 0 15.3 5l-6.1 7.9Z"
        fill="currentColor"
      />
      <path
        d="M12 22A10 10 0 1 1 12 2a10 10 0 0 1 0 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
    </svg>
  )
}

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

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
        message: 'We’ve sent a confirmation code to your email.',
      })
      router.push('/confirm?email=' + payload.email)
    } else {
      setAlert({
        type: 'error',
        message: 'Unable to create account. Please try again.',
      })
    }
  }

  return (
    <>
      {alert && <Alert type={alert.type} message={alert.message} />}

      <SlimLayout>
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            <span className="rounded-full bg-[#C4DCBE] px-3 py-1 text-xs font-semibold text-[#2B3A2E]">
              Free tier available
            </span>
          </div>

          <div className="mt-10 rounded-3xl border border-[#E0DAD0] bg-white/70 p-7 shadow-sm backdrop-blur">
            <h2 className="font-display text-2xl tracking-tight text-[#2B3A2E]">
              Create your Docket account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7A8A7E]">
              Upload receipts, get VAT notes in plain English, and keep monthly
              exports tidy.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#2B3A2E]">
              {[
                '10 free scans every month',
                'Flags invalid VAT receipts (like card slips)',
                'Exports ready for your accountant',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckBadge className="mt-0.5 h-5 w-5 text-[#3E6B52]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2"
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

              <div className="col-span-full pt-2">
                <Button
                  type="submit"
                  variant="solid"
                  className="w-full rounded-xl bg-[#3E6B52] px-4 py-3 text-white hover:bg-[#2F5A44]"
                  disabled={loading}
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <LoadingCircle />
                    ) : (
                      <>
                        Create account <span aria-hidden="true">&rarr;</span>
                      </>
                    )}
                  </span>
                </Button>
              </div>

              <p className="col-span-full text-center text-sm text-[#7A8A7E]">
                Already registered?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#2B3A2E] underline decoration-[#C4DCBE] underline-offset-4 hover:opacity-80"
                >
                  Sign in
                </Link>
                .
              </p>

              <p className="col-span-full text-center text-xs text-[#7A8A7E]">
                By creating an account you agree to keep your receipts for your
                records.
              </p>
            </form>
          </div>
        </div>
      </SlimLayout>
    </>
  )
}

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
