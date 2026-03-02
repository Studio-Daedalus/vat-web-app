'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-[#2B3A2E] transition hover:bg-white/70 hover:text-[#2B3A2E]"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <PopoverButton
      as={Link}
      href={href}
      className="block w-full rounded-xl px-3 py-2 text-base font-semibold text-[#2B3A2E] hover:bg-[#FAF8F3]"
    >
      {children}
    </PopoverButton>
  )
}

/**
 * Header behavior:
 * - fixed at top
 * - scroll down => hide (translateY -100%)
 * - scroll up => show
 */
export function Header() {
  const HEADER_HEIGHT_PX = 80 // approx: py-4 + content. Adjust if needed.
  const THRESHOLD = 10 // prevents jitter

  const [hidden, setHidden] = React.useState(false)

  const lastYRef = React.useRef(0)
  const tickingRef = React.useRef(false)

  React.useEffect(() => {
    lastYRef.current = window.scrollY || 0

    const onScroll = () => {
      const currentY = window.scrollY || 0
      const delta = currentY - lastYRef.current

      if (tickingRef.current) return
      tickingRef.current = true

      window.requestAnimationFrame(() => {
        // Always show when near top
        if (currentY < 8) {
          setHidden(false)
        } else if (Math.abs(delta) >= THRESHOLD) {
          // scrolling down => hide, scrolling up => show
          setHidden(delta > 0)
        }

        lastYRef.current = currentY
        tickingRef.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Fixed, sliding header */}
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 border-b border-[#E0DAD0] bg-[#FAF8F3]/80 backdrop-blur',
          'transform-gpu transition-transform duration-200 ease-out',
          hidden ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <Container>
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-10">
              <Link href="/" aria-label="Home">
                <Logo />
              </Link>

              <div className="hidden items-center gap-1 lg:flex">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#how-it-works">How it works</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
                <NavLink href="#faq">FAQ</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#2B3A2E] hover:bg-white/70 lg:inline-flex"
              >
                Sign in
              </Link>

              <Button
                href="/register"
                className={clsx(
                  'rounded-xl bg-[#3E6B52] px-5 py-2.5 text-sm font-semibold text-white',
                  'shadow-sm hover:bg-[#2F5A44]',
                )}
              >
                Create free account
              </Button>

              <div className="hidden text-xs font-medium text-[#7A8A7E] lg:block">
                No card required
              </div>

              <div className="lg:hidden">
                <MobileNavigation />
              </div>
            </div>
          </nav>
        </Container>
      </header>

      {/* Spacer so content doesn't sit under the fixed header */}
      <div style={{ height: HEADER_HEIGHT_PX }} />
    </>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E0DAD0] bg-white/60 text-[#2B3A2E] shadow-sm hover:bg-white"
        aria-label="Open menu"
      >
        {({ open }) => (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M5 7h14M5 12h14M5 17h14" />
            )}
          </svg>
        )}
      </PopoverButton>

      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-[#2B3A2E]/10 backdrop-blur-sm duration-150"
      />

      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-3 origin-top rounded-3xl border border-[#E0DAD0] bg-white/95 p-4 shadow-xl backdrop-blur"
      >
        <div className="flex items-center justify-between px-2 pb-2">
          <Logo />
          <span className="rounded-full bg-[#C4DCBE] px-3 py-1 text-xs font-semibold text-[#2B3A2E]">
            No card required
          </span>
        </div>

        <div className="mt-2 space-y-1">
          <MobileNavLink href="#features">Features</MobileNavLink>
          <MobileNavLink href="#how-it-works">How it works</MobileNavLink>
          <MobileNavLink href="#pricing">Pricing</MobileNavLink>
          <MobileNavLink href="#faq">FAQ</MobileNavLink>
        </div>

        <div className="mt-4 grid gap-2 border-t border-[#E0DAD0] pt-4">
          <Button
            href="/register"
            className="w-full rounded-xl bg-[#3E6B52] px-4 py-3 text-white hover:bg-[#2F5A44]"
          >
            Create free account
          </Button>
          <Button
            href="/login"
            variant="outline"
            className="w-full rounded-xl border-[#E0DAD0] bg-transparent px-4 py-3 text-[#2B3A2E] hover:bg-[#FAF8F3]"
          >
            Sign in
          </Button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
