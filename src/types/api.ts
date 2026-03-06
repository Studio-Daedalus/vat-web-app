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
  vendor: string
  date: string // ISO 8601
  total_amount: number // Go uses snake_case JSON tags
  vat_amount: number
  vat_rate: VatRate
  reclaimable: boolean
  status: ReceiptStatus
  flag_reason: string | null
  category: string | null
  image_key: string | null
  created_at: string // ISO 8601
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

// ─── DashboardPage ────────────────────────────────────────────────────────────────

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
  first_name: string
  last_name: string
  occupation: string
  email: string
  vat_number: string | null
  stagger: VatStagger
  plan_tier: 'free' | 'core' | 'pro'
  scans_used: number
  scans_limit: number
}
