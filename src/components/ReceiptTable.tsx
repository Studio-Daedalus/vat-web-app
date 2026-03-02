'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type VatRate = 'standard' | 'reduced' | 'zero' | 'exempt'
type ReceiptStatus = 'claimed' | 'pending' | 'flagged'

export type Receipt = {
  id: string
  vendor: string
  date: string           // ISO date string e.g. "2026-02-14"
  totalAmount: number    // Gross amount in GBP
  vatAmount: number      // VAT portion in GBP
  vatRate: VatRate
  reclaimable: boolean
  status: ReceiptStatus
  flagReason?: string    // Populated when status === 'flagged'
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_RECEIPTS: Receipt[] = [
  { id: '1',  vendor: 'Tesco Express',         date: '2026-02-14', totalAmount: 23.40,  vatAmount: 3.90,  vatRate: 'standard', reclaimable: true,  status: 'claimed' },
  { id: '2',  vendor: 'Amazon Business',        date: '2026-02-11', totalAmount: 119.99, vatAmount: 20.00, vatRate: 'standard', reclaimable: true,  status: 'claimed' },
  { id: '3',  vendor: 'BT Business',            date: '2026-02-08', totalAmount: 84.00,  vatAmount: 14.00, vatRate: 'standard', reclaimable: true,  status: 'pending' },
  { id: '4',  vendor: 'Costa Coffee',           date: '2026-02-06', totalAmount: 12.50,  vatAmount: 2.08,  vatRate: 'standard', reclaimable: false, status: 'flagged', flagReason: 'Entertainment expense — reclaimability unclear' },
  { id: '5',  vendor: 'Shell Petrol',           date: '2026-02-04', totalAmount: 95.00,  vatAmount: 15.83, vatRate: 'standard', reclaimable: true,  status: 'claimed' },
  { id: '6',  vendor: 'Royal Mail',             date: '2026-01-31', totalAmount: 18.60,  vatAmount: 0.00,  vatRate: 'exempt',   reclaimable: false, status: 'claimed' },
  { id: '7',  vendor: 'Screwfix',               date: '2026-01-28', totalAmount: 204.00, vatAmount: 34.00, vatRate: 'standard', reclaimable: true,  status: 'claimed' },
  { id: '8',  vendor: 'Freelancer Invoice',     date: '2026-01-24', totalAmount: 600.00, vatAmount: 0.00,  vatRate: 'zero',     reclaimable: false, status: 'flagged', flagReason: 'No VAT number on invoice — verify with supplier' },
  { id: '9',  vendor: 'WeWork Day Pass',        date: '2026-01-20', totalAmount: 45.00,  vatAmount: 7.50,  vatRate: 'standard', reclaimable: true,  status: 'claimed' },
  { id: '10', vendor: 'British Gas Business',   date: '2026-01-15', totalAmount: 312.00, vatAmount: 15.60, vatRate: 'reduced',  reclaimable: true,  status: 'pending' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const VAT_RATE_LABELS: Record<VatRate, string> = {
  standard: '20%',
  reduced:  '5%',
  zero:     '0%',
  exempt:   'Exempt',
}

const VAT_RATE_STYLES: Record<VatRate, { pill: string; dot: string }> = {
  standard: { pill: 'bg-[rgba(62,107,82,0.1)] text-[#3E6B52]',   dot: 'bg-[#3E6B52]' },
  reduced:  { pill: 'bg-[rgba(200,149,107,0.12)] text-[#A8703A]', dot: 'bg-[#C8956B]' },
  zero:     { pill: 'bg-[rgba(122,138,126,0.12)] text-[#5A6E5E]', dot: 'bg-[#7A8A7E]' },
  exempt:   { pill: 'bg-[rgba(122,138,126,0.12)] text-[#5A6E5E]', dot: 'bg-[#7A8A7E]' },
}

const STATUS_STYLES: Record<ReceiptStatus, { pill: string; label: string }> = {
  claimed: { pill: 'bg-[rgba(61,160,106,0.1)] text-[#2D8055]',   label: 'Claimed' },
  pending: { pill: 'bg-[rgba(212,135,74,0.12)] text-[#B86E2A]',  label: 'Pending' },
  flagged: { pill: 'bg-[rgba(196,90,74,0.1)] text-[#C45A4A]',    label: 'Flagged' },
}

type SortKey = 'date' | 'vendor' | 'totalAmount' | 'vatAmount'
type SortDir = 'asc' | 'desc'

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className="ml-1 inline-flex flex-col gap-[2px]">
      <svg
        width="8" height="8" viewBox="0 0 8 8" fill="none"
        className={active && dir === 'asc' ? 'opacity-100' : 'opacity-25'}
      >
        <path d="M4 1L7 6H1L4 1Z" fill="#2B3A2E" />
      </svg>
      <svg
        width="8" height="8" viewBox="0 0 8 8" fill="none"
        className={active && dir === 'desc' ? 'opacity-100' : 'opacity-25'}
      >
        <path d="M4 7L1 2H7L4 7Z" fill="#2B3A2E" />
      </svg>
    </span>
  )
}

function StatusPill({ status }: { status: ReceiptStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === 'claimed' ? 'bg-[#3DA06A]' :
          status === 'pending' ? 'bg-[#D4874A]' :
            'bg-[#C45A4A]'
      }`} />
      {s.label}
    </span>
  )
}

function VatRatePill({ rate }: { rate: VatRate }) {
  const s = VAT_RATE_STYLES[rate]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}>
      {VAT_RATE_LABELS[rate]}
    </span>
  )
}

function FlagTooltip({ reason }: { reason: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex cursor-default">
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C45A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border px-3 py-2 text-xs font-medium leading-relaxed opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
            style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0', color: '#2B3A2E' }}>
        {reason}
      </span>
    </span>
  )
}

// ─── Summary bar ─────────────────────────────────────────────────────────────

function SummaryBar({ receipts }: { receipts: Receipt[] }) {
  const totalVat    = receipts.filter(r => r.reclaimable).reduce((s, r) => s + r.vatAmount, 0)
  const totalSpend  = receipts.reduce((s, r) => s + r.totalAmount, 0)
  const flagged     = receipts.filter(r => r.status === 'flagged').length
  const pending     = receipts.filter(r => r.status === 'pending').length

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'VAT Reclaimable',  value: fmt(totalVat),       sub: 'From reclaimable receipts', accent: '#3E6B52' },
        { label: 'Total Spend',      value: fmt(totalSpend),      sub: `Across ${receipts.length} receipts`,    accent: '#2B3A2E' },
        { label: 'Pending Review',   value: String(pending),      sub: 'Awaiting confirmation',     accent: '#D4874A' },
        { label: 'Flagged',          value: String(flagged),      sub: 'Need your attention',       accent: '#C45A4A' },
      ].map(({ label, value, sub, accent }) => (
        <div
          key={label}
          className="rounded-xl border p-4"
          style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
        >
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: '#7A8A7E' }}>
            {label}
          </p>
          <p className="mt-1 text-xl font-bold" style={{ color: accent, fontFamily: 'Manrope, sans-serif' }}>
            {value}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: '#7A8A7E' }}>{sub}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

export default function ReceiptHistoryTable({ receipts = DEMO_RECEIPTS }: { receipts?: Receipt[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = receipts
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => r.vendor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'vendor') return mult * a.vendor.localeCompare(b.vendor)
      if (sortKey === 'date')   return mult * (new Date(a.date).getTime() - new Date(b.date).getTime())
      return mult * ((a[sortKey] as number) - (b[sortKey] as number))
    })

  const thClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest cursor-pointer select-none whitespace-nowrap'

  return (
    <div className="w-full">
      <SummaryBar receipts={receipts} />

      {/* Toolbar */}
      <div
        className="mb-3 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ backgroundColor: '#FAF8F3', borderColor: '#E0DAD0' }}
      >
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#7A8A7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search vendors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-lg border py-2 pl-8 pr-4 text-sm outline-none transition-colors duration-150 focus:border-[#6AAF7B]"
            style={{ backgroundColor: 'white', borderColor: '#E0DAD0', color: '#2B3A2E', width: '220px' }}
          />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2">
          {(['all', 'claimed', 'pending', 'flagged'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors duration-150"
              style={{
                backgroundColor: statusFilter === s ? '#3E6B52' : 'white',
                color:           statusFilter === s ? 'white' : '#7A8A7E',
                border: `1px solid ${statusFilter === s ? '#3E6B52' : '#E0DAD0'}`,
              }}
            >
              {s === 'all' ? 'All' : STATUS_STYLES[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: '#E0DAD0' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
            <tr style={{ backgroundColor: '#F0EDE6', borderBottom: '1px solid #E0DAD0' }}>
              <th
                className={thClass}
                style={{ color: '#7A8A7E' }}
                onClick={() => handleSort('vendor')}
              >
                Vendor <SortIcon active={sortKey === 'vendor'} dir={sortDir} />
              </th>
              <th
                className={thClass}
                style={{ color: '#7A8A7E' }}
                onClick={() => handleSort('date')}
              >
                Date <SortIcon active={sortKey === 'date'} dir={sortDir} />
              </th>
              <th
                className={`${thClass} text-right`}
                style={{ color: '#7A8A7E' }}
                onClick={() => handleSort('totalAmount')}
              >
                Total <SortIcon active={sortKey === 'totalAmount'} dir={sortDir} />
              </th>
              <th
                className={`${thClass} text-right`}
                style={{ color: '#7A8A7E' }}
                onClick={() => handleSort('vatAmount')}
              >
                VAT <SortIcon active={sortKey === 'vatAmount'} dir={sortDir} />
              </th>
              <th className={thClass} style={{ color: '#7A8A7E' }}>Rate</th>
              <th className={thClass} style={{ color: '#7A8A7E' }}>Reclaimable</th>
              <th className={thClass} style={{ color: '#7A8A7E' }}>Status</th>
            </tr>
            </thead>
            <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: '#7A8A7E', backgroundColor: '#FAF8F3' }}>
                  No receipts match your search.
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="transition-colors duration-100 hover:bg-[#F0EDE6]"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#FAF8F3' : 'white',
                    borderBottom: '1px solid #E0DAD0',
                  }}
                >
                  {/* Vendor */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{ backgroundColor: '#C4DCBE', color: '#3E6B52' }}
                      >
                        {r.vendor.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: '#2B3A2E' }}>
                          {r.vendor}
                        </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 tabular-nums" style={{ color: '#7A8A7E' }}>
                    {fmtDate(r.date)}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums" style={{ color: '#2B3A2E' }}>
                    {fmt(r.totalAmount)}
                  </td>

                  {/* VAT */}
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums" style={{ color: r.vatAmount > 0 ? '#3E6B52' : '#7A8A7E' }}>
                    {fmt(r.vatAmount)}
                  </td>

                  {/* Rate */}
                  <td className="px-4 py-3.5">
                    <VatRatePill rate={r.vatRate} />
                  </td>

                  {/* Reclaimable */}
                  <td className="px-4 py-3.5">
                    {r.reclaimable ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#3DA06A' }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Yes
                        </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#7A8A7E' }}>
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          No
                        </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center">
                      <StatusPill status={r.status} />
                      {r.status === 'flagged' && r.flagReason && (
                        <FlagTooltip reason={r.flagReason} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t px-4 py-3"
          style={{ backgroundColor: '#F0EDE6', borderColor: '#E0DAD0' }}
        >
          <p className="text-xs" style={{ color: '#7A8A7E' }}>
            Showing {filtered.length} of {receipts.length} receipts
          </p>
          <p className="text-xs" style={{ color: '#7A8A7E' }}>
            Total reclaimable VAT:{' '}
            <span className="font-semibold" style={{ color: '#3E6B52' }}>
              {fmt(filtered.filter(r => r.reclaimable).reduce((s, r) => s + r.vatAmount, 0))}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}