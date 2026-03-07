import { notFound } from 'next/navigation'
import ReceiptInfoPage from '@/containers/ReceiptInfoPage/ReceiptInfoPage'
import { GetReceipt } from '@/lib/server/receipts/getReceipt'

export const dynamic = 'force-dynamic'

export default async function ReceiptID({ params }: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await GetReceipt(id)
  if (!result.ok) {
    if (result.status === 404) notFound()
    throw new Error(result.message)
  }

  return <ReceiptInfoPage receipt={result.data} />
}