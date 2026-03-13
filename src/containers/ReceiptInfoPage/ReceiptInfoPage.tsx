'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { C } from '@/styles/colours'
import type { GetUserReceiptResponse } from '@/types/api'
import { STATUS_CONFIG, StatusPill, ActionButton } from './atoms'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'Manrope, sans-serif',
        color: hovered ? C.forest : C.stone,
        background: 'transparent',
        border: `1px solid ${hovered ? C.stone : C.bark}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      All receipts
    </button>
  )
}

// ─── Action bar ───────────────────────────────────────────────────────────────

async function callUpdateReceipt(
  receiptId: string,
  userId: string,
  addedToReturn: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/receipts/${receiptId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userSubID: userId, receiptID: receiptId, addedToReturn }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, error: json?.error ?? 'Failed to update receipt' }
  return { ok: true }
}

function ActionBar({ receipt }: { receipt: GetUserReceiptResponse }) {
  const { status } = receipt
  const needsAction = STATUS_CONFIG[status]?.needsAction
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleRemoveFromReturn = async () => {
    setIsUpdating(true)
    setUpdateError(null)
    const result = await callUpdateReceipt(
      receipt.receiptId,
      receipt.userId,
      false,
    )
    if (result.ok) {
      router.refresh()
    } else {
      setUpdateError(result.error ?? 'Something went wrong')
    }
    setIsUpdating(false)
  }

  const handleAddToReturn = async () => {
    setIsUpdating(true)
    setUpdateError(null)
    const result = await callUpdateReceipt(receipt.receiptId, receipt.userId, true)
    if (result.ok) {
      router.refresh()
    } else {
      setUpdateError(result.error ?? 'Something went wrong')
    }
    setIsUpdating(false)
  }

  // Always render — shrinks gracefully when no actions needed
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        borderTop: `1px solid ${C.bark}`,
        background: 'rgba(250,248,243,0.95)',
        backdropFilter: 'blur(8px)',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {needsAction && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: C.warning,
            }}
          >
            <svg
              width="14"
              height="14"
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
            This receipt needs your review before it can be added to a return
          </div>
        )}
        {!needsAction && status === 'REVIEWED' && (
          <span style={{ fontSize: 12, color: C.stone }}>
            Receipt reviewed — ready to add to your VAT return.
          </span>
        )}
        {status === 'ADDED_TO_RETURN' && (
          <span style={{ fontSize: 12, color: C.stone }}>
            Included in VAT return
            {receipt.vatReturnPeriod ? ` · ${receipt.vatReturnPeriod}` : ''}.
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {/* Mark as reviewed — shown when pending */}
        {/*{status === 'PENDING_REVIEW' && (*/}
        {/*  <ActionButton*/}
        {/*    label="Mark as Reviewed"*/}
        {/*    variant="primary"*/}
        {/*    icon={*/}
        {/*      <svg*/}
        {/*        width="14"*/}
        {/*        height="14"*/}
        {/*        viewBox="0 0 24 24"*/}
        {/*        fill="none"*/}
        {/*        stroke="currentColor"*/}
        {/*        strokeWidth="2.5"*/}
        {/*        strokeLinecap="round"*/}
        {/*        strokeLinejoin="round"*/}
        {/*      >*/}
        {/*        <polyline points="20 6 9 17 4 12" />*/}
        {/*      </svg>*/}
        {/*    }*/}
        {/*    onClick={handleMarkAsReviewed}*/}
        {/*    disabled={isUpdating}*/}
        {/*  />*/}
        {/*)}*/}

        {/* Add to return — shown when reviewed */}
        <ActionButton
          label={
            receipt.addedToReturn ? 'Added to Return' : 'Add to VAT Return'
          }
          variant="primary"
          icon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
          onClick={handleAddToReturn}
          disabled={isUpdating || receipt.addedToReturn}
        />

        {/* Remove from return */}
        {status === 'ADDED_TO_RETURN' && (
          <ActionButton
            label="Remove from Return"
            variant="secondary"
            onClick={handleRemoveFromReturn}
            disabled={isUpdating}
          />
        )}

        {/* Exclude — available unless already excluded */}
        {/*{status !== 'EXCLUDED' &&*/}
        {/*  status !== 'PROCESSING' &&*/}
        {/*  status !== 'FAILED' && (*/}
        {/*    <ActionButton*/}
        {/*      label={status === 'EXCLUDED' ? 'Excluded' : 'Exclude'}*/}
        {/*      variant="danger"*/}
        {/*      onClick={() => console.log('excludeReceipt', receipt.receiptId)}*/}
        {/*    />*/}
        {/*  )}*/}

        {/* Re-include if excluded */}
        {status === 'EXCLUDED' && (
          <ActionButton
            label="Re-include"
            variant="secondary"
            onClick={() => console.log('reInclude', receipt.receiptId)}
          />
        )}
      </div>
      {updateError && (
        <p
          style={{
            fontSize: 12,
            color: C.error,
            marginTop: 8,
            width: '100%',
            textAlign: 'right',
          }}
        >
          {updateError}
        </p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export type ReceiptPageProps = {
  receipt: GetUserReceiptResponse
  onBack?: () => void
}

export default function ReceiptInfoPage({ receipt, onBack }: ReceiptPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'Manrope, sans-serif',
        background: C.parchment,
      }}
    >
      {/* ── Scrollable body ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Page header */}
        <div
          style={{
            padding: '24px 32px 20px',
            borderBottom: `1px solid ${C.bark}`,
            background: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          {onBack && (
            <div style={{ marginBottom: 14 }}>
              <BackButton onClick={onBack} />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily:
                    'var(--font-source-serif), "Source Serif 4", serif',
                  fontSize: 28,
                  fontWeight: 700,
                  color: C.forest,
                  lineHeight: 1.2,
                  margin: '0 0 6px',
                }}
              >
                {receipt.vendorName}
              </h1>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 13, color: C.stone }}>
                  {new Date(receipt.transactionDate).toLocaleDateString(
                    'en-GB',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </span>
                <span style={{ color: C.bark }}>·</span>
                <code
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.fern,
                    background: `${C.fern}12`,
                    border: `1px solid ${C.fern}30`,
                    borderRadius: 5,
                    padding: '2px 7px',
                  }}
                >
                  {receipt.receiptId}
                </code>
                <StatusPill status={receipt.status} />
              </div>
            </div>

            {/* Gross total */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  fontFamily:
                    'var(--font-source-serif), "Source Serif 4", serif',
                  fontSize: 32,
                  fontWeight: 800,
                  color: C.forest,
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {receipt.totalGross.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: receipt.currency,
                })}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.fern,
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {receipt.reclaimableVat.toLocaleString('en-GB', {
                  style: 'currency',
                  currency: receipt.currency,
                })}{' '}
                reclaimable VAT
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          className="receipt-page-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 380px) 1fr',
            gap: 20,
            padding: '20px 32px 32px',
            alignItems: 'start',
          }}
        >
          <LeftPanel receipt={receipt} />
          <RightPanel receipt={receipt} />
        </div>
      </div>

      {/* ── Sticky action bar ────────────────────────────────────────── */}
      <ActionBar receipt={receipt} />

      <style>{`
        @media (max-width: 860px) {
          .receipt-page-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
