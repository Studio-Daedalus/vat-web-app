// ─── src/types/sampleApiResponses.ts ─────────────────────────────────────────
//
// Sample data that mirrors real API responses exactly.
// Use this to develop the frontend before the backend is ready.
//
// Switching to real data later is a one-line change per call:
//   const data = await fetch('/api/dashboard').then(r => r.json())
//   // vs
//   const data = sampleDashboardResponse

import type {
  ApiResponse,
  DashboardApiResponse,
  ReceiptListResponse,
  UserApiResponse,
} from './api'

// ─── User ─────────────────────────────────────────────────────────────────────

export const sampleUserResponse: ApiResponse<UserApiResponse> = {
  ok: true,
  error: null,
  data: {
    id: 'usr_01HXYZ',
    first_name: 'Josh',
    last_name: 'Hellawell',
    occupation: 'Software Engineer',
    email: 'josh@example.com',
    vat_number: 'GB123456789',
    stagger: 1, // Quarters end Mar / Jun / Sep / Dec
    plan_tier: 'core',
    scans_used: 23,
    scans_limit: 200,
  },
}

// ─── DashboardPage ────────────────────────────────────────────────────────────────

export const sampleDashboardResponse: ApiResponse<DashboardApiResponse> = {
  ok: true,
  error: null,
  data: {
    quarter: {
      start_date: '2026-01-01',
      end_date: '2026-03-31',
      stagger: 1,
      total_reclaimed: 421.6,
      total_spend: 1514.49,
      receipt_count: 10,
      submitted_to_hmrc: false,
    },
    trend: [
      { date: '1 Jan', vat: 0 },
      { date: '8 Jan', vat: 18.4 },
      { date: '15 Jan', vat: 62.8 },
      { date: '22 Jan', vat: 95.2 },
      { date: '29 Jan', vat: 95.2 },
      { date: '5 Feb', vat: 142.6 },
      { date: '12 Feb', vat: 189.3 },
      { date: '19 Feb', vat: 247.5 },
      { date: '26 Feb', vat: 247.5 },
      { date: '5 Mar', vat: 312.8 },
      { date: '12 Mar', vat: 356.4 },
      { date: '19 Mar', vat: 398.1 },
      { date: '26 Mar', vat: 421.6 },
      { date: '31 Mar', vat: 421.6 },
    ],
    stats: {
      vat_reclaimed: 421.6,
      pending_count: 1,
      pending_amount: 1.46,
      flagged_count: 1,
    },
  },
}

// ─── Receipts list ────────────────────────────────────────────────────────────
export const sampleReceiptsResponse: ApiResponse<ReceiptListResponse> = {
  ok: true,
  error: null,
  data: {
    count: 10,
    receipts: [
      {
        id: '1',
        status: 'COMPLETE',
        created_at: '2026-03-14T10:22:00Z',
        vendor: 'Tesco Express',
        vendor_vat_no: 'GB123456789',
        receipt_date: '2026-03-14',
        currency: 'GBP',
        gross_total: 23.4,
        vat_amount: 3.9,
        net_amount: 19.5,
        category: 'Groceries',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '2',
        status: 'COMPLETE',
        created_at: '2026-03-08T16:44:00Z',
        vendor: 'Amazon Business',
        vendor_vat_no: 'GB987654321',
        receipt_date: '2026-03-08',
        currency: 'GBP',
        gross_total: 144.0,
        vat_amount: 24.0,
        net_amount: 120.0,
        category: 'Equipment',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '3',
        status: 'COMPLETE',
        created_at: '2026-02-08T11:00:00Z',
        vendor: 'BT Business',
        vendor_vat_no: 'GB111222333',
        receipt_date: '2026-02-08',
        currency: 'GBP',
        gross_total: 84.0,
        vat_amount: 14.0,
        net_amount: 70.0,
        category: 'Utilities',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '4',
        status: 'COMPLETE',
        created_at: '2026-03-10T09:10:00Z',
        vendor: 'Costa Coffee',
        vendor_vat_no: 'GB444555666',
        receipt_date: '2026-03-10',
        currency: 'GBP',
        gross_total: 8.75,
        vat_amount: 1.46,
        net_amount: 7.29,
        category: 'Meals',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '5',
        status: 'COMPLETE',
        created_at: '2026-03-05T08:30:00Z',
        vendor: 'Shell Garage',
        vendor_vat_no: null,
        receipt_date: '2026-03-05',
        currency: 'GBP',
        gross_total: 85.2,
        vat_amount: 14.2,
        net_amount: 71.0,
        category: 'Fuel',
        confidence: 'low',
        parse_notes: null,
        vat_issues: ['No VAT number on receipt — verify with supplier.'],
      },
      {
        id: '6',
        status: 'COMPLETE',
        created_at: '2026-01-31T13:15:00Z',
        vendor: 'Royal Mail',
        vendor_vat_no: null,
        receipt_date: '2026-01-31',
        currency: 'GBP',
        gross_total: 18.6,
        vat_amount: 0.0,
        net_amount: 18.6,
        category: 'Postage',
        confidence: 'high',
        parse_notes: null,
        vat_issues: ['VAT exempt — no VAT reclaimable on postage services.'],
      },
      {
        id: '7',
        status: 'COMPLETE',
        created_at: '2026-03-12T14:05:00Z',
        vendor: 'Screwfix',
        vendor_vat_no: 'GB232555575',
        receipt_date: '2026-03-12',
        currency: 'GBP',
        gross_total: 204.0,
        vat_amount: 34.0,
        net_amount: 170.0,
        category: 'Materials',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '8',
        status: 'COMPLETE',
        created_at: '2026-01-24T17:00:00Z',
        vendor: 'Freelancer Invoice',
        vendor_vat_no: null,
        receipt_date: '2026-01-24',
        currency: 'GBP',
        gross_total: 600.0,
        vat_amount: 0.0,
        net_amount: 600.0,
        category: 'Subcontract',
        confidence: 'medium',
        parse_notes: null,
        vat_issues: ['No VAT number on invoice — verify with supplier.'],
      },
      {
        id: '9',
        status: 'COMPLETE',
        created_at: '2026-01-20T08:45:00Z',
        vendor: 'WeWork Day Pass',
        vendor_vat_no: 'GB777888999',
        receipt_date: '2026-01-20',
        currency: 'GBP',
        gross_total: 45.0,
        vat_amount: 7.5,
        net_amount: 37.5,
        category: 'Office',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
      {
        id: '10',
        status: 'COMPLETE',
        created_at: '2026-01-15T09:00:00Z',
        vendor: 'British Gas Business',
        vendor_vat_no: 'GB000111222',
        receipt_date: '2026-01-15',
        currency: 'GBP',
        gross_total: 312.0,
        vat_amount: 15.6,
        net_amount: 296.4,
        category: 'Utilities',
        confidence: 'high',
        parse_notes: null,
        vat_issues: null,
      },
    ],
  },
}

// ─── Error example ────────────────────────────────────────────────────────────
// Useful for testing error states in the UI.

export const sampleErrorResponse: ApiResponse<never> = {
  ok: false,
  data: null,
  error: {
    code: 'UNAUTHORIZED',
    message: 'Your session has expired. Please sign in again.',
  },
}
