import ReceiptHistoryTable from '@/components/ReceiptTable'
import ScanReceiptButton from '@/components/ScanReceiptButton'

export default function ReceiptPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: '#2B3A2E', fontFamily: 'Manrope, sans-serif' }}
          >
            Receipts
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#7A8A7E' }}>
            Upload receipts and track your reclaimable VAT.
          </p>
        </div>

        {/* Responsive scan button — label changes at sm breakpoint */}
        <ScanReceiptButton />
      </div>

      {/* Full-width receipt table */}
      <ReceiptHistoryTable />
    </div>
  )
}
