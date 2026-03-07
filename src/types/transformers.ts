// ─── src/lib/transformers.ts ──────────────────────────────────────────────────
//
// Converts raw API responses (snake_case) into the shaped types
// that UI components expect. This is the only place snake_case→camelCase
// conversion should happen.

import type {
  DashboardApiResponse,
  ReceiptListResponse,
  ReceiptAPIResponse,
} from '@/types/api'
import type { DashboardStats, TrendPoint, Receipt } from '@/types'

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

const fmtDateRange = (start: string, end: string) => {
  const s = new Date(start).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const e = new Date(end).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${s} — ${e}`
}

const fmtShortRange = (start: string, end: string) => {
  const s = new Date(start).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
  const e = new Date(end).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${s} – ${e}`
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function transformDashboardStats(
  data: DashboardApiResponse,
): DashboardStats {
  const { stats, quarter } = data

  return {
    vatReclaimed: fmt(stats.vat_reclaimed),
    vatReclaimedSub: `${quarter.receipt_count} receipts this quarter`,

    pendingReview: fmt(stats.pending_amount),
    pendingReviewSub:
      stats.pending_count === 1
        ? '1 receipt needs action'
        : `${stats.pending_count} receipts need action`,

    vatIssues: String(stats.flagged_count),
    vatIssuesSub:
      stats.flagged_count === 1
        ? '1 receipt needs review'
        : `${stats.flagged_count} receipts need review`,

    trendTotal: fmt(stats.vat_reclaimed),
    trendDateRange: fmtShortRange(quarter.start_date, quarter.end_date),

    avgWeekly: fmt(stats.vat_reclaimed / 13), // 13 weeks per quarter
    peakWeek: fmt(Math.max(...data.trend.map((p) => p.vat))),
    totalReceipts: String(quarter.receipt_count),

    dateRange: fmtDateRange(quarter.start_date, quarter.end_date),
  }
}

// ─── Receipts ─────────────────────────────────────────────────────────────────

// // Shared row mapper — used by both transformers below.
// function mapReceipt(r: ReceiptAPIResponse): Receipt {
//   return {
//     id: r.id,
//     vendor: r.vendor,
//     date: r.date, // kept as ISO — components format for display
//     totalAmount: r.total_amount,
//     vatAmount: r.vat_amount,
//     vatRate: r.vat_rate,
//     reclaimable: r.reclaimable,
//     status: r.status,
//     flagReason: r.flag_reason ?? undefined,
//     category: r.category ?? undefined,
//     imageKey: r.image_key ?? undefined,
//   }
// }
//
// // Used on the Receipts page (full ListReceiptsResponse from sampleReceiptsResponse)
// export function transformReceiptsList(data: ListReceiptsResponse): Receipt[] {
//   return data.receipts.map(mapReceipt)
// }

// ─── Trend ────────────────────────────────────────────────────────────────────

export function transformTrend(
  raw: DashboardApiResponse['trend'],
): TrendPoint[] {
  return raw.map((p) => ({ date: p.date, vat: p.vat }))
}
