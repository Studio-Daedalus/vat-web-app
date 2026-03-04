'use client'

import Link from 'next/link'
import { useReceiptUploadModal } from '@/components/ReceiptUploadModalContext'
import {
  DEMO_DASHBOARD,
  type DashboardData,
} from '@/components/Dashboard/dashboardTypes'
import type { Receipt } from '@/components/ReceiptTable'
import type {
  VatCheck,
  CheckSeverity,
} from '@/components/VatChecks/vatChecksTypes'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

// ─── Severity config (mirrors VatChecksPage) ──────────────────────────────────

const SEVERITY_CONFIG: Record<
  CheckSeverity,
  { bg: string; border: string; text: string; dot: string }
> = {
  error: {
    bg: 'rgba(196,90,74,0.07)',
    border: 'rgba(196,90,74,0.25)',
    text: '#C45A4A',
    dot: '#C45A4A',
  },
  warning: {
    bg: 'rgba(212,135,74,0.07)',
    border: 'rgba(212,135,74,0.25)',
    text: '#B86E2A',
    dot: '#D4874A',
  },
  info: {
    bg: 'rgba(74,122,138,0.07)',
    border: 'rgba(74,122,138,0.22)',
    text: '#4A7A8A',
    dot: '#4A7A8A',
  },
  passed: {
    bg: 'rgba(61,160,106,0.07)',
    border: 'rgba(61,160,106,0.2)',
    text: '#2D8055',
    dot: '#3DA06A',
  },
}

const RECEIPT_STATUS_CONFIG = {
  claimed: {
    label: 'Claimed',
    dot: '#3DA06A',
    text: '#2D8055',
    bg: 'rgba(61,160,106,0.08)',
    border: 'rgba(61,160,106,0.2)',
  },
  pending: {
    label: 'Pending',
    dot: '#D4874A',
    text: '#B86E2A',
    bg: 'rgba(212,135,74,0.08)',
    border: 'rgba(212,135,74,0.2)',
  },
  flagged: {
    label: 'Flagged',
    dot: '#C45A4A',
    text: '#C45A4A',
    bg: 'rgba(196,90,74,0.08)',
    border: 'rgba(196,90,74,0.2)',
  },
}

// ─── Small reusable pieces ────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-3 text-xs font-semibold tracking-widest uppercase"
      style={{ color: '#7A8A7E' }}
    >
      {children}
    </h2>
  )
}

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
    >
      {children}
    </div>
  )
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

type KpiCardProps = {
  label: string
  value: string
  sub: string
  accent: string
  icon: React.ReactNode
  href?: string
}

function KpiCard({ label, value, sub, accent, icon, href }: KpiCardProps) {
  const inner = (
    <div
      className="group relative overflow-hidden rounded-2xl border p-5 transition-shadow duration-150 hover:shadow-md"
      style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
    >
      {/* Subtle tinted corner */}
      <div
        className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-10"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}18` }}
        >
          {icon}
        </div>
        {href && (
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#E0DAD0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 flex-shrink-0 transition-colors duration-150 group-hover:stroke-[#7A8A7E]"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>

      <p
        className="mt-4 text-2xl font-bold"
        style={{ color: accent, fontFamily: 'Manrope, sans-serif' }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold" style={{ color: '#2B3A2E' }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: '#7A8A7E' }}>
        {sub}
      </p>
    </div>
  )

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  )
}

// ─── Welcome / period banner ──────────────────────────────────────────────────

function WelcomeBanner({ data }: { data: DashboardData }) {
  const { openModal } = useReceiptUploadModal()
  const days = daysUntil(data.period.submissionDeadline)
  const urgent = days <= 14
  const { status } = data.period

  const statusConfig = {
    ready: {
      label: 'Ready to submit',
      dot: '#3DA06A',
      text: '#2D8055',
      bg: 'rgba(61,160,106,0.1)',
      border: 'rgba(61,160,106,0.2)',
    },
    'needs-attention': {
      label: 'Needs attention',
      dot: '#D4874A',
      text: '#B86E2A',
      bg: 'rgba(212,135,74,0.1)',
      border: 'rgba(212,135,74,0.2)',
    },
    'at-risk': {
      label: 'At risk',
      dot: '#C45A4A',
      text: '#C45A4A',
      bg: 'rgba(196,90,74,0.1)',
      border: 'rgba(196,90,74,0.2)',
    },
  }[status]

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6"
      style={{ backgroundColor: '#2B3A2E', borderColor: '#3E6B52' }}
    >
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            'repeating-linear-gradient(-45deg, #FAF8F3 0px, #FAF8F3 1px, transparent 1px, transparent 10px)',
        }}
      />
      {/* Glow orb */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10"
        style={{ backgroundColor: '#6AAF7B', filter: 'blur(32px)' }}
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div>
          <p className="text-sm font-medium" style={{ color: '#C4DCBE' }}>
            {greeting}, {data.userName.split(' ')[0]} 👋
          </p>
          <p
            className="mt-1 text-xl font-bold sm:text-2xl"
            style={{ color: '#FAF8F3', fontFamily: 'Manrope, sans-serif' }}
          >
            {data.period.label}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Period status */}
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: statusConfig.bg,
                borderColor: statusConfig.border,
                color: statusConfig.text,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: statusConfig.dot }}
              />
              {statusConfig.label}
            </span>

            {/* Deadline chip */}
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: urgent
                  ? 'rgba(196,90,74,0.15)'
                  : 'rgba(196,220,190,0.1)',
                borderColor: urgent
                  ? 'rgba(196,90,74,0.35)'
                  : 'rgba(196,220,190,0.3)',
                color: urgent ? '#FFADA3' : '#C4DCBE',
              }}
            >
              <svg
                width="11"
                height="11"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {days > 0 ? `${days} days to deadline` : 'Deadline passed'}
            </span>
          </div>
        </div>

        {/* Right: quick action */}
        <button
          type="button"
          onClick={openModal}
          className="flex flex-shrink-0 items-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 sm:self-auto"
          style={{ backgroundColor: '#3E6B52', color: '#FAF8F3' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4a7d60'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3E6B52'
          }}
        >
          <svg
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Scan a receipt
        </button>
      </div>
    </div>
  )
}

// ─── Recent receipts panel ────────────────────────────────────────────────────

function RecentReceipts({
  receipts,
  totalCount,
}: {
  receipts: Receipt[]
  totalCount: number
}) {
  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <SectionHeading>Recent receipts</SectionHeading>
        <Link
          href="/dashboard/receipts"
          className="text-xs font-semibold underline underline-offset-2 transition-colors duration-150"
          style={{ color: '#3E6B52' }}
        >
          View all {totalCount}
        </Link>
      </div>

      <div className="space-y-1">
        {receipts.map((r) => {
          const sc = RECEIPT_STATUS_CONFIG[r.status]
          return (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-100"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0EDE6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Vendor initial */}
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ backgroundColor: '#C4DCBE', color: '#3E6B52' }}
              >
                {r.vendor.charAt(0).toUpperCase()}
              </div>

              {/* Vendor + date */}
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold"
                  style={{ color: '#2B3A2E' }}
                >
                  {r.vendor}
                </p>
                <p className="text-xs" style={{ color: '#7A8A7E' }}>
                  {fmtDate(r.date)}
                </p>
              </div>

              {/* VAT amount */}
              <div className="text-right">
                <p
                  className="text-sm font-bold tabular-nums"
                  style={{ color: r.vatAmount > 0 ? '#3E6B52' : '#7A8A7E' }}
                >
                  {fmt(r.vatAmount)}
                </p>
                <p className="text-xs" style={{ color: '#7A8A7E' }}>
                  VAT
                </p>
              </div>

              {/* Status pill */}
              <span
                className="hidden flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold sm:inline-flex"
                style={{
                  backgroundColor: sc.bg,
                  border: `1px solid ${sc.border}`,
                  color: sc.text,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: sc.dot }}
                />
                {sc.label}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ─── VAT checks snapshot panel ────────────────────────────────────────────────

function VatChecksSnapshot({ checks }: { checks: VatCheck[] }) {
  const errors = checks.filter((c) => c.severity === 'error').length
  const warnings = checks.filter((c) => c.severity === 'warning').length
  const total = checks.length

  return (
    <Card className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <SectionHeading>VAT checks</SectionHeading>
        <Link
          href="/vat-checks"
          className="text-xs font-semibold underline underline-offset-2"
          style={{ color: '#3E6B52' }}
        >
          Full review
        </Link>
      </div>

      {/* Summary chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {errors > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: SEVERITY_CONFIG.error.bg,
              borderColor: SEVERITY_CONFIG.error.border,
              color: SEVERITY_CONFIG.error.text,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: SEVERITY_CONFIG.error.dot }}
            />
            {errors} error{errors !== 1 ? 's' : ''}
          </span>
        )}
        {warnings > 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: SEVERITY_CONFIG.warning.bg,
              borderColor: SEVERITY_CONFIG.warning.border,
              color: SEVERITY_CONFIG.warning.text,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: SEVERITY_CONFIG.warning.dot }}
            />
            {warnings} warning{warnings !== 1 ? 's' : ''}
          </span>
        )}
        {total === 0 && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: SEVERITY_CONFIG.passed.bg,
              borderColor: SEVERITY_CONFIG.passed.border,
              color: SEVERITY_CONFIG.passed.text,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: SEVERITY_CONFIG.passed.dot }}
            />
            All checks passed
          </span>
        )}
      </div>

      {/* Top issues */}
      <div className="space-y-2">
        {checks.slice(0, 3).map((check) => {
          const sc = SEVERITY_CONFIG[check.severity]
          return (
            <div
              key={check.id}
              className="flex items-start gap-2.5 rounded-xl border p-3"
              style={{ backgroundColor: sc.bg, borderColor: sc.border }}
            >
              <span className="mt-0.5 flex-shrink-0">
                {check.severity === 'error' ? (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#C45A4A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#D4874A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                )}
              </span>
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold"
                  style={{ color: '#2B3A2E' }}
                >
                  {check.title}
                </p>
                {check.affectedVendor && (
                  <p className="mt-0.5 text-xs" style={{ color: '#7A8A7E' }}>
                    {check.affectedVendor}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {total > 3 && (
        <Link
          href="/vat-checks"
          className="mt-3 block text-center text-xs font-medium transition-colors duration-150"
          style={{ color: '#7A8A7E' }}
        >
          +{total - 3} more issue{total - 3 !== 1 ? 's' : ''} to review →
        </Link>
      )}

      {total === 0 && (
        <div className="flex flex-col items-center py-4 text-center">
          <svg
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#3DA06A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="mt-2 text-sm font-medium" style={{ color: '#2D8055' }}>
            No issues found. You're good to go.
          </p>
        </div>
      )}
    </Card>
  )
}

// ─── Quick actions panel ──────────────────────────────────────────────────────

function QuickActions() {
  const { openModal } = useReceiptUploadModal()

  const actions = [
    {
      label: 'Scan a receipt',
      sub: 'Upload JPG, PNG or PDF',
      onClick: openModal,
      href: null,
      iconBg: '#C4DCBE',
      iconColor: '#3E6B52',
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: 'View receipts',
      sub: 'See your full history',
      onClick: null,
      href: '/dashboard/receipts',
      iconBg: '#F0EDE6',
      iconColor: '#2B3A2E',
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      label: 'Review VAT checks',
      sub: 'Pre-submission review',
      onClick: null,
      href: '/vat-checks',
      iconBg: '#F0EDE6',
      iconColor: '#2B3A2E',
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ]

  return (
    <Card>
      <SectionHeading>Quick actions</SectionHeading>
      <div className="space-y-2">
        {actions.map(
          ({ label, sub, onClick, href, iconBg, iconColor, icon }) => {
            const inner = (
              <div
                className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-100"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0EDE6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  {icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: '#2B3A2E' }}
                  >
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: '#7A8A7E' }}>
                    {sub}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#E0DAD0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )

            return onClick ? (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="w-full text-left"
              >
                {inner}
              </button>
            ) : (
              <Link key={label} href={href!}>
                {inner}
              </Link>
            )
          },
        )}
      </div>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage({
  data = DEMO_DASHBOARD,
}: {
  data?: DashboardData
}) {
  const errors = data.openChecks.filter((c) => c.severity === 'error').length
  const warnings = data.openChecks.filter(
    (c) => c.severity === 'warning',
  ).length
  const flagged = data.recentReceipts.filter(
    (r) => r.status === 'flagged',
  ).length

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <WelcomeBanner data={data} />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="VAT reclaimable"
          value={fmt(data.period.vatReclaimable)}
          sub="Input VAT this period"
          accent="#3E6B52"
          href="/dashboard/receipts"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#3E6B52"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" />
            </svg>
          }
        />
        <KpiCard
          label="Net VAT liability"
          value={fmt(data.period.netLiability)}
          sub="Owed to HMRC"
          accent="#C45A4A"
          href="/vat-checks"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#C45A4A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
        />
        <KpiCard
          label="Receipts this period"
          value={String(data.totalReceiptsCount)}
          sub={`${flagged} flagged`}
          accent="#2B3A2E"
          href="/dashboard/receipts"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#2B3A2E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          }
        />
        <KpiCard
          label="Open issues"
          value={String(errors + warnings)}
          sub={`${errors} error${errors !== 1 ? 's' : ''}, ${warnings} warning${warnings !== 1 ? 's' : ''}`}
          accent={errors > 0 ? '#C45A4A' : '#D4874A'}
          href="/vat-checks"
          icon={
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke={errors > 0 ? '#C45A4A' : '#D4874A'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
      </div>

      {/* Main content area: 2-col on lg */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left col — receipts (wider) */}
        <div className="space-y-6 lg:col-span-2">
          <RecentReceipts
            receipts={data.recentReceipts}
            totalCount={data.totalReceiptsCount}
          />
        </div>

        {/* Right col — checks + quick actions */}
        <div className="space-y-6">
          <VatChecksSnapshot checks={data.openChecks} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
