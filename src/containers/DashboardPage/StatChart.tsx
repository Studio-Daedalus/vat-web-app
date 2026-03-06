import type { DashboardStats, TrendPoint } from '@/types'
import { C } from '@/styles/colours'
import React from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

function RechartsTooltip(props: { content: React.JSX.Element }) {
  return null
}

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: C.forest,
        border: `1px solid ${C.fern}50`,
        borderRadius: 10,
        padding: '8px 14px',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div style={{ color: C.stone, fontSize: 11, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ color: C.lichen, fontSize: 14, fontWeight: 700 }}>
        £{payload[0].value.toFixed(2)}
      </div>
    </div>
  )
}

export function VATChart({ stats, trendData }: {
  stats: DashboardStats,
  trendData: TrendPoint[],
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${C.bark}`,
        padding: 24,
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(43,58,46,0.05)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: C.forest,
              marginBottom: 2,
            }}
          >
            VAT Trend
          </div>
          <div style={{ fontSize: 12, color: C.stone }}>
            Cumulative VAT reclaimed · {stats.trendDateRange}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
              fontSize: 28,
              fontWeight: 800,
              color: C.fern,
            }}
          >
            {stats.trendTotal}
          </div>
          <div style={{ fontSize: 12, color: C.stone }}>
            {stats.trendDateRange}
          </div>
        </div>
      </div>
      <Chart trendData={trendData} />

      {/* Footer stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: `1px solid ${C.bark}`,
          marginTop: 16,
          paddingTop: 16,
          gap: 16,
        }}
      >
        {[
          { label: 'Avg Weekly', value: stats.avgWeekly },
          { label: 'Peak Week', value: stats.peakWeek },
          { label: 'Total Receipts', value: stats.totalReceipts },
        ].map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: 'var(--font-source-serif), "Source Serif 4", serif',
                fontSize: 20,
                fontWeight: 700,
                color: C.forest,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: C.stone, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export function Chart({ trendData }: { trendData: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart
        data={trendData}
        margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={C.bark} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: C.stone, fontFamily: 'Manrope' }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fontSize: 10, fill: C.stone, fontFamily: 'Manrope' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `£${v}`}
          width={42}
        />
        <RechartsTooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="vat"
          stroke={C.fern}
          strokeWidth={2.5}
          dot={{ r: 3, fill: C.fern, stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: C.fern, stroke: '#fff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

