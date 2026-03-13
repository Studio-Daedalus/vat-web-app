'use client'

import React from 'react'
import { C } from '@/styles/colours'
import type { UserReceiptStatus, Reclaimable, VATRateLabel } from '@/types/api'

// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmt = (n: number, currency = 'GBP') =>
  n.toLocaleString('en-GB', { style: 'currency', currency })

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export const fmtShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const fmtPct = (n: number) => `${n}%`

// ─── Type maps ────────────────────────────────────────────────────────────────

type Pill = { bg: string; color: string; border: string; label: string }

export const STATUS_CONFIG: Record<
  UserReceiptStatus,
  Pill & { needsAction: boolean }
> = {
  PENDING_REVIEW: {
    bg: `${C.warning}18`,
    color: C.warning,
    border: `${C.warning}40`,
    label: 'Pending Review',
    needsAction: true,
  },
  REVIEWED: {
    bg: `${C.success}18`,
    color: C.success,
    border: `${C.success}40`,
    label: 'Reviewed',
    needsAction: false,
  },
  ADDED_TO_RETURN: {
    bg: `${C.fern}18`,
    color: C.fern,
    border: `${C.fern}40`,
    label: 'Added to Return',
    needsAction: false,
  },
  EXCLUDED: {
    bg: `${C.stone}15`,
    color: C.stone,
    border: `${C.stone}40`,
    label: 'Excluded',
    needsAction: false,
  },
  PROCESSING: {
    bg: `${C.stone}15`,
    color: C.stone,
    border: `${C.stone}40`,
    label: 'Processing',
    needsAction: false,
  },
  FAILED: {
    bg: `${C.error}15`,
    color: C.error,
    border: `${C.error}40`,
    label: 'Failed',
    needsAction: false,
  },
}

export const VAT_RATE_CONFIG: Record<
  VATRateLabel,
  { label: string; pct: string }
> = {
  standard: { label: 'Standard Rate', pct: '20%' },
  reduced: { label: 'Reduced Rate', pct: '5%' },
  zero: { label: 'Zero-rated', pct: '0%' },
  exempt: { label: 'Exempt', pct: '—' },
  unknown: { label: 'Unknown', pct: '?' },
}

export const RECLAIM_CONFIG: Record<
  Reclaimable,
  { color: string; label: string }
> = {
  full: { color: C.success, label: 'Fully reclaimable' },
  partial: { color: C.warning, label: 'Partial' },
  none: { color: C.stone, label: 'Not reclaimable' },
  unknown: { color: C.error, label: 'Unknown' },
}

export const FLAG_LABELS: Record<string, string> = {
  NO_VAT_NUMBER: 'No VAT Number',
  MIXED_USE: 'Mixed Use',
  PERSONAL_ITEM: 'Personal Item',
  ENTERTAINMENT: 'Entertainment',
  REVERSE_CHARGE: 'Reverse Charge',
  ZERO_RATED: 'Zero-rated',
  EXEMPT_SUPPLY: 'Exempt Supply',
  HIGH_VALUE: 'High Value',
  CIS_LABOUR: 'CIS Labour',
  SUBSISTENCE: 'Subsistence',
}

// ─── Reusable atoms ───────────────────────────────────────────────────────────

export function CardHeader({
  title,
  right,
  noBorder,
}: {
  title: string
  right?: React.ReactNode
  noBorder?: boolean
}) {
  return (
    <div
      style={{
        padding: '15px 20px',
        borderBottom: noBorder ? 'none' : `1px solid ${C.bark}`,
        background: C.parchment,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.stone,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {title}
      </span>
      {right}
    </div>
  )
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${C.bark}`,
        boxShadow: '0 2px 8px rgba(43,58,46,0.04)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function StatusPill({ status }: { status: UserReceiptStatus }) {
  const s = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'Manrope, sans-serif',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.color,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  )
}

export function DetailRow({
  label,
  value,
  valueStyle,
  mono,
}: {
  label: string
  value: React.ReactNode
  valueStyle?: React.CSSProperties
  mono?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '11px 0',
        borderBottom: `1px solid ${C.bark}`,
        gap: 16,
      }}
    >
      <span
        style={{ fontSize: 13, color: C.stone, fontWeight: 500, flexShrink: 0 }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.forest,
          textAlign: 'right',
          fontFamily: mono ? 'monospace' : 'Manrope, sans-serif',
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function Alert({
  type,
  children,
}: {
  type: 'warning' | 'error' | 'info'
  children: React.ReactNode
}) {
  const color =
    type === 'error' ? C.error : type === 'warning' ? C.warning : C.fern
  const bg =
    type === 'error'
      ? `${C.error}0f`
      : type === 'warning'
        ? `${C.warning}0f`
        : `${C.fern}0f`
  const border = `${color}30`
  return (
    <div
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0, marginTop: 1 }}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span style={{ fontSize: 12, color, lineHeight: 1.65 }}>{children}</span>
    </div>
  )
}

export function FlagChip({ flag }: { flag: string }) {
  const isHigh = ['NO_VAT_NUMBER', 'PERSONAL_ITEM', 'ENTERTAINMENT'].includes(
    flag,
  )
  const color = isHigh ? C.error : C.warning
  const bg = isHigh ? `${C.error}10` : `${C.warning}12`
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      <span style={{ fontSize: 9 }}>▲</span>
      {FLAG_LABELS[flag] ?? flag}
    </span>
  )
}

export function ActionButton({
  label,
  variant,
  onClick,
  icon,
  disabled,
}: {
  label: string
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: C.fern,
      color: '#fff',
      border: `1px solid ${C.fern}`,
    },
    secondary: {
      background: '#fff',
      color: C.forest,
      border: `1px solid ${C.bark}`,
    },
    danger: {
      background: `${C.error}10`,
      color: C.error,
      border: `1px solid ${C.error}40`,
    },
    ghost: {
      background: 'transparent',
      color: C.stone,
      border: `1px solid ${C.bark}`,
    },
  }
  const hover: Record<string, React.CSSProperties> = {
    primary: { background: C.forest },
    secondary: { border: `1px solid ${C.stone}`, background: C.parchment },
    danger: { background: `${C.error}18` },
    ghost: { border: `1px solid ${C.stone}`, color: C.forest },
  }

  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => { if (!disabled) setHovered(true) }}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '9px 18px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'Manrope, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        ...(hovered && !disabled
          ? { ...styles[variant], ...hover[variant] }
          : styles[variant]),
      }}
    >
      {icon}
      {label}
    </button>
  )
}
