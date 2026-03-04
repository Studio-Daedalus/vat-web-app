'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Image from 'next/image'

import dashboardIcon from '@/images/icons/dashboard.svg'
import receiptIcon from '@/images/icons/receipt.svg'
import warningIcon from '@/images/icons/warning.svg'
import settingsIcon from '@/images/icons/settings.svg'
import cameraIcon from '@/images/icons/camera.svg'

import { useReceiptUploadModal } from '@/components/ReceiptUploadModalContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

export type AppSidebarLayoutProps = {
  children: React.ReactNode
  companyName: string
  companyAvatarSrc?: string
  userName: string
  userAvatarSrc?: string
  planName: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  parchment: '#FAF8F3',
  forest: '#2B3A2E',
  fern: '#3E6B52',
  lichen: '#C4DCBE',
  bark: '#E0DAD0',
  stone: '#7A8A7E',
} as const

const DESKTOP_OPEN_W = 280
const DESKTOP_COLLAPSED_W = 96
const TOPBAR_H = 72

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function initialFrom(label: string) {
  const cleaned = (label || '').trim()
  if (!cleaned) return '?'
  return (cleaned.match(/[A-Za-z0-9]/)?.[0] ?? '?').toUpperCase()
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function NavIcon({ src, alt = '' }: { src: string; alt?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="h-5 w-5"
      unoptimized
      aria-hidden="true"
    />
  )
}

function SignOutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3m0 0 3-3m-3 3 3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 18h18l-2-10-5 4-2-6-2 6-5-4-2 10Z"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 18h18"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  name,
  src,
  size = 40,
}: {
  name: string
  src?: string
  size?: number
}) {
  const style = { width: size, height: size, borderColor: COLORS.bark }

  if (src) {
    return (
      <div
        className="overflow-hidden rounded-full border"
        style={{ ...style, background: '#fff' }}
        title={name}
        aria-label={name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border text-sm font-semibold"
      style={{ ...style, background: '#fff', color: COLORS.forest }}
      title={name}
      aria-label={name}
    >
      {initialFrom(name)}
    </div>
  )
}

// ─── Tooltip (collapsed sidebar) ──────────────────────────────────────────────

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
      <span
        className="rounded-lg border px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg"
        style={{
          borderColor: COLORS.bark,
          background: '#fff',
          color: COLORS.forest,
        }}
      >
        {label}
      </span>
    </span>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function AppSidebarLayout({
  children,
  companyName,
  companyAvatarSrc,
  userName,
  userAvatarSrc,
  planName,
}: AppSidebarLayoutProps) {
  const pathname = usePathname()
  const { openModal } = useReceiptUploadModal()

  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const desktopW = collapsed ? DESKTOP_COLLAPSED_W : DESKTOP_OPEN_W

  const nav: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <NavIcon src={dashboardIcon} />,
    },
    {
      label: 'Receipts',
      href: '/dashboard/receipts',
      icon: <NavIcon src={receiptIcon} />,
    },
    {
      label: 'VAT checks',
      href: '/dashboard/vat-checks',
      icon: <NavIcon src={warningIcon} />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <NavIcon src={settingsIcon} />,
    },
  ]

  // Close mobile drawer on Escape
  React.useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  // ── Nav link helpers ───────────────────────────────────────────────────────

  function isActive(href: string) {
    return (
      pathname === href || (href !== '/dashboard' && pathname?.startsWith(href))
    )
  }

  function DesktopNavLink({ item }: { item: NavItem }) {
    const active = isActive(item.href)
    return (
      <Link
        href={item.href}
        className={cx(
          'group relative flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
          collapsed ? 'justify-center' : 'gap-3',
          active
            ? 'bg-[#C4DCBE]/35 text-[#2B3A2E]'
            : 'text-[#2B3A2E]/80 hover:bg-[#C4DCBE]/25 hover:text-[#2B3A2E]',
        )}
      >
        <span
          className={cx(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
            active
              ? 'border-[#C4DCBE] bg-[#FAF8F3]'
              : 'border-[#E0DAD0] bg-[#FAF8F3]',
          )}
          style={{ color: active ? COLORS.fern : COLORS.forest }}
        >
          {item.icon}
        </span>
        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
        {collapsed && <Tooltip label={item.label} />}
      </Link>
    )
  }

  function MobileNavLink({ item }: { item: NavItem }) {
    const active = isActive(item.href)
    return (
      <Link
        href={item.href}
        className={cx(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          active
            ? 'bg-[#C4DCBE]/35 text-[#2B3A2E]'
            : 'text-[#2B3A2E]/80 hover:bg-[#C4DCBE]/25 hover:text-[#2B3A2E]',
        )}
        onClick={() => setMobileOpen(false)}
      >
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
          style={{
            borderColor: COLORS.bark,
            background: '#fff',
            color: COLORS.forest,
          }}
        >
          {item.icon}
        </span>
        <span className="whitespace-nowrap">{item.label}</span>
      </Link>
    )
  }

  // ── Sidebar action buttons ─────────────────────────────────────────────────

  const ScanButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <div
      className={cx(
        'group relative',
        !fullWidth && collapsed && 'flex justify-center',
      )}
    >
      <button
        type="button"
        onClick={openModal}
        className={cx(
          'rounded-lg font-semibold transition-colors',
          fullWidth
            ? 'w-full px-3 py-2 text-sm'
            : collapsed
              ? 'flex h-10 w-10 items-center justify-center border'
              : 'w-full px-3 py-2 text-sm',
        )}
        style={{
          background: COLORS.fern,
          color: '#fff',
          borderColor: COLORS.bark,
        }}
        aria-label="Scan a receipt"
      >
        {!fullWidth && collapsed ? (
          <Image
            src={cameraIcon}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            unoptimized
            aria-hidden="true"
          />
        ) : (
          'Scan a receipt'
        )}
      </button>
      {!fullWidth && collapsed && <Tooltip label="Scan a receipt" />}
    </div>
  )

  const SignOutButton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <div
      className={cx(
        'group relative',
        !fullWidth && collapsed && 'flex justify-center',
      )}
    >
      <button
        type="button"
        onClick={() => console.log('sign out')}
        className={cx(
          'rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-[#F0EDE6]',
          fullWidth
            ? 'w-full'
            : collapsed
              ? 'flex h-10 w-10 items-center justify-center p-0'
              : 'w-full',
        )}
        style={{ borderColor: COLORS.bark, color: COLORS.forest }}
        aria-label="Sign out"
      >
        {!fullWidth && collapsed ? <SignOutIcon /> : 'Sign out'}
      </button>
      {!fullWidth && collapsed && <Tooltip label="Sign out" />}
    </div>
  )

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" >
      {/* ── MOBILE TOP BAR ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 lg:hidden"
        style={{ background: COLORS.parchment, borderColor: COLORS.bark }}
      >
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: COLORS.bark, color: COLORS.forest }}
          aria-label="Open menu"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Menu
        </button>

        {/* Company name — always visible */}
        <span
          className="truncate text-sm font-semibold"
          style={{ color: COLORS.forest }}
        >
          {companyName}
        </span>

        <Avatar name={userName} src={userAvatarSrc} size={36} />
      </div>

      {/* ── DESKTOP TOP BAR ────────────────────────────────────────────────── */}
      {/*    Always shows: company name (left) · user name + plan + avatar (right) */}
      <div
        className="fixed top-0 right-0 z-30 hidden items-center justify-between border-b px-6 lg:flex"
        style={{
          left: desktopW,
          height: TOPBAR_H,
          background: COLORS.parchment,
          borderColor: COLORS.bark,
        }}
      >
        {/* LEFT: App / company name */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={companyName} src={companyAvatarSrc} size={40} />
          <span
            className="truncate text-sm font-semibold"
            style={{ color: COLORS.forest }}
          >
            {companyName}
          </span>
        </div>

        {/* RIGHT: User name · plan badge · avatar — always visible */}
        <div className="flex flex-shrink-0 items-center gap-4">
          <div className="flex flex-col items-end leading-tight">
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.forest }}
            >
              {userName}
            </span>
            <div
              className="mt-0.5 flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ background: '#F5F1E6' }}
            >
              <CrownIcon />
              <span
                className="text-xs font-medium"
                style={{ color: COLORS.stone }}
              >
                {planName}
              </span>
            </div>
          </div>
          <Avatar name={userName} src={userAvatarSrc} size={36} />
        </div>
      </div>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(43,58,46,0.35)' }}
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute top-0 left-0 h-full w-[84%] max-w-[320px] border-r shadow-xl"
            style={{ background: COLORS.parchment, borderColor: COLORS.bark }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={companyName} src={companyAvatarSrc} size={40} />
                <div className="min-w-0">
                  <div
                    className="truncate text-sm font-semibold"
                    style={{ color: COLORS.forest }}
                  >
                    {companyName}
                  </div>
                  <div
                    className="truncate text-xs"
                    style={{ color: COLORS.stone }}
                  >
                    {userName}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border p-2"
                style={{ borderColor: COLORS.bark, color: COLORS.forest }}
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="px-3 pb-4">
              <nav className="space-y-1">
                {nav.map((item) => (
                  <MobileNavLink key={item.href} item={item} />
                ))}
              </nav>
            </div>

            {/* Drawer footer actions */}
            <div
              className="absolute right-0 bottom-0 left-0 space-y-3 border-t p-4"
              style={{ borderColor: COLORS.bark }}
            >
              <ScanButton fullWidth />
              <SignOutButton fullWidth />
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col lg:border-r lg:shadow-sm"
        style={{
          width: desktopW,
          background: COLORS.parchment,
          borderColor: COLORS.bark,
        }}
      >
        {/* Collapse toggle */}
        <div
          className={cx(
            'flex items-center px-3 py-4',
            collapsed ? 'justify-center' : 'justify-end',
          )}
        >
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded-md border p-2"
            style={{ borderColor: COLORS.bark, color: COLORS.forest }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              {collapsed ? (
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <div className={cx('px-3', collapsed && 'px-2')}>
          <nav className="space-y-1">
            {nav.map((item) => (
              <DesktopNavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto space-y-3 p-4">
          <ScanButton />
          <SignOutButton />
        </div>
      </aside>

      {/* ── PAGE CONTENT ───────────────────────────────────────────────────── */}
      <main
        className="px-4 py-6 lg:px-8 lg:pt-(--topbar-h) lg:pl-(--sidebar-w)"
        style={{
          ['--sidebar-w' as any]: `${desktopW + 32}px`,
          ['--topbar-h' as any]: `${TOPBAR_H + 24}px`,
        }}
      >
        {children}
      </main>
    </div>
  )
}
