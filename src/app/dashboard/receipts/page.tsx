import ReceiptsPage from '@/containers/ReceiptsPage/ReceiptsPage'
import { GetAllReceipts } from '@/lib/server/receipts/getAllReceipts'

// This forces the build to run dynamically, rather than requiring an active endpoint
export const dynamic = 'force-dynamic'

export default async function Receipts() {
  const result = await GetAllReceipts()
  if (!result.ok) throw new Error(result.message)

  return <ReceiptsPage receipts={result.data.receipts} />
}
