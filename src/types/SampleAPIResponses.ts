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
} from './api'

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
    recent_receipts: [],
  },
}
