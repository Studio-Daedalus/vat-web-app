import ReceiptsPage from '@/containers/ReceiptsPage/ReceiptsPage'
import { sampleReceiptsResponse } from '@/types/SampleAPIResponses'
import { transformReceiptsList } from '@/types/transformers'

export default function Receipts() {
  const receiptData = sampleReceiptsResponse.data
  if (!receiptData) throw new Error('No receipt data')
  const receipts = transformReceiptsList(receiptData)

  return <ReceiptsPage receipts={receipts} />
}
