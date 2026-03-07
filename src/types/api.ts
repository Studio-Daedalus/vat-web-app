// ─── src/types/api.ts ─────────────────────────────────────────────────────────
//
// API request and response shapes.
// These mirror what your Go handlers return — the frontend transforms them
// into domain types (see index.ts) before passing to components.
//
// Naming convention:
//   *Response  — what the API returns
//   *Request   — what the API expects as a body

import type { VatRate, VatStagger, ReceiptStatus } from './index'

// ─── Envelope ─────────────────────────────────────────────────────────────────
// Every API response is wrapped in this envelope.
// Your Go handlers should always return this shape.
//
// Success: { ok: true,  data: T,      error: null    }
// Failure: { ok: false, data: null,   error: { code, message } }

export type ApiResponse<T> =
  | { ok: true; data: T; error: null }
  | { ok: false; data: null; error: { code: string; message: string } }

// ─── Receipts ─────────────────────────────────────────────────────────────────

// GET /api/receipts
// GET /api/receipts?status=flagged&from=2026-01-01&to=2026-03-31
export type ReceiptApiResponse = {
  id: string
  status: 'COMPLETE' | 'PROCESSING' | 'UPLOADED' | 'FAILED'
  created_at: string // ISO 8601
  vendor: string | null
  receipt_date: string | null // ISO 8601
  currency: string
  gross_total: number | null
  vat_amount: number | null
  net_amount: number | null
  category: string | null
  vat_issues?: string[] | null
}

export type ListReceiptsResponse = {
  receipts: ReceiptApiResponse[]
  total: number
  page: number
  page_size: number
}

// POST /api/receipts/upload — presigned URL request
export type CreateUploadUrlRequest = {
  filename: string
  content_type: string
}

export type CreateUploadUrlResponse = {
  receipt_id: string // Pre-assigned ID for the receipt being created
  upload_url: string // S3 presigned PUT URL
  expires_at: string // ISO 8601 — URL expiry
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

// GET /api/dashboard?from=2026-01-01&to=2026-03-31
export type DashboardApiResponse = {
  quarter: {
    start_date: string
    end_date: string
    stagger: VatStagger
    total_reclaimed: number
    total_spend: number
    receipt_count: number
    submitted_to_hmrc: boolean
  }
  trend: {
    date: string // Display label
    vat: number // Cumulative VAT at this point
  }[]
  recent_receipts: ReceiptApiResponse[]
  stats: {
    vat_reclaimed: number
    pending_count: number
    pending_amount: number
    flagged_count: number
  }
}

// ─── User ─────────────────────────────────────────────────────────────────────

// GET /api/user/me
export type UserApiResponse = {
  id: string
  name: string
  email: string
  vat_number: string | null
  stagger: VatStagger
  plan_tier: 'free' | 'core' | 'pro'
  scans_used: number
  scans_limit: number
}

// ─── Single receipt ────────────────────────────────────────────────────────────

// GET /api/receipts/:id
// The real shape returned by the backend for a single receipt.
export type ReceiptStatus_API =
  | 'COMPLETE'
  | 'PENDING'
  | 'PROCESSING'
  | 'FAILED'

export type GetReceiptResponse = {
  id: string
  status: ReceiptStatus_API
  created_at: string // ISO 8601
  vendor: string
  vendor_vat_no: string | null
  receipt_date: string // ISO 8601 — "2025-12-04"
  currency: string // e.g. "GBP"
  gross_total: number // Total inc. VAT
  vat_amount: number
  net_amount: number // Total ex. VAT
  category: string | null
  parse_notes: string[] // AI-generated observations
  vat_issues: string[]
  confidence: 'high' | 'medium' | 'low'
  s3_presigned_url: string | null // Expires — use immediately, don't store
}
