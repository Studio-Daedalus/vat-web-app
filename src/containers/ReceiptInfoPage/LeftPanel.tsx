'use client'

import React, { useState } from 'react'
import { C } from '@/styles/colours'
import type { GetUserReceiptResponse } from '@/types/api'
import { fmt, fmtPct, Card, CardHeader } from './atoms'

// ─── Receipt image ────────────────────────────────────────────────────────────

function ReceiptImagePanel({
  imageURL,
  vendor,
}: {
  imageURL: string
  vendor: string
}) {
  const [imgError, setImgError] = useState(false)
  const hasImage = imageURL && !imgError

  return (
    <Card>
      <CardHeader
        title="Receipt Image"
        right={
          hasImage ? (
            <a
              href={imageURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                color: C.fern,
                textDecoration: 'none',
                padding: '3px 9px',
                borderRadius: 7,
                border: `1px solid ${C.fern}40`,
                background: `${C.fern}0e`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${C.fern}1a`
                e.currentTarget.style.borderColor = C.fern
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${C.fern}0e`
                e.currentTarget.style.borderColor = `${C.fern}40`
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
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Full size
            </a>
          ) : undefined
        }
      />
      <div
        style={{
          minHeight: 340,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: hasImage ? '#f7f6f3' : C.parchment,
          padding: hasImage ? 0 : 32,
        }}
      >
        {hasImage ? (
          <img
            src={imageURL}
            alt={`Receipt from ${vendor}`}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              objectFit: 'contain',
              maxHeight: 500,
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${C.bark}80`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="26"
                height="26"
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
            <p style={{ fontSize: 12, color: C.stone, lineHeight: 1.6 }}>
              No image available
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

// ─── VAT scorecard ────────────────────────────────────────────────────────────

function ScoreRow({
  label,
  value,
  valueColor,
  sub,
}: {
  label: string
  value: string
  valueColor?: string
  sub?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '11px 20px',
        borderBottom: `1px solid ${C.bark}`,
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: C.stone, fontWeight: 500 }}>
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 11,
              color: C.stone,
              opacity: 0.65,
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
          fontSize: 16,
          fontWeight: 700,
          color: valueColor ?? C.forest,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export function LeftPanel({ receipt }: { receipt: GetUserReceiptResponse }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ReceiptImagePanel
        imageURL={receipt.imageURL}
        vendor={receipt.vendorName}
      />

      {/* VAT scorecard */}
      <Card>
        <CardHeader title="VAT Summary" />

        <ScoreRow
          label="Gross Total"
          value={fmt(receipt.totalGross, receipt.currency)}
        />
        <ScoreRow
          label="Net Amount"
          value={fmt(receipt.totalNet, receipt.currency)}
          valueColor={C.stone}
        />
        <ScoreRow
          label="Total VAT"
          value={fmt(receipt.totalVat, receipt.currency)}
          valueColor={C.fern}
        />

        {/* Divider */}
        <div style={{ height: 1, background: `${C.bark}`, margin: '0' }} />

        <ScoreRow
          label="Reclaimable VAT"
          value={fmt(receipt.reclaimableVat, receipt.currency)}
          valueColor={C.success}
          sub={`${fmtPct(receipt.effectiveReclaimPct)} effective reclaim`}
        />
        {receipt.nonReclaimableVat > 0 && (
          <ScoreRow
            label="Non-reclaimable"
            value={fmt(receipt.nonReclaimableVat, receipt.currency)}
            valueColor={C.stone}
          />
        )}
        {receipt.partialVatPending > 0 && (
          <ScoreRow
            label="Pending confirmation"
            value={fmt(receipt.partialVatPending, receipt.currency)}
            valueColor={C.warning}
            sub="Requires your input"
          />
        )}

        {/* OCR confidence bar */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.bark}` }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: C.stone,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              OCR Confidence
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color:
                  receipt.ocrConfidence >= 80
                    ? C.success
                    : receipt.ocrConfidence >= 50
                      ? C.warning
                      : C.error,
              }}
            >
              {receipt.ocrConfidence}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: C.bark,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                width: `${receipt.ocrConfidence}%`,
                background:
                  receipt.ocrConfidence >= 80
                    ? C.success
                    : receipt.ocrConfidence >= 50
                      ? C.warning
                      : C.error,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}