import DashboardPage from '@/containers/DashboardPage/DashboardPage'
import { sampleDashboardResponse } from '@/types/SampleAPIResponses'
import {
  transformDashboardStats,
  transformTrend,
} from '@/types/transformers'
import { GetUser } from '@/lib/server/user/getUser'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const result = await GetUser()
  if (!result.ok) throw new Error(result.message)

  // (Sample data) fetch from API here
  const dashboardData = sampleDashboardResponse.data
  if (!dashboardData) throw new Error('No dashboard data')

  // Transform the API responses into the expected shape
  const stats = transformDashboardStats(dashboardData)
  const trend = transformTrend(dashboardData.trend)

  return (
    <DashboardPage
      stats={stats}
      trendData={trend}
      user={result.user}
    />
  )
}