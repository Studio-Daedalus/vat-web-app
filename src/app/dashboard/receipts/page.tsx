import ReceiptUploader from '@/components/ReceiptUploader/ReceiptUploader'
import ReceiptHistoryTable from '@/components/ReceiptTable'

export default function ReceiptPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Receipt Info</h1>
      <ReceiptUploader />
      <ReceiptHistoryTable />
    </div>
  )
}
