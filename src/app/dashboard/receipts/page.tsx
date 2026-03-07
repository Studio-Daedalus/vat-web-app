import ReceiptsPage from '@/containers/ReceiptsPage/ReceiptsPage'
import { GetAllReceipts } from '@/lib/server/receipts/getAllReceipts'
import { transformReceiptsList } from '@/types/transformers'

export default async function Receipts() {
  const result = await GetAllReceipts()
  if (!result.ok) throw new Error(result.message)

  return <ReceiptsPage receipts={result.data.receipts} />
}
