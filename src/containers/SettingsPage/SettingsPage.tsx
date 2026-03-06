'use client'

import React from 'react'
import { C } from '@/styles/colours'

export default function SettingsPage() {
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
      {/* ── Main content ──────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
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
            Account Settings
          </h1>
          <p style={{ fontSize: 14, color: C.stone }}>
            TODO
          </p>
        </div>
      </main>
    </div>
  )
}
