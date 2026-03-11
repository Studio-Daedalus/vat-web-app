'use client'

import React, { useState } from 'react'
import { C } from '@/styles/colours'
import type { GetUserReceiptResponse, LineItemApiResponse } from '@/types/api'
import {
  fmt,
  fmtDate,
  fmtShortDate,
  fmtPct,
  Card,
  CardHeader,
  DetailRow,
  Alert,
  FlagChip,
  VAT_RATE_CONFIG,
  RECLAIM_CONFIG,
} from './atoms'

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'lineitems' | 'vat' | 'notes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'lineitems', label: 'Line Items' },
  { id: 'vat', label: 'VAT' },
  { id: 'notes', label: 'Notes' },
]

function TabBar({
  active,
  onChange,
}: {
  active: Tab
  onChange: (t: Tab) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        borderBottom: `1px solid ${C.bark}`,
        padding: '0 4px',
        background: '#fff',
      }}
    >
      {TABS.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              padding: '13px 16px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'Manrope, sans-serif',
              color: isActive ? C.fern : C.stone,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderBottom: isActive
                ? `2px solid ${C.fern}`
                : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = C.forest
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = C.stone
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ r }: { r: GetUserReceiptResponse }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }}
    >
      {/* Alerts */}
      {r.receiptLevelIssues && (
        <Alert type="error">{r.receiptLevelIssues}</Alert>
      )}
      {r.reverseChargeApplicable && (
        <Alert type="warning">
          Reverse charge applies to this receipt — you must account for the VAT
          yourself.
        </Alert>
      )}
      {r.partialVatPending > 0 && (
        <Alert type="warning">
          {fmt(r.partialVatPending, r.currency)} VAT is pending your
          confirmation on partial-use items. Review the Line Items tab to
          resolve.
        </Alert>
      )}
      {r.vatSchemeNote && <Alert type="info">{r.vatSchemeNote}</Alert>}

      {/* Vendor details */}
      <div>
        <div
          style={{
            padding: '4px 0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: C.stone,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Vendor
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <DetailRow label="Name" value={r.vendorName} />
          {r.vendorAddress && (
            <DetailRow label="Address" value={r.vendorAddress} />
          )}
          {r.vendorPhone && <DetailRow label="Phone" value={r.vendorPhone} />}
          {r.vendorWebsite && (
            <DetailRow
              label="Website"
              value={
                <a
                  href={r.vendorWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: C.fern, textDecoration: 'none' }}
                >
                  {r.vendorWebsite}
                </a>
              }
            />
          )}
          {r.vendorVatNumber ? (
            <DetailRow
              label="VAT Number"
              mono
              value={
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {r.vendorVatNumber}
                  {r.vendorVatNumberValid === false && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.error,
                        background: `${C.error}10`,
                        borderRadius: 5,
                        padding: '1px 6px',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      Invalid
                    </span>
                  )}
                  {r.vendorVatNumberValid === true && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.success,
                        background: `${C.success}10`,
                        borderRadius: 5,
                        padding: '1px 6px',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                    >
                      Valid
                    </span>
                  )}
                </span>
              }
            />
          ) : (
            <DetailRow
              label="VAT Number"
              value={
                <span style={{ color: C.error, fontWeight: 600 }}>
                  Not found
                </span>
              }
            />
          )}
        </div>
      </div>

      {/* Transaction details */}
      <div>
        <div
          style={{
            padding: '4px 0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: C.stone,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Transaction
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <DetailRow label="Date" value={fmtDate(r.transactionDate)} />
          {r.transactionTime && (
            <DetailRow label="Time" value={r.transactionTime} />
          )}
          {r.transactionReceiptNumber && (
            <DetailRow
              label="Receipt No."
              value={r.transactionReceiptNumber}
              mono
            />
          )}
          {r.paymentMethod && (
            <DetailRow label="Payment" value={r.paymentMethod} />
          )}
          <DetailRow label="Currency" value={r.currency} />
          {r.vatReturnPeriod && (
            <DetailRow label="VAT Period" value={r.vatReturnPeriod} />
          )}
          <DetailRow
            label="Added to Return"
            value={r.addedToReturn ? 'Yes' : 'No'}
            valueStyle={{ color: r.addedToReturn ? C.success : C.stone }}
          />
          <DetailRow label="Scanned" value={fmtShortDate(r.scannedAt)} />
          <DetailRow label="Last Updated" value={fmtShortDate(r.updatedAt)} />
        </div>
      </div>
    </div>
  )
}

// ─── Line items tab ───────────────────────────────────────────────────────────

function ReclaimBadge({ reclaimable }: { reclaimable: string }) {
  const cfg = RECLAIM_CONFIG[reclaimable as keyof typeof RECLAIM_CONFIG] ?? {
    color: C.stone,
    label: reclaimable,
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        background: `${cfg.color}12`,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  )
}

function LineItemRow({
  item,
  currency,
}: {
  item: LineItemApiResponse
  currency: string
}) {
  const [expanded, setExpanded] = useState(false)
  const hasDetail = !!(
    item.reclaim_reason ||
    item.reclaim_caveat ||
    item.hmrc_reference ||
    item.flags.length > 0
  )

  return (
    <>
      <tr
        onClick={() => hasDetail && setExpanded((e) => !e)}
        style={{
          borderTop: `1px solid ${C.bark}`,
          background:
            item.reclaimable === 'partial' ? `${C.warning}05` : '#fff',
          cursor: hasDetail ? 'pointer' : 'default',
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => {
          if (hasDetail) e.currentTarget.style.background = C.parchment
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            item.reclaimable === 'partial' ? `${C.warning}05` : '#fff'
        }}
      >
        {/* Description */}
        <td style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasDetail && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.stone}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  transform: expanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <div>
              <div style={{ fontWeight: 600, color: C.forest, fontSize: 13 }}>
                {item.description}
              </div>
              <div style={{ fontSize: 11, color: C.stone, marginTop: 2 }}>
                {item.category}
              </div>
            </div>
          </div>
        </td>

        {/* Qty */}
        <td
          style={{
            padding: '12px 16px',
            textAlign: 'right',
            fontSize: 13,
            color: C.stone,
          }}
        >
          {item.quantity}
        </td>

        {/* VAT rate */}
        <td
          style={{
            padding: '12px 16px',
            textAlign: 'right',
            fontSize: 12,
            color: C.stone,
            whiteSpace: 'nowrap',
          }}
        >
          {VAT_RATE_CONFIG[item.vat_rate_label]?.pct ?? '?'}&nbsp;
          <span style={{ opacity: 0.7 }}>{item.vat_rate_label}</span>
        </td>

        {/* Net */}
        <td
          style={{
            padding: '12px 16px',
            textAlign: 'right',
            fontSize: 13,
            fontWeight: 600,
            color: C.forest,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {fmt(item.line_net, currency)}
        </td>

        {/* VAT */}
        <td
          style={{
            padding: '12px 16px',
            textAlign: 'right',
            fontSize: 13,
            fontWeight: 600,
            color: C.fern,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {fmt(item.vat_amount, currency)}
        </td>

        {/* Reclaim */}
        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 4,
            }}
          >
            {item.reclaim_amount !== null ? (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: RECLAIM_CONFIG[item.reclaimable]?.color ?? C.forest,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmt(item.reclaim_amount, currency)}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: C.warning, fontWeight: 600 }}>
                Pending
              </span>
            )}
            <ReclaimBadge reclaimable={item.reclaimable} />
          </div>
        </td>
      </tr>

      {/* Expandable detail row */}
      {expanded && (
        <tr style={{ background: `${C.parchment}cc` }}>
          <td colSpan={6} style={{ padding: '0 16px 14px 40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {item.flags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                    paddingTop: 10,
                  }}
                >
                  {item.flags.map((f) => (
                    <FlagChip key={f} flag={f} />
                  ))}
                </div>
              )}

              {item.reclaim_reason && (
                <p
                  style={{
                    fontSize: 12,
                    color: C.forest,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Rationale: </span>
                  {item.reclaim_reason}
                </p>
              )}

              {item.reclaim_caveat && (
                <p
                  style={{
                    fontSize: 12,
                    color: C.warning,
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Caveat: </span>
                  {item.reclaim_caveat}
                </p>
              )}

              {item.hmrc_reference && (
                <p style={{ fontSize: 11, color: C.stone, margin: 0 }}>
                  HMRC Ref:{' '}
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {item.hmrc_reference}
                  </span>
                </p>
              )}

              {/* Partial reclaim slider placeholder */}
              {item.reclaimable === 'partial' && item.reclaim_pct === null && (
                <div
                  style={{
                    marginTop: 4,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: `${C.warning}10`,
                    border: `1px solid ${C.warning}30`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      color: C.warning,
                      margin: '0 0 8px',
                      fontWeight: 600,
                    }}
                  >
                    What percentage is for business use?
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={50}
                    onChange={(e) =>
                      console.log(
                        'reclaim_pct changed',
                        item.id,
                        e.target.value,
                      )
                    }
                    style={{ width: '100%', accentColor: C.fern }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: C.stone,
                      marginTop: 4,
                    }}
                  >
                    <span>0% business</span>
                    <span>100% business</span>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function LineItemsTab({ r }: { r: GetUserReceiptResponse }) {
  const pendingItems = r.lineItems.filter(
    (i) => i.reclaimable === 'partial' && i.reclaim_pct === null,
  )

  return (
    <div
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {pendingItems.length > 0 && (
        <Alert type="warning">
          {pendingItems.length} item{pendingItems.length > 1 ? 's' : ''} need
          {pendingItems.length === 1 ? 's' : ''} your input on business-use
          percentage. Expand each row to confirm.
        </Alert>
      )}

      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${C.bark}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: C.parchment }}>
                {['Item', 'Qty', 'VAT Rate', 'Net', 'VAT', 'Reclaimable'].map(
                  (h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 16px',
                        textAlign: i === 0 ? 'left' : 'right',
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.stone,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                        borderBottom: `1px solid ${C.bark}`,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {r.lineItems.map((item) => (
                <LineItemRow key={item.id} item={item} currency={r.currency} />
              ))}
            </tbody>
            <tfoot>
              <tr
                style={{
                  background: C.parchment,
                  borderTop: `2px solid ${C.bark}`,
                }}
              >
                <td
                  colSpan={3}
                  style={{
                    padding: '12px 16px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.stone,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: C.forest,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(r.totalNet, r.currency)}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color: C.fern,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(r.totalVat, r.currency)}
                </td>
                <td
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    fontFamily:
                      'var(--font-source-serif), "Source Serif 4", serif',
                    fontSize: 17,
                    fontWeight: 800,
                    color: C.fern,
                  }}
                >
                  {fmt(r.reclaimableVat, r.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── VAT analysis tab ─────────────────────────────────────────────────────────

function VATTab({ r }: { r: GetUserReceiptResponse }) {
  // Group line items by VAT rate
  const byRate = r.lineItems.reduce<
    Record<string, { net: number; vat: number; gross: number; count: number }>
  >((acc, item) => {
    const key = item.vat_rate_label
    if (!acc[key]) acc[key] = { net: 0, vat: 0, gross: 0, count: 0 }
    acc[key].net += item.line_net
    acc[key].vat += item.vat_amount
    acc[key].gross += item.line_gross
    acc[key].count += 1
    return acc
  }, {})

  return (
    <div
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {r.parseNotes && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: `${C.fern}08`,
            border: `1px solid ${C.fern}25`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.fern,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: 6,
            }}
          >
            AI Parse Notes
          </div>
          <p
            style={{
              fontSize: 12,
              color: C.forest,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {r.parseNotes}
          </p>
        </div>
      )}

      {/* Breakdown by rate */}
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${C.bark}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            background: C.parchment,
            borderBottom: `1px solid ${C.bark}`,
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
            Breakdown by VAT Rate
          </span>
        </div>
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
              {['Rate', 'Items', 'Net', 'VAT', 'Gross'].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: '9px 16px',
                    textAlign: i <= 1 ? 'left' : 'right',
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.stone,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(byRate).map(([rate, totals]) => {
              const cfg = VAT_RATE_CONFIG[rate as keyof typeof VAT_RATE_CONFIG]
              return (
                <tr key={rate} style={{ borderTop: `1px solid ${C.bark}` }}>
                  <td
                    style={{
                      padding: '11px 16px',
                      fontWeight: 600,
                      color: C.forest,
                    }}
                  >
                    {cfg?.label ?? rate}{' '}
                    <span style={{ color: C.stone, fontWeight: 400 }}>
                      ({cfg?.pct ?? rate})
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px', color: C.stone }}>
                    {totals.count}
                  </td>
                  <td
                    style={{
                      padding: '11px 16px',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                      color: C.forest,
                      fontWeight: 600,
                    }}
                  >
                    {fmt(totals.net, r.currency)}
                  </td>
                  <td
                    style={{
                      padding: '11px 16px',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                      color: C.fern,
                      fontWeight: 600,
                    }}
                  >
                    {fmt(totals.vat, r.currency)}
                  </td>
                  <td
                    style={{
                      padding: '11px 16px',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                      color: C.forest,
                      fontWeight: 700,
                    }}
                  >
                    {fmt(totals.gross, r.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Reclaim summary */}
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${C.bark}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            background: C.parchment,
            borderBottom: `1px solid ${C.bark}`,
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
            Reclaim Position
          </span>
        </div>
        <div style={{ padding: '4px 16px 8px' }}>
          <DetailRow
            label="Total VAT on receipt"
            value={fmt(r.totalVat, r.currency)}
          />
          <DetailRow
            label="Reclaimable"
            value={fmt(r.reclaimableVat, r.currency)}
            valueStyle={{ color: C.success }}
          />
          <DetailRow
            label="Non-reclaimable"
            value={fmt(r.nonReclaimableVat, r.currency)}
            valueStyle={{ color: C.stone }}
          />
          {r.partialVatPending > 0 && (
            <DetailRow
              label="Pending confirmation"
              value={fmt(r.partialVatPending, r.currency)}
              valueStyle={{ color: C.warning }}
            />
          )}
          <DetailRow
            label="Effective reclaim rate"
            value={fmtPct(r.effectiveReclaimPct)}
            valueStyle={{
              fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
              fontSize: 18,
              color: C.fern,
            }}
          />
        </div>
      </div>

      {r.reverseChargeApplicable && (
        <Alert type="warning">
          <strong>Reverse Charge applies.</strong> You must account for the VAT
          on this supply under the reverse charge mechanism (VAT Notice 735).
        </Alert>
      )}
    </div>
  )
}

// ─── Notes tab ────────────────────────────────────────────────────────────────

function NotesTab({
  r,
  onSaveNotes,
}: {
  r: GetUserReceiptResponse
  onSaveNotes: (notes: string) => void
}) {
  const [notes, setNotes] = useState(r.userNotes ?? '')

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* User notes */}
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 8,
            fontSize: 11,
            fontWeight: 700,
            color: C.stone,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Your Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this receipt…"
          rows={4}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: `1px solid ${C.bark}`,
            background: C.parchment,
            fontSize: 13,
            color: C.forest,
            fontFamily: 'Manrope, sans-serif',
            resize: 'vertical',
            outline: 'none',
            lineHeight: 1.6,
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = C.clover)}
          onBlur={(e) => (e.currentTarget.style.borderColor = C.bark)}
        />
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}
        >
          <button
            onClick={() => {
              console.log('save notes', r.receiptId, notes)
              onSaveNotes(notes)
            }}
            style={{
              padding: '7px 16px',
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'Manrope, sans-serif',
              background: C.fern,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.forest)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.fern)}
          >
            Save Notes
          </button>
        </div>
      </div>

      {/* Suggested chat questions */}
      {r.suggestedChatQuestions && r.suggestedChatQuestions.length > 0 && (
        <div>
          <div
            style={{
              marginBottom: 10,
              fontSize: 11,
              fontWeight: 700,
              color: C.stone,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Suggested Questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {r.suggestedChatQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => console.log('suggested question clicked', q)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  textAlign: 'left',
                  fontSize: 12,
                  color: C.forest,
                  fontFamily: 'Manrope, sans-serif',
                  background: '#fff',
                  border: `1px solid ${C.bark}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.fern
                  e.currentTarget.style.background = `${C.fern}08`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.bark
                  e.currentTarget.style.background = '#fff'
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={C.fern}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Parse notes (read-only) */}
      {r.parseNotes && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            background: `${C.fern}08`,
            border: `1px solid ${C.fern}25`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.fern,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: 6,
            }}
          >
            AI Parse Notes
          </div>
          <p
            style={{
              fontSize: 12,
              color: C.forest,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {r.parseNotes}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Right panel ──────────────────────────────────────────────────────────────

export function RightPanel({ receipt }: { receipt: GetUserReceiptResponse }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Auto-open line items if there are pending partial items
  React.useEffect(() => {
    const hasPending = receipt.lineItems.some(
      (i) => i.reclaimable === 'partial' && i.reclaim_pct === null,
    )
    if (hasPending) setActiveTab('lineitems')
  }, [receipt.receiptId])

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <TabBar active={activeTab} onChange={setActiveTab} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'overview' && <OverviewTab r={receipt} />}
        {activeTab === 'lineitems' && <LineItemsTab r={receipt} />}
        {activeTab === 'vat' && <VATTab r={receipt} />}
        {activeTab === 'notes' && (
          <NotesTab
            r={receipt}
            onSaveNotes={(notes) =>
              console.log('onSaveNotes', receipt.receiptId, notes)
            }
          />
        )}
      </div>
    </Card>
  )
}
