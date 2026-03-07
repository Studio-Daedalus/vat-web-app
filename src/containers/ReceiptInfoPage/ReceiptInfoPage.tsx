'use client'

import React from 'react'
import { C } from '@/styles/colours'
import { ReceiptImage } from '@/components/ReceiptInfo/ReceiptImage'
import { ReceiptItemsTable } from '@/components/ReceiptInfo/ReceiptItemsTable'
import type { GetReceiptResponse } from '@/types/api'

function IconBack() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export type ReceiptInfoPageProps = {
  receipt: GetReceiptResponse
  onBack?: () => void
}

export default function ReceiptInfoPage({
  receipt,
  onBack,
}: ReceiptInfoPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: 'Manrope, sans-serif',
        background: C.parchment,
      }}
    >
      <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 32 }}>
        {/* Back */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 20,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: C.stone,
              background: 'transparent',
              border: `1px solid ${C.bark}`,
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.forest
              e.currentTarget.style.borderColor = C.stone
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.stone
              e.currentTarget.style.borderColor = C.bark
            }}
          >
            <IconBack />
            All receipts
          </button>
        )}

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
              fontSize: 32,
              fontWeight: 700,
              color: C.forest,
              lineHeight: 1.2,
              marginBottom: 6,
            }}
          >
            {receipt.vendor}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, color: C.stone }}>Receipt ID</span>
            <code
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.fern,
                background: `${C.fern}12`,
                border: `1px solid ${C.fern}30`,
                borderRadius: 6,
                padding: '2px 8px',
              }}
            >
              {receipt.id}
            </code>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          className="receipt-info-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 420px) 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <ReceiptImage vendor={receipt.vendor} imageUrl={receipt.s3_presigned_url} />
          <ReceiptItemsTable receipt={receipt} />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .receipt-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
