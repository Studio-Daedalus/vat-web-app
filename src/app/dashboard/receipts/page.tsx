import ReceiptsPage from '@/containers/ReceiptsPage/ReceiptsPage'
import { SearchUserReceipts } from '@/lib/server/receipts/searchUserReceipts'

// This forces the build to run dynamically, rather than requiring an active endpoint
export const dynamic = 'force-dynamic'

export default async function Receipts() {
  const result = await SearchUserReceipts()
  if (!result.ok) throw new Error(result.message)

  return <ReceiptsPage data={result.data} />
}
