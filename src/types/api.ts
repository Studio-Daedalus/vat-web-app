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

// ─── User ─────────────────────────────────────────────────────────────────────

// GET /api/user/getUser
export type GetUserResponse = {
  subID: string
  email: string
  first: string
  last: string
  occupation?: string
  monthlyRequests: number
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

// ─── Receipts ─────────────────────────────────────────────────────────────────

// GET /api/receipts
export type SearchUserReceiptsResponse = {
  Records: SearchUserReceiptsItem[]
  NextToken: string
}

export type SearchUserReceiptsItem = {
  receiptId: string
  userId: string
  scannedAt: string // ISO 8601 timestamp
  ocrConfidence: number // 0–100
  vendorName: string
  vendorVatNumber?: string // omitempty → optional
  vendorVatNumberValid?: boolean // omitempty → optional
  transactionDate: string // "YYYY-MM-DD"
  transactionTime?: string // omitempty → optional, "HH:MM:SS"
  currency: string // e.g. "GBP"
  totalNet: number
  totalVat: number
  totalGross: number
  reclaimableVat: number
  nonReclaimableVat: number
  partialVatPending: number
  effectiveReclaimPct: number // 0.0–1.0 or 0–100, confirm with backend
  riskFlagsJson: string // Raw JSON string — parse before use
  status: ReceiptStatus_Backend
  addedToReturn: boolean
}

export type ReceiptStatus_Backend =
  | 'COMPLETE'
  | 'PENDING'
  | 'FLAGGED'
  | 'PROCESSING'
  | 'ERROR'

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

// POST /api/receipts/lineItem/update
export type UpdateLineItemRequest = {
  reclaimPct: number
  userJustification?: string
}

// POST /api/receipts/:id/update
export type UpdateReceiptRequest = {
  userSubID: string
  receiptID: string
  addedToReturn: boolean
}

export type UpdateReceiptResponse = Record<string, never>

// ─── Single receipt ───────────────────────────────────────────────────────────

// GET /api/receipts/:id
// Mirrors the UserReceipt Go struct exactly.
export type UserReceiptStatus =
  | 'PENDING_REVIEW'   // AI parsed; ≥1 item unresolved
  | 'REVIEWED'         // all items resolved; ready to add to return
  | 'ADDED_TO_RETURN'  // included in a VAT return period
  | 'EXCLUDED'         // user chose not to include
  | 'PROCESSING'
  | 'FAILED'

export type VATRateLabel =
  | 'standard'
  | 'reduced'
  | 'zero'
  | 'exempt'
  | 'unknown'

export type Reclaimable =
  | 'full'
  | 'partial'   // user must confirm before use in return
  | 'none'
  | 'unknown'

export type LineItemFlag =
  | 'NO_VAT_NUMBER'
  | 'MIXED_USE'
  | 'PERSONAL_ITEM'
  | 'ENTERTAINMENT'
  | 'REVERSE_CHARGE'
  | 'ZERO_RATED'
  | 'EXEMPT_SUPPLY'
  | 'HIGH_VALUE'
  | 'CIS_LABOUR'
  | 'SUBSISTENCE'

export type LineItemApiResponse = {
  id:                 number
  description:        string
  category:           string
  quantity:           number
  unit_price_net:     number
  line_net:           number
  vat_rate_pct:       number
  vat_rate_label:     VATRateLabel
  vat_amount:         number
  line_gross:         number
  reclaimable:        Reclaimable
  reclaim_pct:        number | null   // null = pending user review
  reclaim_amount:     number | null   // null when reclaim_pct is null
  reclaim_reason:     string
  reclaim_caveat?:    string          // omitempty
  hmrc_reference?:    string          // omitempty
  flags:              LineItemFlag[]
  user_validated:     boolean
  user_justification: string | null
}

export type GetUserReceiptResponse = {
  // ── Identity ───────────────────────────────────────────────────────
  receiptId:                string
  userId:                   string
  status:                   UserReceiptStatus
  createdAt:                string        // ISO 8601
  updatedAt:                string        // ISO 8601
  scannedAt:                string        // ISO 8601

  // ── Vendor ─────────────────────────────────────────────────────────
  vendorName:               string
  vendorAddress?:           string        // omitempty
  vendorVatNumber?:         string        // omitempty
  vendorVatNumberValid?:    boolean       // omitempty
  vendorPhone?:             string        // omitempty
  vendorWebsite?:           string        // omitempty

  // ── Transaction ────────────────────────────────────────────────────
  transactionDate:          string        // "YYYY-MM-DD"
  transactionTime?:         string        // omitempty, "HH:MM:SS"
  transactionReceiptNumber?: string       // omitempty
  paymentMethod?:           string        // omitempty
  currency:                 string        // e.g. "GBP"

  // ── Totals ─────────────────────────────────────────────────────────
  totalNet:                 number
  totalVat:                 number
  totalGross:               number
  reclaimableVat:           number
  nonReclaimableVat:        number
  partialVatPending:        number        // >0 means partial items need user confirmation
  effectiveReclaimPct:      number        // 0.0–1.0

  // ── VAT metadata ───────────────────────────────────────────────────
  ocrConfidence:            number        // 0–100
  riskFlagsJson:            string        // Raw JSON string — parse before use
  vatSchemeNote?:           string        // omitempty
  reverseChargeApplicable:  boolean
  receiptLevelIssues?:      string        // omitempty — pipe-separated or prose
  parseNotes?:              string        // omitempty
  suggestedChatQuestions?:  string[]      // omitempty

  // ── Return tracking ────────────────────────────────────────────────
  vatReturnPeriod?:         string        // omitempty — e.g. "2026-Q1"
  addedToReturn:            boolean

  // ── User data ──────────────────────────────────────────────────────
  userNotes?:               string        // omitempty
  imageURL:                 string        // S3 presigned URL — use immediately

  // ── Line items ─────────────────────────────────────────────────────
  lineItems:                LineItemApiResponse[]
}