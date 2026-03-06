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
  ListReceiptsResponse,
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

export const sampleReceiptsResponse: ApiResponse<ListReceiptsResponse> = {
  ok: true,
  error: null,
  data: {
    total: 10,
    page: 1,
    page_size: 25,
    receipts: [
      {
        id: '1',
        vendor: 'Tesco Express',
        date: '2026-03-14',
        total_amount: 23.4,
        vat_amount: 3.9,
        vat_rate: 'standard',
        reclaimable: true,
        status: 'claimed',
        flag_reason: null,
        category: 'Groceries',
        image_key: 'receipts/usr_01HXYZ/1.jpg',
        created_at: '2026-03-14T10:22:00Z',
      },
      {
        id: '2',
        vendor: 'Amazon Business',
        date: '2026-03-08',
        total_amount: 144.0,
        vat_amount: 24.0,
        vat_rate: 'standard',
        reclaimable: true,
        status: 'claimed',
        flag_reason: null,
        category: 'Equipment',
        image_key: 'receipts/usr_01HXYZ/4.jpg',
        created_at: '2026-03-08T16:44:00Z',
      },
      {
        id: '3',
        vendor: 'BT Business',
        date: '2026-02-08',
        total_amount: 84.0,
        vat_amount: 14.0,
        vat_rate: 'standard',
        reclaimable: true,
        status: 'pending',
        flag_reason: null,
        category: 'Utilities',
        image_key: 'receipts/usr_01HXYZ/6.jpg',
        created_at: '2026-02-08T11:00:00Z',
      },
      {
        id: '4',
        vendor: 'Costa Coffee',
        date: '2026-03-10',
        total_amount: 8.75,
        vat_amount: 1.46,
        vat_rate: 'standard',
        reclaimable: false,
        status: 'pending',
        flag_reason: null,
        category: 'Meals',
        image_key: 'receipts/usr_01HXYZ/3.jpg',
        created_at: '2026-03-10T09:10:00Z',
      },
      {
        id: '5',
        vendor: 'Shell Garage',
        date: '2026-03-05',
        total_amount: 85.2,
        vat_amount: 14.2,
        vat_rate: 'standard',
        reclaimable: false,
        status: 'flagged',
        flag_reason: 'No VAT number on receipt — verify with supplier',
        category: 'Fuel',
        image_key: 'receipts/usr_01HXYZ/5.jpg',
        created_at: '2026-03-05T08:30:00Z',
      },
      {
        id: '6',
        vendor: 'Royal Mail',
        date: '2026-01-31',
        total_amount: 18.6,
        vat_amount: 0.0,
        vat_rate: 'exempt',
        reclaimable: false,
        status: 'claimed',
        flag_reason: null,
        category: 'Postage',
        image_key: 'receipts/usr_01HXYZ/7.jpg',
        created_at: '2026-01-31T13:15:00Z',
      },
      {
        id: '7',
        vendor: 'Screwfix',
        date: '2026-03-12',
        total_amount: 204.0,
        vat_amount: 34.0,
        vat_rate: 'standard',
        reclaimable: true,
        status: 'claimed',
        flag_reason: null,
        category: 'Materials',
        image_key: 'receipts/usr_01HXYZ/2.jpg',
        created_at: '2026-03-12T14:05:00Z',
      },
      {
        id: '8',
        vendor: 'Freelancer Invoice',
        date: '2026-01-24',
        total_amount: 600.0,
        vat_amount: 0.0,
        vat_rate: 'zero',
        reclaimable: false,
        status: 'flagged',
        flag_reason: 'No VAT number on invoice — verify with supplier',
        category: 'Subcontract',
        image_key: null,
        created_at: '2026-01-24T17:00:00Z',
      },
      {
        id: '9',
        vendor: 'WeWork Day Pass',
        date: '2026-01-20',
        total_amount: 45.0,
        vat_amount: 7.5,
        vat_rate: 'standard',
        reclaimable: true,
        status: 'claimed',
        flag_reason: null,
        category: 'Office',
        image_key: 'receipts/usr_01HXYZ/9.jpg',
        created_at: '2026-01-20T08:45:00Z',
      },
      {
        id: '10',
        vendor: 'British Gas Business',
        date: '2026-01-15',
        total_amount: 312.0,
        vat_amount: 15.6,
        vat_rate: 'reduced',
        reclaimable: true,
        status: 'pending',
        flag_reason: null,
        category: 'Utilities',
        image_key: 'receipts/usr_01HXYZ/10.jpg',
        created_at: '2026-01-15T09:00:00Z',
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
