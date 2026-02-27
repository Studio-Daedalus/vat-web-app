'use client'

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

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E0DAD0] bg-[#FAF8F3]/80 backdrop-blur">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center gap-10">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[#2B3A2E] hover:bg-white/70 md:inline-flex"
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

            <div className="hidden text-xs font-medium text-[#7A8A7E] md:block">
              No card required
            </div>

            <div className="md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
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
