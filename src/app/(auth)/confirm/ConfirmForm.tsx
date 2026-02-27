'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Logo } from '@/components/Logo'
import { TextField } from '@/components/Fields'
import { Button } from '@/components/Button'
import { SlimLayout } from '@/components/SlimLayout'
import { Alert } from '@/components/Alert'

export default function ConfirmForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  // 6 separate digits
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value
    setDigits(newDigits)

    // Auto advance
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(
    e: React.ClipboardEvent<HTMLInputElement>,
    startIndex: number,
  ) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const cleaned = pasted.replace(/\D/g, '').slice(0, 6)
    if (!cleaned) return

    const newDigits = [...digits]
    for (let i = 0; i < cleaned.length; i++) {
      const idx = startIndex + i
      if (idx > 5) break
      newDigits[idx] = cleaned[i]
    }
    setDigits(newDigits)

    // Focus the next empty box (or the last one)
    const nextIndex = Math.min(startIndex + cleaned.length, 5)
    inputsRef.current[nextIndex]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')

    if (code.length !== 6) {
      setAlert({ type: 'error', message: 'Please enter the 6-digit code.' })
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailFromUrl, code }),
    })

    setLoading(false)

    if (res.ok) {
      setAlert({ type: 'success', message: 'Account confirmed successfully.' })
      router.push('/login?email=' + encodeURIComponent(emailFromUrl))
    } else {
      setAlert({
        type: 'error',
        message: 'Invalid or expired confirmation code.',
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
            <span className="rounded-full border border-[#E0DAD0] bg-white/70 px-3 py-1 text-xs font-semibold text-[#2B3A2E]">
              One last step
            </span>
          </div>

          <div className="mt-10 rounded-3xl border border-[#E0DAD0] bg-white/70 p-7 shadow-sm backdrop-blur">
            <h2 className="font-display text-2xl tracking-tight text-[#2B3A2E]">
              Confirm your email
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#7A8A7E]">
              Enter the 6-digit confirmation code sent to your email.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Disabled full-width email */}
              <div>
                <label className="block text-sm font-medium text-[#2B3A2E]">
                  Email
                </label>
                <input
                  type="email"
                  value={emailFromUrl}
                  disabled
                  className="mt-2 w-full rounded-xl border border-[#E0DAD0] bg-[#FAF8F3] px-4 py-3 text-sm text-[#2B3A2E] opacity-90"
                />
              </div>

              {/* 6 digit code inputs */}
              <div>
                <label className="block text-sm font-medium text-[#2B3A2E]">
                  Confirmation code
                </label>

                <div className="mt-3 flex justify-between gap-2">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {inputsRef.current[index] = el}}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(e, index)}
                      className="h-12 w-12 rounded-xl border border-[#E0DAD0] bg-white text-center text-lg font-semibold text-[#2B3A2E] focus:border-[#3E6B52] focus:ring-2 focus:ring-[#C4DCBE] focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-[#3E6B52] px-4 py-3 text-white hover:bg-[#2F5A44]"
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm account →'}
              </Button>

              <p className="text-center text-sm text-[#7A8A7E]">
                Already confirmed?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[#2B3A2E] underline decoration-[#C4DCBE] underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </SlimLayout>
    </>
  )
}
