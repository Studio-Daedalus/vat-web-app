// ─── src/types/index.ts ───────────────────────────────────────────────────────
//
// Single source of truth for all shared domain types.
// Import from here across the whole app:
//   import type { Receipt, VatQuarter } from '@/types'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type VatRate = 'standard' | 'reduced' | 'zero' | 'exempt'
export type VatStagger = 1 | 2 | 3 // HMRC VAT stagger group
export type ReceiptStatus = 'COMPLETE' | 'PROCESSING' | 'UPLOADED' | 'FAILED'

// ─── Core entities ────────────────────────────────────────────────────────────

export type Receipt = {
  id: string
  vendor: string
  date: string // ISO 8601 — "2026-02-14"
  totalAmount: number // Gross amount in GBP (pence-safe: stored as float)
  vatAmount: number // VAT portion in GBP
  vatRate: VatRate
  reclaimable: boolean
  status: ReceiptStatus
  flagReason?: string // Populated when status === 'flagged'
  category?: string // e.g. "Fuel", "Equipment"
  imageKey?: string // S3 object key for the receipt image
}

export type VatQuarter = {
  startDate: string // ISO 8601
  endDate: string // ISO 8601
  stagger: VatStagger
  totalReclaimed: number
  totalSpend: number
  receiptCount: number
  submittedToHmrc: boolean
}

export type User = {
  id: string
  name: string
  email: string
  vatNumber?: string
  stagger: VatStagger
  planTier: 'free' | 'core' | 'pro'
  scansUsed: number
  scansLimit: number
}

// ─── Dashboard-specific view types ───────────────────────────────────────────
// Derived/aggregated data shaped for the dashboard UI.
// These are NOT raw API responses — see api.ts for those.

export type DashboardStats = {
  vatReclaimed: string // Formatted: "£421.60"
  vatReclaimedSub: string // e.g. "5 receipts this quarter"
  pendingReview: string
  pendingReviewSub: string
  vatIssues: string
  vatIssuesSub: string
  trendTotal: string
  trendDateRange: string
  avgWeekly: string
  peakWeek: string
  totalReceipts: string
  dateRange: string
}

export type TrendPoint = {
  date: string // Display label: "1 Jan"
  vat: number // Cumulative VAT reclaimed at this point
}

// ─── Single receipt detail ────────────────────────────────────────────────────
// Richer type used on the ReceiptInfo page.
// Transformed from GetReceiptResponse in transformers.ts.

export type ReceiptDetailStatus =
  | 'COMPLETE'
  | 'PENDING'
  | 'PROCESSING'
  | 'FAILED'
export type ReceiptConfidence = 'high' | 'medium' | 'low'

export type ReceiptDetail = {
  id: string
  status: ReceiptDetailStatus
  createdAt: string // ISO 8601
  vendor: string
  vendorVatNo: string | null
  date: string // ISO 8601 — "2025-12-04"
  currency: string
  grossTotal: number // Total inc. VAT
  vatAmount: number
  netAmount: number // Total ex. VAT
  category: string | null
  parseNotes: string[]
  confidence: ReceiptConfidence
  imageUrl: string | null // Pre-signed S3 URL — use immediately
}
