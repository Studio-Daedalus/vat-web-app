'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

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

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailFromUrl)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)

    if (res.ok) {
      setAlert({ type: 'success', message: 'Signed in successfully.' })
      router.push('/dashboard')
    } else {
      setAlert({ type: 'error', message: 'Incorrect email or password.' })
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
            <span className="rounded-full border border-[#E0DAD0] bg-white/70 px-3 py-1 text-xs font-semibold text-[#2B3A2E]">
              Calm VAT clarity
            </span>
          </div>

          <div className="mt-10 rounded-3xl border border-[#E0DAD0] bg-white/70 p-7 shadow-sm backdrop-blur">
            <h2 className="font-display text-2xl tracking-tight text-[#2B3A2E]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7A8A7E]">
              Sign in to view your receipts, VAT notes, and monthly exports.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-[#2B3A2E]">
              {[
                'See reclaimable VAT at a glance',
                'Spot HMRC-risky receipts before filing',
                'Keep everything organised by month',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckBadge className="mt-0.5 h-5 w-5 text-[#3E6B52]" />
                  <span className="text-[#2B3A2E]">{t}</span>
                </li>
              ))}
            </ul>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-1 gap-y-6"
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

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="solid"
                  className="w-full rounded-xl bg-[#3E6B52] px-4 py-3 text-white hover:bg-[#2F5A44]"
                >
                  {loading ? (
                    <LoadingCircle />
                  ) : (
                    <span>
                      Sign in <span aria-hidden="true">&rarr;</span>
                    </span>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-[#7A8A7E]">
                Don’t have an account?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-[#2B3A2E] underline decoration-[#C4DCBE] underline-offset-4 hover:opacity-80"
                >
                  Create one for free
                </Link>
                .
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
