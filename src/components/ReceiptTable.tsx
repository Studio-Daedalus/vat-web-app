'use client'

import React, { useState } from 'react'
import { C } from '@/components/Sidebar/icons'
import type { Receipt, VatRate, ReceiptStatus } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

// ─── Style maps ───────────────────────────────────────────────────────────────

const VAT_RATE_LABELS: Record<VatRate, string> = {
  standard: '20%',
  reduced:  '5%',
  zero:     '0%',
  exempt:   'Exempt',
}

type PillStyle = { bg: string; color: string; border: string }

const VAT_RATE_PILL: Record<VatRate, PillStyle> = {
  standard: { bg: `${C.fern}12`,   color: C.fern,    border: `${C.fern}30`   },
  reduced:  { bg: `${C.copper}18`, color: '#A8703A', border: `${C.copper}40` },
  zero:     { bg: `${C.stone}18`,  color: C.stone,   border: `${C.stone}40`  },
  exempt:   { bg: `${C.stone}18`,  color: C.stone,   border: `${C.stone}40`  },
}

const STATUS_PILL: Record<ReceiptStatus, PillStyle & { dot: string; label: string }> = {
  claimed: { bg: `${C.success}18`, color: C.success, border: `${C.success}40`, dot: C.success, label: 'Claimed' },
  pending: { bg: `${C.warning}18`, color: C.warning, border: `${C.warning}40`, dot: C.warning, label: 'Pending' },
  flagged: { bg: `${C.error}15`,   color: C.error,   border: `${C.error}40`,   dot: C.error,   label: 'Flagged' },
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortKey = 'date' | 'vendor' | 'totalAmount' | 'vatAmount'
type SortDir = 'asc' | 'desc'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span style={{
      marginLeft: 4, display: 'inline-flex', flexDirection: 'column',
      gap: 2, verticalAlign: 'middle',
    }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
           style={{ opacity: active && dir === 'asc' ? 1 : 0.25 }}>
        <path d="M4 1L7 6H1L4 1Z" fill={C.forest} />
      </svg>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"
           style={{ opacity: active && dir === 'desc' ? 1 : 0.25 }}>
        <path d="M4 7L1 2H7L4 7Z" fill={C.forest} />
      </svg>
    </span>
  )
}

function StatusPill({ status }: { status: ReceiptStatus }) {
  const s = STATUS_PILL[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      fontFamily: 'Manrope, sans-serif',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: s.dot, flexShrink: 0,
      }} />
      {s.label}
    </span>
  )
}

function VatRatePill({ rate }: { rate: VatRate }) {
  const s = VAT_RATE_PILL[rate]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      fontFamily: 'Manrope, sans-serif',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {VAT_RATE_LABELS[rate]}
    </span>
  )
}

function FlagTooltip({ reason }: { reason: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <span
      style={{ position: 'relative', marginLeft: 6, display: 'inline-flex', cursor: 'default' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
           stroke={C.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8"    x2="12"    y2="12" />
        <line x1="12" y1="16"   x2="12.01" y2="16" />
      </svg>
      {visible && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)', zIndex: 20,
          width: 224, padding: '8px 12px', borderRadius: 10,
          fontSize: 12, fontWeight: 500, lineHeight: 1.5,
          fontFamily: 'Manrope, sans-serif', pointerEvents: 'none',
          background: C.parchment, color: C.forest,
          border: `1px solid ${C.bark}`,
          boxShadow: '0 4px 16px rgba(43,58,46,0.12)',
        }}>
          {reason}
        </span>
      )}
    </span>
  )
}

// ─── Summary bar ──────────────────────────────────────────────────────────────
// Exported separately — render above <ReceiptTable> on your Receipts page,
// in the same way StatCards sits above VATChart in DashboardPage.

export function ReceiptSummaryBar({ receipts }: { receipts: Receipt[] }) {
  const totalVat   = receipts.filter(r => r.reclaimable).reduce((s, r) => s + r.vatAmount, 0)
  const totalSpend = receipts.reduce((s, r) => s + r.totalAmount, 0)
  const flagged    = receipts.filter(r => r.status === 'flagged').length
  const pending    = receipts.filter(r => r.status === 'pending').length

  const cards = [
    { label: 'VAT Reclaimable', value: fmt(totalVat),   sub: 'From reclaimable receipts',          accent: C.fern    },
    { label: 'Total Spend',     value: fmt(totalSpend), sub: `Across ${receipts.length} receipts`, accent: C.forest  },
    { label: 'Pending Review',  value: String(pending), sub: 'Awaiting confirmation',              accent: C.warning },
    { label: 'Flagged',         value: String(flagged), sub: 'Need your attention',                accent: C.error   },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 16,
      marginBottom: 24,
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: '#fff', borderRadius: 14,
          border: `1px solid ${C.bark}`, padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: C.stone,
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
          }}>
            {card.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
            fontSize: 26, fontWeight: 800, color: card.accent,
            marginBottom: 4, lineHeight: 1,
          }}>
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: C.stone }}>{card.sub}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

export default function ReceiptTable({ receipts }: { receipts: Receipt[] }) {
  const [sortKey,      setSortKey]      = useState<SortKey>('date')
  const [sortDir,      setSortDir]      = useState<SortDir>('desc')
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | 'all'>('all')
  const [search,       setSearch]       = useState('')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = receipts
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => r.vendor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'vendor') return mult * a.vendor.localeCompare(b.vendor)
      if (sortKey === 'date')   return mult * (new Date(a.date).getTime() - new Date(b.date).getTime())
      return mult * ((a[sortKey] as number) - (b[sortKey] as number))
    })

  const thStyle: React.CSSProperties = {
    padding: '10px 16px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, color: C.stone,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ width: '100%' }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
        background: '#fff', border: `1px solid ${C.bark}`,
        borderRadius: 14, padding: '14px 20px', marginBottom: 12,
        boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
      }}>

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg
            style={{ position: 'absolute', left: 10, pointerEvents: 'none' }}
            width="14" height="14" fill="none" viewBox="0 0 24 24"
            stroke={C.stone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search vendors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: 32, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
              fontSize: 13, borderRadius: 10, outline: 'none',
              border: `1px solid ${C.bark}`, background: C.parchment,
              color: C.forest, fontFamily: 'Manrope, sans-serif',
              width: 220, transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = C.clover)}
            onBlur={e  => (e.currentTarget.style.borderColor = C.bark)}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['all', 'claimed', 'pending', 'flagged'] as const).map(s => {
            const active = statusFilter === s
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '4px 14px', borderRadius: 999,
                  fontSize: 12, fontWeight: 600,
                  fontFamily: 'Manrope, sans-serif',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? C.fern : '#fff',
                  color:      active ? '#fff' : C.stone,
                  border:     `1px solid ${active ? C.fern : C.bark}`,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = C.fern }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.bark }}
              >
                {s === 'all' ? 'All' : STATUS_PILL[s].label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: 14,
        border: `1px solid ${C.bark}`, overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>

            <thead>
            <tr style={{ background: C.parchment, borderBottom: `1px solid ${C.bark}` }}>
              <th style={thStyle} onClick={() => handleSort('vendor')}>
                Vendor <SortIcon active={sortKey === 'vendor'} dir={sortDir} />
              </th>
              <th style={thStyle} onClick={() => handleSort('date')}>
                Date <SortIcon active={sortKey === 'date'} dir={sortDir} />
              </th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('totalAmount')}>
                Total <SortIcon active={sortKey === 'totalAmount'} dir={sortDir} />
              </th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('vatAmount')}>
                VAT <SortIcon active={sortKey === 'vatAmount'} dir={sortDir} />
              </th>
              <th style={thStyle}>Rate</th>
              <th style={thStyle}>Reclaimable</th>
              <th style={thStyle}>Status</th>
            </tr>
            </thead>

            <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{
                  padding: '48px 24px', textAlign: 'center',
                  fontSize: 13, color: C.stone, background: C.parchment,
                  fontFamily: 'Manrope, sans-serif',
                }}>
                  No receipts match your search.
                </td>
              </tr>
            ) : (
              filtered.map(r => (
                <tr
                  key={r.id}
                  style={{ borderTop: `1px solid ${C.bark}`, background: '#fff', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.parchment)}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >

                  {/* Vendor */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: C.lichen, color: C.fern,
                        fontSize: 11, fontWeight: 700,
                      }}>
                        {r.vendor.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: C.forest }}>
                          {r.vendor}
                        </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 16px', color: C.stone, fontVariantNumeric: 'tabular-nums' }}>
                    {fmtDate(r.date)}
                  </td>

                  {/* Total */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: C.forest, fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(r.totalAmount)}
                  </td>

                  {/* VAT */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: r.vatAmount > 0 ? C.fern : C.stone }}>
                    {fmt(r.vatAmount)}
                  </td>

                  {/* Rate */}
                  <td style={{ padding: '14px 16px' }}>
                    <VatRatePill rate={r.vatRate} />
                  </td>

                  {/* Reclaimable */}
                  <td style={{ padding: '14px 16px' }}>
                    {r.reclaimable ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.success }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Yes
                        </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: C.stone }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          No
                        </span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <StatusPill status={r.status} />
                      {r.status === 'flagged' && r.flagReason && (
                        <FlagTooltip reason={r.flagReason} />
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
            </tbody>

          </table>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px', borderTop: `1px solid ${C.bark}`,
          background: C.parchment,
        }}>
          <span style={{ fontSize: 12, color: C.stone, fontFamily: 'Manrope, sans-serif' }}>
            Showing {filtered.length} of {receipts.length} receipts
          </span>
          <span style={{ fontSize: 12, color: C.stone, fontFamily: 'Manrope, sans-serif' }}>
            Reclaimable VAT:{' '}
            <span style={{ fontWeight: 700, color: C.fern }}>
              {fmt(filtered.filter(r => r.reclaimable).reduce((s, r) => s + r.vatAmount, 0))}
            </span>
          </span>
        </div>
      </div>

    </div>
  )
}