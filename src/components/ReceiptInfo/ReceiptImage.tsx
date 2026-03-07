'use client'

import React, { useState } from 'react'
import { C } from '@/styles/colours'

export type ReceiptImageProps = {
  vendor: string
  imageUrl: string | null // Pre-signed S3 URL from ReceiptDetail.imageUrl
}

function IconReceipt() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.stone}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  )
}

function IconExpand() {
  return (
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
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  )
}

export function ReceiptImage({ vendor, imageUrl }: ReceiptImageProps) {
  const [error, setError] = useState(false)
  const hasImage = !!imageUrl && !error

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${C.bark}`,
        boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${C.bark}`,
          background: C.parchment,
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
          Receipt Image
        </span>
        {hasImage && (
          <a
            href={imageUrl!}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: C.fern,
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 8,
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
            <IconExpand />
            Open full size
          </a>
        )}
      </div>

      {/* Image area */}
      <div
        style={{
          flex: 1,
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: hasImage ? 0 : 32,
          background: hasImage ? '#f8f8f6' : C.parchment,
        }}
      >
        {hasImage ? (
          <img
            src={imageUrl!}
            alt={`Receipt from ${vendor}`}
            onError={() => setError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              maxHeight: 600,
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                background: `${C.bark}80`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconReceipt />
            </div>
            <p
              style={{
                fontSize: 13,
                color: C.stone,
                maxWidth: 180,
                lineHeight: 1.6,
              }}
            >
              No image available for this receipt
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
