'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { C } from '@/styles/colours'
import type {
  SearchUserReceiptsItem,
  ReceiptStatus_Backend,
  SearchUserReceiptsResponse,
} from '@/types/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number, currency = 'GBP') =>
  n.toLocaleString('en-GB', { style: 'currency', currency })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const fmtPct = (n: number) =>
  // Backend sends 0.0–1.0
  `${n}%`

function parseRiskFlags(
  json: string,
): { code: string; severity: string; description: string }[] {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// A receipt needs user action when it's FLAGGED or PENDING
function needsAction(status: ReceiptStatus_Backend): boolean {
  return status === 'FLAGGED' || status === 'PENDING'
}

// ─── Status config ────────────────────────────────────────────────────────────

type StatusConfig = {
  bg: string
  color: string
  border: string
  dot: string
  label: string
}

const STATUS: Record<ReceiptStatus_Backend, StatusConfig> = {
  COMPLETE: {
    bg: `${C.success}18`,
    color: C.success,
    border: `${C.success}40`,
    dot: C.success,
    label: 'Complete',
  },
  PENDING: {
    bg: `${C.warning}18`,
    color: C.warning,
    border: `${C.warning}40`,
    dot: C.warning,
    label: 'Pending',
  },
  FLAGGED: {
    bg: `${C.error}15`,
    color: C.error,
    border: `${C.error}40`,
    dot: C.error,
    label: 'Flagged',
  },
  PROCESSING: {
    bg: `${C.stone}15`,
    color: C.stone,
    border: `${C.stone}40`,
    dot: C.stone,
    label: 'Processing',
  },
  ERROR: {
    bg: `${C.error}15`,
    color: C.error,
    border: `${C.error}40`,
    dot: C.error,
    label: 'Error',
  },
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

type SortKey =
  | 'transactionDate'
  | 'vendorName'
  | 'totalGross'
  | 'reclaimableVat'
  | 'ocrConfidence'
type SortDir = 'asc' | 'desc'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      style={{
        marginLeft: 4,
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 2,
        verticalAlign: 'middle',
      }}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        style={{ opacity: active && dir === 'asc' ? 1 : 0.25 }}
      >
        <path d="M4 1L7 6H1L4 1Z" fill={C.forest} />
      </svg>
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        style={{ opacity: active && dir === 'desc' ? 1 : 0.25 }}
      >
        <path d="M4 7L1 2H7L4 7Z" fill={C.forest} />
      </svg>
    </span>
  )
}

function StatusPill({ status }: { status: ReceiptStatus_Backend }) {
  const s = STATUS[status] ?? {
    bg: `${C.stone}15`,
    color: C.stone,
    border: `${C.stone}40`,
    dot: C.stone,
    label: status,
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 11,
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
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  )
}

function ConfidenceBadge({ value }: { value: number }) {
  // value: 0–100
  const color = value >= 80 ? C.success : value >= 50 ? C.warning : C.error
  const bg =
    value >= 80
      ? `${C.success}15`
      : value >= 50
        ? `${C.warning}15`
        : `${C.error}12`
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'Manrope, sans-serif',
        background: bg,
        color,
      }}
    >
      {value}%
    </span>
  )
}

function RiskBadge({ json }: { json: string }) {
  const flags = parseRiskFlags(json)
  if (flags.length === 0)
    return <span style={{ fontSize: 12, color: C.stone }}>—</span>
  const hasHigh = flags.some((f) => f.severity === 'high')
  const color = hasHigh ? C.error : C.warning
  const bg = hasHigh ? `${C.error}12` : `${C.warning}15`
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        background: bg,
        color,
      }}
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      {flags.length}
    </span>
  )
}

function ActionIndicator({ status }: { status: ReceiptStatus_Backend }) {
  if (!needsAction(status)) return null
  const isFlagged = status === 'FLAGGED'
  const color = isFlagged ? C.error : C.warning
  const bg = isFlagged ? `${C.error}12` : `${C.warning}12`
  const border = isFlagged ? `${C.error}30` : `${C.warning}30`
  const label = isFlagged ? 'Review required' : 'Action needed'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'Manrope, sans-serif',
        background: bg,
        color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {label}
    </span>
  )
}

// ─── Vendor avatar ────────────────────────────────────────────────────────────

function VendorAvatar({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        flexShrink: 0,
        background: C.lichen,
        color: C.fern,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.02em',
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <tr>
      <td colSpan={7} style={{ padding: '56px 24px', background: C.parchment }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${C.bark}80`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.stone}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p style={{ fontSize: 13, color: C.stone, lineHeight: 1.6 }}>
            {hasFilters
              ? 'No receipts match your filters.'
              : 'No receipts yet.'}
          </p>
        </div>
      </td>
    </tr>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type ReceiptsTableProps = {
  data: SearchUserReceiptsResponse
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReceiptsTable({ data }: ReceiptsTableProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('transactionDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    ReceiptStatus_Backend | 'ALL'
  >('ALL')

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const records = data.Records ?? []

  const filtered = records
    .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
    .filter((r) => r.vendorName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const m = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'vendorName')
        return m * a.vendorName.localeCompare(b.vendorName)
      if (sortKey === 'transactionDate')
        return m * a.transactionDate.localeCompare(b.transactionDate)
      return m * ((a[sortKey] as number) - (b[sortKey] as number))
    })

  // Count items needing action for the toolbar badge
  const actionCount = records.filter((r) => needsAction(r.status)).length

  const thStyle: React.CSSProperties = {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 600,
    color: C.stone,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const statusFilters: Array<ReceiptStatus_Backend | 'ALL'> = [
    'ALL',
    'COMPLETE',
    'PENDING',
    'FLAGGED',
    'PROCESSING',
    'ERROR',
  ]

  return (
    <div style={{ width: '100%' }}>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: '#fff',
          border: `1px solid ${C.bark}`,
          borderRadius: 14,
          padding: '14px 20px',
          marginBottom: 12,
          boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke={C.stone}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search vendors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: 32,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 13,
                borderRadius: 10,
                outline: 'none',
                border: `1px solid ${C.bark}`,
                background: C.parchment,
                color: C.forest,
                fontFamily: 'Manrope, sans-serif',
                width: 200,
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.clover)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.bark)}
            />
          </div>

          {/* Needs action badge */}
          {actionCount > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 999,
                background: `${C.warning}15`,
                border: `1px solid ${C.warning}40`,
                fontSize: 12,
                fontWeight: 700,
                color: C.warning,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {actionCount} need{actionCount === 1 ? 's' : ''} your attention
            </div>
          )}
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statusFilters.map((s) => {
            const active = statusFilter === s
            const label = s === 'ALL' ? 'All' : (STATUS[s]?.label ?? s)
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'Manrope, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active ? C.fern : '#fff',
                  color: active ? '#fff' : C.stone,
                  border: `1px solid ${active ? C.fern : C.bark}`,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.borderColor = C.fern
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.borderColor = C.bark
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          borderRadius: 14,
          border: `1px solid ${C.bark}`,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
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
                {/* Vendor */}
                <th style={thStyle} onClick={() => handleSort('vendorName')}>
                  Vendor{' '}
                  <SortIcon active={sortKey === 'vendorName'} dir={sortDir} />
                </th>

                {/* Date */}
                <th
                  style={thStyle}
                  onClick={() => handleSort('transactionDate')}
                >
                  Date{' '}
                  <SortIcon
                    active={sortKey === 'transactionDate'}
                    dir={sortDir}
                  />
                </th>

                {/* Gross / VAT */}
                <th
                  style={{ ...thStyle, textAlign: 'right' }}
                  onClick={() => handleSort('totalGross')}
                >
                  Gross{' '}
                  <SortIcon active={sortKey === 'totalGross'} dir={sortDir} />
                </th>
                <th style={{ ...thStyle, textAlign: 'right' }}>VAT</th>

                {/* Reclaimable */}
                <th
                  style={{ ...thStyle, textAlign: 'right' }}
                  onClick={() => handleSort('reclaimableVat')}
                >
                  Reclaimable{' '}
                  <SortIcon
                    active={sortKey === 'reclaimableVat'}
                    dir={sortDir}
                  />
                </th>

                {/* OCR */}
                <th
                  style={{ ...thStyle, textAlign: 'center' }}
                  onClick={() => handleSort('ocrConfidence')}
                >
                  OCR{' '}
                  <SortIcon
                    active={sortKey === 'ocrConfidence'}
                    dir={sortDir}
                  />
                </th>

                {/* Flags */}
                <th style={{ ...thStyle, textAlign: 'center' }}>Flags</th>

                {/* Status / action */}
                <th style={{ ...thStyle, textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <EmptyState
                  hasFilters={search !== '' || statusFilter !== 'ALL'}
                />
              ) : (
                filtered.map((r) => {
                  const action = needsAction(r.status)
                  return (
                    <tr
                      key={r.receiptId}
                      onClick={() =>
                        router.push(`/dashboard/receipts/${r.receiptId}`)
                      }
                      style={{
                        borderTop: `1px solid ${C.bark}`,
                        background: action ? `${C.warning}06` : '#fff',
                        transition: 'background 0.1s',
                        cursor: 'pointer',
                        // Subtle left accent for rows needing attention
                        boxShadow: action
                          ? `inset 3px 0 0 ${r.status === 'FLAGGED' ? C.error : C.warning}`
                          : 'none',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = action
                          ? `${C.warning}12`
                          : C.parchment)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = action
                          ? `${C.warning}06`
                          : '#fff')
                      }
                    >
                      {/* Vendor */}
                      <td style={{ padding: '13px 16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <VendorAvatar name={r.vendorName} />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: C.forest,
                                lineHeight: 1.3,
                              }}
                            >
                              {r.vendorName}
                            </div>
                            {r.vendorVatNumber && (
                              <div
                                style={{
                                  fontSize: 11,
                                  color: C.stone,
                                  fontFamily: 'monospace',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  marginTop: 2,
                                }}
                              >
                                {r.vendorVatNumber}
                                {r.vendorVatNumberValid === false && (
                                  <span
                                    style={{
                                      color: C.error,
                                      fontFamily: 'Manrope, sans-serif',
                                      fontWeight: 700,
                                    }}
                                  >
                                    · invalid
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td
                        style={{
                          padding: '13px 16px',
                          color: C.stone,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <div>{fmtDate(r.transactionDate)}</div>
                        {r.transactionTime && (
                          <div
                            style={{
                              fontSize: 11,
                              color: C.stone,
                              opacity: 0.7,
                              marginTop: 2,
                            }}
                          >
                            {r.transactionTime}
                          </div>
                        )}
                      </td>

                      {/* Gross */}
                      <td
                        style={{
                          padding: '13px 16px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: C.forest,
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(r.totalGross, r.currency)}
                      </td>

                      {/* VAT */}
                      <td
                        style={{
                          padding: '13px 16px',
                          textAlign: 'right',
                          fontWeight: 600,
                          color: C.fern,
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {fmt(r.totalVat, r.currency)}
                      </td>

                      {/* Reclaimable */}
                      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: C.fern,
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fmt(r.reclaimableVat, r.currency)}
                        </div>
                        {r.partialVatPending > 0 && (
                          <div
                            style={{
                              fontSize: 11,
                              color: C.warning,
                              marginTop: 2,
                              whiteSpace: 'nowrap',
                              fontWeight: 600,
                            }}
                          >
                            +{fmt(r.partialVatPending, r.currency)} pending
                          </div>
                        )}
                        <div
                          style={{ fontSize: 11, color: C.stone, marginTop: 2 }}
                        >
                          {fmtPct(r.effectiveReclaimPct)} reclaimed
                        </div>
                      </td>

                      {/* OCR confidence */}
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <ConfidenceBadge value={r.ocrConfidence} />
                      </td>

                      {/* Risk flags */}
                      <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                        <RiskBadge json={r.riskFlagsJson} />
                      </td>

                      {/* Status + action */}
                      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 5,
                          }}
                        >
                          <StatusPill status={r.status} />
                          <ActionIndicator status={r.status} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: `1px solid ${C.bark}`,
            background: C.parchment,
          }}
        >
          <span style={{ fontSize: 12, color: C.stone }}>
            Showing {filtered.length} of {records.length} receipts
            {data.NextToken && (
              <span style={{ marginLeft: 8, color: C.stone, opacity: 0.7 }}>
                · more available
              </span>
            )}
          </span>
          <span style={{ fontSize: 12, color: C.stone }}>
            Total reclaimable:{' '}
            <span style={{ fontWeight: 700, color: C.fern }}>
              {fmt(
                filtered.reduce((sum, r) => sum + r.reclaimableVat, 0),
                filtered[0]?.currency ?? 'GBP',
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
