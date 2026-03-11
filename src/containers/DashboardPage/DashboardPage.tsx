'use client'

import React, { useState } from 'react'
import { C } from '@/components/Sidebar/icons'
import { StatCards } from './StatCards'
import { VATChart } from './StatChart'
import { IconCalendar } from './icons/CalendarIcon'
import { DashboardStats, type TrendPoint } from '@/types'
import CompleteProfilePopup from './CompleteProfilePopup'
import { GetUserResponse } from '@/types/api'

export type DashboardPageProps = {
  stats: DashboardStats
  trendData: TrendPoint[]
  user?: GetUserResponse
}

export default function DashboardPage({
  stats,
  trendData,
  user,
}: DashboardPageProps) {
  const [showPopup, setShowPopup] = useState(
    !!user && !user.occupation,
  )

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
      {showPopup && user && (
        <CompleteProfilePopup
          email={user.email}
          first={user.first}
          last={user.last}
          onDismiss={() => setShowPopup(false)}
        />
      )}
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
            Welcome back{user?.first !== '' ? `, ${user?.first}` : 'there'}
          </h1>
          <p style={{ fontSize: 14, color: C.stone }}>
            Here's what's happening with your VAT this quarter
          </p>
        </div>

        <StatCards stats={stats} />

        {/* Date range pill */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              border: `1px solid ${C.bark}`,
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: C.forest,
            }}
          >
            <IconCalendar />
            {stats.dateRange}
          </div>
        </div>

        <VATChart stats={stats} trendData={trendData} />
      </main>
    </div>
  )
}
