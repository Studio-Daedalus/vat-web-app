import type { Receipt } from '@/components/ReceiptTable'
import type { VatCheck, VatPeriod } from '@/components/VatChecks/vatChecksTypes'

// ─── Dashboard summary data ───────────────────────────────────────────────────

export type DashboardData = {
  // User / account
  userName: string
  planName: string

  // Current VAT period
  period: VatPeriod

  // Receipts
  recentReceipts: Receipt[] // Most recent 5, newest first
  totalReceiptsCount: number // All receipts this period

  // VAT checks — unresolved issues only (errors + warnings)
  openChecks: VatCheck[]
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_DASHBOARD: DashboardData = {
  userName: 'Jane Doe',
  planName: 'Growth',

  period: {
    label: 'Q1 2026 (Jan – Mar)',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    submissionDeadline: '2026-05-07',
    status: 'needs-attention',
    vatCollected: 3_840.0,
    vatReclaimable: 1_014.81,
    netLiability: 2_825.19,
    taxableTurnover: 68_400.0,
    registrationThreshold: 90_000.0,
  },

  totalReceiptsCount: 10,

  recentReceipts: [
    {
      id: '1',
      vendor: 'Tesco Express',
      date: '2026-02-14',
      totalAmount: 23.4,
      vatAmount: 3.9,
      vatRate: 'standard',
      reclaimable: true,
      status: 'claimed',
    },
    {
      id: '2',
      vendor: 'Amazon Business',
      date: '2026-02-11',
      totalAmount: 119.99,
      vatAmount: 20.0,
      vatRate: 'standard',
      reclaimable: true,
      status: 'claimed',
    },
    {
      id: '3',
      vendor: 'BT Business',
      date: '2026-02-08',
      totalAmount: 84.0,
      vatAmount: 14.0,
      vatRate: 'standard',
      reclaimable: true,
      status: 'pending',
    },
    {
      id: '4',
      vendor: 'Costa Coffee',
      date: '2026-02-06',
      totalAmount: 12.5,
      vatAmount: 2.08,
      vatRate: 'standard',
      reclaimable: false,
      status: 'flagged',
      flagReason: 'Entertainment expense — reclaimability unclear',
    },
    {
      id: '5',
      vendor: 'Shell Petrol',
      date: '2026-02-04',
      totalAmount: 95.0,
      vatAmount: 15.83,
      vatRate: 'standard',
      reclaimable: true,
      status: 'claimed',
    },
  ],

  openChecks: [
    {
      id: '1',
      severity: 'error',
      category: 'missing-vat-number',
      title: 'No VAT number on invoice',
      description:
        'Your invoice from Freelancer Invoice has no supplier VAT number. HMRC can reject this claim.',
      recommendation:
        'Contact the supplier and request a VAT invoice with their VAT registration number.',
      affectedVendor: 'Freelancer Invoice',
      affectedDate: '2026-01-24',
      affectedAmount: 0,
      resolved: false,
    },
    {
      id: '2',
      severity: 'warning',
      category: 'reclaimability',
      title: 'Entertainment expense — partial reclaim only',
      description:
        'Costa Coffee may be a client entertainment expense. HMRC generally blocks VAT reclaims on these.',
      recommendation:
        'Confirm whether this was staff-only or client entertainment and update your records.',
      affectedVendor: 'Costa Coffee',
      affectedDate: '2026-02-06',
      affectedAmount: 2.08,
      resolved: false,
    },
    {
      id: '3',
      severity: 'warning',
      category: 'reverse-charge',
      title: 'Possible reverse charge applies',
      description:
        'Freelancer Invoice may be from an overseas supplier — the domestic reverse charge could apply.',
      recommendation: 'Check whether the supplier is UK VAT-registered.',
      affectedVendor: 'Freelancer Invoice',
      affectedDate: '2026-01-24',
      resolved: false,
    },
  ],
}
