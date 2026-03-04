// ─── VAT Period ───────────────────────────────────────────────────────────────

export type VatPeriodStatus = 'ready' | 'needs-attention' | 'at-risk'

export type VatPeriod = {
  label: string // e.g. "Q1 2026 (Jan – Mar)"
  startDate: string // ISO
  endDate: string // ISO
  submissionDeadline: string // ISO — typically 1 month + 7 days after period end
  status: VatPeriodStatus
  vatCollected: number // Output VAT — what you charged customers
  vatReclaimable: number // Input VAT — what you can reclaim
  netLiability: number // vatCollected - vatReclaimable (what you owe HMRC)
  taxableTurnover: number // Rolling 12-month taxable turnover
  registrationThreshold: number // Currently £90,000
}

// ─── Check Items ──────────────────────────────────────────────────────────────

export type CheckSeverity = 'error' | 'warning' | 'info' | 'passed'

export type CheckCategory =
  | 'missing-vat-number'
  | 'incorrect-rate'
  | 'reclaimability'
  | 'duplicate'
  | 'threshold'
  | 'reverse-charge'
  | 'flat-rate'
  | 'general'

export type VatCheck = {
  id: string
  severity: CheckSeverity
  category: CheckCategory
  title: string // Short headline
  description: string // Plain-English explanation
  recommendation: string // What to do about it
  affectedVendor?: string // Receipt vendor, if applicable
  affectedDate?: string // Receipt date ISO, if applicable
  affectedAmount?: number // VAT amount at risk, if applicable
  resolved: boolean
}

// ─── Demo data ────────────────────────────────────────────────────────────────

export const DEMO_PERIOD: VatPeriod = {
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
}

export const DEMO_CHECKS: VatCheck[] = [
  {
    id: '1',
    severity: 'error',
    category: 'missing-vat-number',
    title: 'No VAT number on invoice',
    description:
      'Your invoice from Freelancer Invoice (Jan 24) has no supplier VAT number. HMRC can reject input tax claims on invoices that lack this.',
    recommendation:
      'Contact the supplier and request a VAT invoice with their VAT registration number before submitting your return.',
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
      "Costa Coffee (Feb 6) is likely a business entertainment expense. HMRC generally blocks VAT reclaims on entertainment unless it's for employees only.",
    recommendation:
      'If this was a client meeting, you cannot reclaim the VAT. If it was a staff-only expense, you can — add a note to your records to confirm.',
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
      'If Freelancer Invoice is from an overseas supplier, the domestic reverse charge may apply — meaning you account for VAT yourself rather than reclaiming it.',
    recommendation:
      "Check whether the supplier is UK VAT-registered. If they're outside the UK, apply the reverse charge and report it on your return.",
    affectedVendor: 'Freelancer Invoice',
    affectedDate: '2026-01-24',
    affectedAmount: 0,
    resolved: false,
  },
  {
    id: '4',
    severity: 'info',
    category: 'incorrect-rate',
    title: 'Reduced rate applied to energy bill',
    description:
      'British Gas Business (Jan 15) correctly uses the 5% reduced rate for business energy — this is right and does not need changing.',
    recommendation: 'No action needed. This is noted for your records.',
    affectedVendor: 'British Gas Business',
    affectedDate: '2026-01-15',
    affectedAmount: 15.6,
    resolved: false,
  },
  {
    id: '5',
    severity: 'info',
    category: 'threshold',
    title: 'Approaching VAT registration threshold',
    description:
      "Your rolling 12-month taxable turnover is £68,400 — 76% of the £90,000 registration threshold. You don't need to register yet, but keep monitoring.",
    recommendation:
      'If turnover looks likely to exceed £90,000 in the next 30 days, you must register for VAT immediately.',
    resolved: false,
  },
  {
    id: '6',
    severity: 'passed',
    category: 'general',
    title: 'All receipts have valid dates',
    description:
      'Every receipt in this period falls within the correct VAT quarter.',
    recommendation: '',
    resolved: false,
  },
  {
    id: '7',
    severity: 'passed',
    category: 'general',
    title: 'Standard-rated items correctly identified',
    description:
      '8 of 10 receipts correctly apply the 20% standard rate. No rate mismatches detected.',
    recommendation: '',
    resolved: false,
  },
  {
    id: '8',
    severity: 'passed',
    category: 'general',
    title: 'No duplicate receipts detected',
    description:
      'No duplicate vendor/date/amount combinations found in this period.',
    recommendation: '',
    resolved: false,
  },
]
