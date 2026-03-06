'use client'

import React from 'react'
import { C } from '@/components/Sidebar/icons'
import type { DashboardStats } from '../../types'

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: 'VAT Reclaimed',
      value: stats.vatReclaimed,
      sub: stats.vatReclaimedSub,
      accent: C.fern,
    },
    {
      label: 'Pending Review',
      value: stats.pendingReview,
      sub: stats.pendingReviewSub,
      accent: C.warning,
    },
    {
      label: 'VAT Issues',
      value: stats.vatIssues,
      sub: stats.vatIssuesSub,
      accent: C.error,
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: '#fff',
            borderRadius: 14,
            border: `1px solid ${C.bark}`,
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.stone,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            {card.label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
              fontSize: 30,
              fontWeight: 800,
              color: card.accent,
              marginBottom: 4,
              lineHeight: 1,
            }}
          >
            {card.value}
          </div>
          <div style={{ fontSize: 12, color: C.stone }}>{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
