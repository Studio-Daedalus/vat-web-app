'use client'

import { useState } from 'react'
import {
  DEMO_CHECKS,
  DEMO_PERIOD,
  type VatCheck,
  type VatPeriod,
  type CheckSeverity,
} from '@/components/VatChecks/vatChecksTypes'

// ─── Constants ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const daysUntil = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY: Record<
  CheckSeverity,
  {
    label: string
    bg: string
    border: string
    text: string
    dot: string
    icon: React.ReactNode
  }
> = {
  error: {
    label: 'Error',
    bg: 'rgba(196,90,74,0.07)',
    border: 'rgba(196,90,74,0.25)',
    text: '#C45A4A',
    dot: '#C45A4A',
    icon: (
      <svg
        width="16"
        height="16"
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
    ),
  },
  warning: {
    label: 'Warning',
    bg: 'rgba(212,135,74,0.07)',
    border: 'rgba(212,135,74,0.25)',
    text: '#B86E2A',
    dot: '#D4874A',
    icon: (
      <svg
        width="16"
        height="16"
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
    ),
  },
  info: {
    label: 'Info',
    bg: 'rgba(74,122,138,0.07)',
    border: 'rgba(74,122,138,0.22)',
    text: '#4A7A8A',
    dot: '#4A7A8A',
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#4A7A8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  passed: {
    label: 'Passed',
    bg: 'rgba(61,160,106,0.07)',
    border: 'rgba(61,160,106,0.2)',
    text: '#2D8055',
    dot: '#3DA06A',
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#3DA06A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
}

const PERIOD_STATUS = {
  ready: {
    label: 'Ready to submit',
    bg: 'rgba(61,160,106,0.1)',
    border: 'rgba(61,160,106,0.25)',
    text: '#2D8055',
    badgeBg: '#3DA06A',
  },
  'needs-attention': {
    label: 'Needs attention',
    bg: 'rgba(212,135,74,0.1)',
    border: 'rgba(212,135,74,0.25)',
    text: '#B86E2A',
    badgeBg: '#D4874A',
  },
  'at-risk': {
    label: 'At risk',
    bg: 'rgba(196,90,74,0.1)',
    border: 'rgba(196,90,74,0.25)',
    text: '#C45A4A',
    badgeBg: '#C45A4A',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ── Readiness banner ──────────────────────────────────────────────────────────

function ReadinessBanner({ period }: { period: VatPeriod }) {
  const s = PERIOD_STATUS[period.status]
  const days = daysUntil(period.submissionDeadline)
  const urgent = days <= 14

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-6"
      style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
    >
      {/* Subtle texture strip */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-48 opacity-[0.035]"
        style={{
          background:
            'repeating-linear-gradient(-45deg, #2B3A2E 0px, #2B3A2E 1px, transparent 1px, transparent 8px)',
        }}
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: status */}
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
              style={{
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
                color: s.text,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: s.badgeBg }}
              />
              {s.label}
            </span>
            <span className="text-xs" style={{ color: '#7A8A7E' }}>
              {period.label}
            </span>
          </div>

          <p
            className="mt-3 text-2xl font-bold sm:text-3xl"
            style={{ color: '#2B3A2E', fontFamily: 'Manrope, sans-serif' }}
          >
            {fmt(period.netLiability)}
          </p>
          <p className="mt-1 text-sm" style={{ color: '#7A8A7E' }}>
            Net VAT liability for this period
          </p>
        </div>

        {/* Right: deadline */}
        <div
          className="flex-shrink-0 rounded-xl border p-4 text-center sm:min-w-[140px]"
          style={{
            backgroundColor: urgent ? 'rgba(196,90,74,0.06)' : 'white',
            borderColor: urgent ? 'rgba(196,90,74,0.2)' : '#E0DAD0',
          }}
        >
          <p
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: urgent ? '#C45A4A' : '#7A8A7E' }}
          >
            Deadline
          </p>
          <p
            className="mt-1 text-lg font-bold"
            style={{ color: urgent ? '#C45A4A' : '#2B3A2E' }}
          >
            {daysUntil(period.submissionDeadline) > 0
              ? `${daysUntil(period.submissionDeadline)}d`
              : 'Overdue'}
          </p>
          <p className="text-xs" style={{ color: '#7A8A7E' }}>
            {fmtDate(period.submissionDeadline)}
          </p>
        </div>
      </div>

      {/* VAT breakdown row */}
      <div
        className="mt-5 grid grid-cols-3 gap-3 rounded-xl border p-4"
        style={{ backgroundColor: 'white', borderColor: '#E0DAD0' }}
      >
        {[
          {
            label: 'Output VAT',
            value: fmt(period.vatCollected),
            sub: 'Charged to customers',
            color: '#2B3A2E',
          },
          {
            label: 'Input VAT',
            value: fmt(period.vatReclaimable),
            sub: 'Reclaimable from receipts',
            color: '#3E6B52',
          },
          {
            label: 'Net liability',
            value: fmt(period.netLiability),
            sub: 'Owed to HMRC',
            color: '#C45A4A',
          },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="text-center">
            <p
              className="text-xs font-medium tracking-widest uppercase"
              style={{ color: '#7A8A7E' }}
            >
              {label}
            </p>
            <p
              className="mt-1 text-base font-bold sm:text-lg"
              style={{ color, fontFamily: 'Manrope, sans-serif' }}
            >
              {value}
            </p>
            <p
              className="mt-0.5 hidden text-xs sm:block"
              style={{ color: '#7A8A7E' }}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Threshold monitor ─────────────────────────────────────────────────────────

function ThresholdMonitor({ period }: { period: VatPeriod }) {
  const pct = Math.min(
    (period.taxableTurnover / period.registrationThreshold) * 100,
    100,
  )
  const warning = pct >= 70
  const danger = pct >= 90

  const barColor = danger ? '#C45A4A' : warning ? '#D4874A' : '#3E6B52'

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#2B3A2E' }}>
            VAT Registration Threshold
          </p>
          <p
            className="mt-0.5 text-xs leading-relaxed"
            style={{ color: '#7A8A7E' }}
          >
            Rolling 12-month taxable turnover vs the £90,000 HMRC threshold.
          </p>
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            backgroundColor: danger
              ? 'rgba(196,90,74,0.1)'
              : warning
                ? 'rgba(212,135,74,0.1)'
                : 'rgba(61,160,106,0.1)',
            color: barColor,
          }}
        >
          {pct.toFixed(0)}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full"
        style={{ backgroundColor: '#E0DAD0' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>

      <div
        className="mt-2 flex justify-between text-xs"
        style={{ color: '#7A8A7E' }}
      >
        <span>{fmt(period.taxableTurnover)} turnover</span>
        <span>{fmt(period.registrationThreshold)} threshold</span>
      </div>

      {warning && (
        <div
          className="mt-3 rounded-lg border px-3 py-2.5 text-xs leading-relaxed font-medium"
          style={{
            backgroundColor: danger
              ? 'rgba(196,90,74,0.06)'
              : 'rgba(212,135,74,0.06)',
            borderColor: danger
              ? 'rgba(196,90,74,0.2)'
              : 'rgba(212,135,74,0.2)',
            color: barColor,
          }}
        >
          {danger
            ? 'You are close to the threshold. If turnover is likely to exceed £90,000 in the next 30 days, you must register for VAT immediately.'
            : "You're approaching the threshold. Monitor your turnover closely over the coming months."}
        </div>
      )}
    </div>
  )
}

// ── Check card ────────────────────────────────────────────────────────────────

function CheckCard({
  check,
  onResolve,
}: {
  check: VatCheck
  onResolve: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const s = SEVERITY[check.severity]
  const isPassed = check.severity === 'passed'

  return (
    <div
      className="overflow-hidden rounded-xl border transition-shadow duration-150"
      style={{
        backgroundColor: check.resolved ? 'rgba(122,138,126,0.04)' : s.bg,
        borderColor: check.resolved ? '#E0DAD0' : s.border,
        opacity: check.resolved ? 0.6 : 1,
      }}
    >
      {/* Row */}
      <button
        type="button"
        className="flex w-full items-start gap-3 p-4 text-left"
        onClick={() => !isPassed && setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* Icon */}
        <span className="mt-0.5 flex-shrink-0">{s.icon}</span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="text-sm font-semibold"
              style={{ color: check.resolved ? '#7A8A7E' : '#2B3A2E' }}
            >
              {check.title}
            </p>
            {check.affectedVendor && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: '#C4DCBE', color: '#3E6B52' }}
              >
                {check.affectedVendor}
              </span>
            )}
            {check.affectedDate && (
              <span className="text-xs" style={{ color: '#7A8A7E' }}>
                {fmtDate(check.affectedDate)}
              </span>
            )}
            {check.affectedAmount != null && check.affectedAmount > 0 && (
              <span className="text-xs font-semibold" style={{ color: s.text }}>
                {fmt(check.affectedAmount)} VAT at risk
              </span>
            )}
          </div>

          {/* Collapsed description preview (non-passed only) */}
          {!isPassed && !expanded && (
            <p
              className="mt-1 line-clamp-1 text-xs leading-relaxed"
              style={{ color: '#7A8A7E' }}
            >
              {check.description}
            </p>
          )}

          {/* Passed checks: show description inline, no expand needed */}
          {isPassed && (
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: '#7A8A7E' }}
            >
              {check.description}
            </p>
          )}
        </div>

        {/* Chevron for expandable */}
        {!isPassed && (
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#7A8A7E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`mt-0.5 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {/* Expanded detail */}
      {expanded && !isPassed && (
        <div
          className="border-t px-4 pt-3 pb-4"
          style={{ borderColor: s.border }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#2B3A2E' }}>
            {check.description}
          </p>

          {check.recommendation && (
            <div
              className="mt-3 rounded-lg border px-3 py-2.5"
              style={{
                backgroundColor: 'rgba(196,220,190,0.15)',
                borderColor: '#C4DCBE',
              }}
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: '#3E6B52' }}
              >
                What to do
              </p>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: '#2B3A2E' }}
              >
                {check.recommendation}
              </p>
            </div>
          )}

          {!check.resolved && (
            <button
              type="button"
              onClick={() => onResolve(check.id)}
              className="mt-3 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 hover:bg-[#F0EDE6]"
              style={{ borderColor: '#E0DAD0', color: '#7A8A7E' }}
            >
              Mark as resolved
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Check list ────────────────────────────────────────────────────────────────

function CheckList({
  checks,
  onResolve,
}: {
  checks: VatCheck[]
  onResolve: (id: string) => void
}) {
  const errors = checks.filter((c) => c.severity === 'error')
  const warnings = checks.filter((c) => c.severity === 'warning')
  const infos = checks.filter((c) => c.severity === 'info')
  const passed = checks.filter((c) => c.severity === 'passed')

  const sections = [
    { key: 'error', label: `Errors (${errors.length})`, items: errors },
    { key: 'warning', label: `Warnings (${warnings.length})`, items: warnings },
    { key: 'info', label: `Notes (${infos.length})`, items: infos },
    { key: 'passed', label: `Passed (${passed.length})`, items: passed },
  ].filter((s) => s.items.length > 0)

  return (
    <div className="space-y-6">
      {sections.map(({ key, label, items }) => (
        <div key={key}>
          <SectionHeading>{label}</SectionHeading>
          <div className="space-y-2">
            {items.map((check) => (
              <CheckCard key={check.id} check={check} onResolve={onResolve} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Summary chips ─────────────────────────────────────────────────────────────

function SummaryChips({ checks }: { checks: VatCheck[] }) {
  const counts = {
    error: checks.filter((c) => c.severity === 'error' && !c.resolved).length,
    warning: checks.filter((c) => c.severity === 'warning' && !c.resolved)
      .length,
    info: checks.filter((c) => c.severity === 'info' && !c.resolved).length,
    passed: checks.filter((c) => c.severity === 'passed').length,
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(counts) as [CheckSeverity, number][]).map(
        ([severity, count]) => {
          const s = SEVERITY[severity]
          return (
            <div
              key={severity}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1"
              style={{ backgroundColor: s.bg, borderColor: s.border }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: s.dot }}
              />
              <span className="text-xs font-semibold" style={{ color: s.text }}>
                {count} {s.label}
                {count !== 1 ? 's' : ''}
              </span>
            </div>
          )
        },
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VatChecksPage({
  period = DEMO_PERIOD,
  initialChecks = DEMO_CHECKS,
}: {
  period?: VatPeriod
  initialChecks?: VatCheck[]
}) {
  const [checks, setChecks] = useState(initialChecks)

  const handleResolve = (id: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: true } : c)),
    )
  }

  const unresolvedIssues = checks.filter(
    (c) => c.severity !== 'passed' && !c.resolved,
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: '#2B3A2E', fontFamily: 'Manrope, sans-serif' }}
          >
            VAT Checks
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#7A8A7E' }}>
            Pre-submission review for {period.label}.
          </p>
        </div>
        <SummaryChips checks={checks} />
      </div>

      {/* Readiness banner */}
      <ReadinessBanner period={period} />

      {/* Two-column on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: checks list (wider) */}
        <div className="lg:col-span-2">
          <SectionHeading>
            {unresolvedIssues.length > 0
              ? `${unresolvedIssues.length} issue${unresolvedIssues.length > 1 ? 's' : ''} to review`
              : 'All checks passed'}
          </SectionHeading>
          <CheckList checks={checks} onResolve={handleResolve} />
        </div>

        {/* Right: threshold + period meta */}
        <div className="space-y-4">
          <div>
            <SectionHeading>Threshold monitor</SectionHeading>
            <ThresholdMonitor period={period} />
          </div>

          <div>
            <SectionHeading>Period details</SectionHeading>
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
            >
              {[
                { label: 'Period', value: period.label },
                { label: 'Start', value: fmtDate(period.startDate) },
                { label: 'End', value: fmtDate(period.endDate) },
                {
                  label: 'Deadline',
                  value: fmtDate(period.submissionDeadline),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b py-2.5 first:pt-0 last:border-0 last:pb-0"
                  style={{ borderColor: '#E0DAD0' }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: '#7A8A7E' }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: '#2B3A2E' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
