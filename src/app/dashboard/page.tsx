'use client'

import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/user/getUser', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return (
    <div>
      <h1>Welcome {data.sub}</h1>
    </div>
  )
}