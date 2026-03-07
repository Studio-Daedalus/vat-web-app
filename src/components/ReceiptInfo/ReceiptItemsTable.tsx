'use client'

import React from 'react'
import { C } from '@/styles/colours'
import type {
  ReceiptDetail,
  ReceiptDetailStatus,
  ReceiptConfidence,
} from '@/types'
import type { GetReceiptResponse } from '@/types/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number | null | undefined, currency = 'GBP') =>
  (n ?? 0).toLocaleString('en-GB', { style: 'currency', currency })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

// ─── Style maps ───────────────────────────────────────────────────────────────

type PillStyle = { bg: string; color: string; border: string; label: string }

const DEFAULT_PILL: PillStyle = { bg: `${C.stone}18`, color: C.stone, border: `${C.stone}40`, label: 'Unknown' }

const STATUS_PILL: Record<ReceiptDetailStatus, PillStyle> = {
  COMPLETE: {
    bg: `${C.success}18`,
    color: C.success,
    border: `${C.success}40`,
    label: 'Complete',
  },
  PENDING: {
    bg: `${C.warning}18`,
    color: C.warning,
    border: `${C.warning}40`,
    label: 'Pending',
  },
  PROCESSING: {
    bg: `${C.stone}15`,
    color: C.stone,
    border: `${C.stone}40`,
    label: 'Processing',
  },
  FAILED: {
    bg: `${C.error}15`,
    color: C.error,
    border: `${C.error}40`,
    label: 'Error',
  },
}

const CONFIDENCE_PILL: Record<ReceiptConfidence, PillStyle> = {
  high: {
    bg: `${C.success}18`,
    color: C.success,
    border: `${C.success}40`,
    label: 'High confidence',
  },
  medium: {
    bg: `${C.warning}18`,
    color: C.warning,
    border: `${C.warning}40`,
    label: 'Medium confidence',
  },
  low: {
    bg: `${C.error}15`,
    color: C.error,
    border: `${C.error}40`,
    label: 'Low confidence',
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({ s }: { s: PillStyle }) {
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
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.color,
        }}
      />
      {s.label}
    </span>
  )
}

function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string
  value: React.ReactNode
  valueStyle?: React.CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: `1px solid ${C.bark}`,
      }}
    >
      <span style={{ fontSize: 13, color: C.stone, fontWeight: 500 }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.forest,
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function CardHeader({
  title,
  right,
}: {
  title: string
  right?: React.ReactNode
}) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${C.bark}`,
        background: C.parchment,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: C.stone,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {title}
      </span>
      {right}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReceiptItemsTable({ receipt }: { receipt: GetReceiptResponse }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Receipt details ──────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          border: `1px solid ${C.bark}`,
          boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
          overflow: 'hidden',
        }}
      >
        <CardHeader
          title="Receipt Details"
          right={<Pill s={STATUS_PILL[receipt.status as ReceiptDetailStatus] ?? DEFAULT_PILL} />}
        />
        <div style={{ padding: '4px 20px 8px' }}>
          <DetailRow label="Vendor" value={receipt.vendor} />
          <DetailRow label="Date" value={fmtDate(receipt.receipt_date)} />
          <DetailRow label="Category" value={receipt.category ?? '—'} />
          {receipt.vendor_vat_no && (
            <DetailRow
              label="Vendor VAT No."
              value={receipt.vendor_vat_no}
              valueStyle={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          )}
          <DetailRow label="Currency" value={receipt.currency} />
          <DetailRow
            label="AI Confidence"
            value={
              <Pill s={CONFIDENCE_PILL[receipt.confidence] ?? DEFAULT_PILL} />
            }
          />
        </div>
      </div>

      {/* ── VAT breakdown ────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          border: `1px solid ${C.bark}`,
          boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
          overflow: 'hidden',
        }}
      >
        <CardHeader title="VAT Breakdown" />
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                background: C.parchment,
                borderBottom: `1px solid ${C.bark}`,
              }}
            >
              {['Description', 'Net', 'VAT', 'Gross'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 20px',
                    textAlign: h === 'Description' ? 'left' : 'right',
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.stone,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${C.bark}` }}>
              <td
                style={{
                  padding: '14px 20px',
                  fontWeight: 600,
                  color: C.forest,
                }}
              >
                {receipt.vendor}
              </td>
              <td
                style={{
                  padding: '14px 20px',
                  textAlign: 'right',
                  color: C.forest,
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                }}
              >
                {fmt(receipt.net_amount, receipt.currency)}
              </td>
              <td
                style={{
                  padding: '14px 20px',
                  textAlign: 'right',
                  color: C.fern,
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                }}
              >
                {fmt(receipt.vat_amount, receipt.currency)}
              </td>
              <td
                style={{
                  padding: '14px 20px',
                  textAlign: 'right',
                  color: C.forest,
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 700,
                }}
              >
                {fmt(receipt.gross_total, receipt.currency)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr
              style={{
                background: C.parchment,
                borderTop: `1px solid ${C.bark}`,
              }}
            >
              <td
                style={{
                  padding: '12px 20px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.stone,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Total
              </td>
              <td
                style={{
                  padding: '12px 20px',
                  textAlign: 'right',
                  fontWeight: 700,
                  color: C.forest,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmt(receipt.net_amount, receipt.currency)}
              </td>
              <td
                style={{
                  padding: '12px 20px',
                  textAlign: 'right',
                  fontWeight: 700,
                  color: C.fern,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmt(receipt.vat_amount, receipt.currency)}
              </td>
              <td
                style={{
                  padding: '12px 20px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  fontFamily:
                    'var(--font-source-serif), "Source Serif 4", serif',
                  fontSize: 18,
                  fontWeight: 800,
                  color: C.fern,
                }}
              >
                {fmt(receipt.gross_total, receipt.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── AI parse notes ───────────────────────────────────────────── */}
      {(receipt.parse_notes?.length ?? 0) > 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            border: `1px solid ${C.bark}`,
            boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
            overflow: 'hidden',
          }}
        >
          <CardHeader title="AI Parse Notes" />
          <ul
            style={{ margin: 0, padding: '8px 20px 16px', listStyle: 'none' }}
          >
            {receipt.parse_notes.map((note, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom:
                    i < receipt.parse_notes.length - 1
                      ? `1px solid ${C.bark}`
                      : 'none',
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: `${C.fern}18`,
                    color: C.fern,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{ fontSize: 13, color: C.forest, lineHeight: 1.6 }}
                >
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
