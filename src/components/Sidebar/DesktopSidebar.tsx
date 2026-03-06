'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import ReceiptUploader from '@/components/ReceiptUploader/ReceiptUploader'
import {
  C,
  IconDashboard,
  IconReceipt,
  IconVAT,
  IconSettings,
  IconUpload,
  IconSignOut,
  Logomark,
} from './icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  label: string
  href: string
  icon: (active: boolean) => React.ReactNode
}

export type DocketSidebarProps = {
  // onUpload is handled internally by DesktopSidebarLayout.
  // Remains optional so DocketSidebar can also be used standalone.
  onUpload?: () => void
  onSignOut?: () => void
}

export type DesktopSidebarLayoutProps = {
  children: React.ReactNode
  onSignOut?: () => void
}


function Tooltip({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 translate-x-1 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
      style={{
        fontFamily: 'Manrope, sans-serif',
        background: C.forest,
        color: C.parchment,
        border: `1px solid ${C.fern}40`,
        boxShadow: '0 4px 16px rgba(43,58,46,0.18)',
      }}
    >
      {label}
    </span>
  )
}

// ─── Upload modal ─────────────────────────────────────────────────────────────
// Renders ReceiptUploader inside a centred modal overlay.
// Closes on backdrop click or Escape key.
function UploadModal({ onClose }: { onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent scroll on body while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(43,58,46,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Upload receipt"
    >
      {/* Panel — stop clicks propagating to backdrop */}
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl"
        style={{
          background: C.parchment,
          border: `1px solid ${C.bark}`,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: C.bark }}
        >
          <span
            className="text-base font-semibold"
            style={{ fontFamily: 'Manrope, sans-serif', color: C.forest }}
          >
            Upload receipt
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#E0DAD0]"
            style={{ color: C.stone }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ReceiptUploader content */}
        <div className="p-6">
          <ReceiptUploader />
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function DocketSidebar({ onUpload, onSignOut }: DocketSidebarProps) {
  const pathname = usePathname()

  const nav: NavItem[] = [
    {
      label: 'DashboardPage',
      href: '/dashboard',
      icon: (a) => <IconDashboard active={a} />,
    },
    {
      label: 'Receipts',
      href: '/dashboard/receipts',
      icon: (a) => <IconReceipt active={a} />,
    },
    {
      label: 'VAT Summary',
      href: '/dashboard/vat-summary',
      icon: (a) => <IconVAT active={a} />,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: (a) => <IconSettings active={a} />,
    },
  ]

  function isActive(href: string) {
    return (
      pathname === href || (href !== '/dashboard' && pathname?.startsWith(href))
    )
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex w-[80px] flex-col items-center py-5"
      style={{
        background: C.parchment,
        borderRight: `1px solid ${C.bark}`,
        boxShadow: '2px 0 12px rgba(43,58,46,0.06)',
      }}
    >
      {/* ── Logomark ───────────────────────────────────────────────────── */}
      <div
        className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: C.forest }}
      >
        <Logomark />
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div className="mb-4 w-8 border-t" style={{ borderColor: C.bark }} />

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <nav className="flex flex-1 flex-col" style={{ gap: '8px' }}>
        {nav.map((item) => {
          const active = isActive(item.href)
          return (
            <div
              key={item.href}
              className="group relative flex justify-center"
              style={{ paddingTop: 8, paddingBottom: 8 }}
            >
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  background: active ? `${C.lichen}90` : `${C.bark}80`,
                  boxShadow: active ? `inset 0 0 0 1px ${C.lichen}` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      `${C.lichen}60`
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      `${C.bark}80`
                }}
              >
                {item.icon(active)}
              </Link>
              <Tooltip label={item.label} />
            </div>
          )
        })}
      </nav>

      {/* ── Bottom actions ──────────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ gap: '0px' }}>
        <div
          className="mx-auto mb-2 w-8 border-t"
          style={{ borderColor: C.bark }}
        />

        {/* Upload receipt — Fern primary */}
        <div
          className="group relative flex justify-center"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          <button
            type="button"
            onClick={() => onUpload?.()}
            aria-label="Upload receipt"
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150"
            style={{
              background: C.fern,
              color: C.parchment,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = '#2F5A44'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = C.fern
            }}
          >
            <IconUpload />
          </button>
          <Tooltip label="Upload receipt" />
        </div>

        {/* Sign out — Stone by default, error red on hover */}
        <div
          className="group relative flex justify-center"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          <button
            type="button"
            onClick={() => onSignOut?.()}
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150"
            style={{
              background: `${C.bark}80`,
              color: C.stone,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background =
                `${C.error}15`
              ;(e.currentTarget as HTMLElement).style.color = C.error
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = `${C.bark}80`
              ;(e.currentTarget as HTMLElement).style.color = C.stone
            }}
          >
            <IconSignOut />
          </button>
          <Tooltip label="Sign out" />
        </div>
      </div>
    </aside>
  )
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────
// Owns the upload modal state. Callers only need to pass onSignOut.

export function DesktopSidebarLayout({
  children,
  onSignOut,
}: DesktopSidebarLayoutProps) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const closeUpload = useCallback(() => setUploadOpen(false), [])

  return (
    <div className="min-h-screen" style={{ background: C.parchment }}>
      <DocketSidebar
        onUpload={() => setUploadOpen(true)}
        onSignOut={onSignOut}
      />

      <main style={{ paddingLeft: 80 }}>{children}</main>

      {uploadOpen && <UploadModal onClose={closeUpload} />}
    </div>
  )
}
