import ReceiptUploader from '@/components/ReceiptUploader'


export default function ReceiptPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Receipt Info</h1>
      <div className="p-6">
        <ReceiptUploader />
      </div>
    </div>
  )
}
