import DashboardPage from '@/containers/DashboardPage/DashboardPage'
import {
  sampleDashboardResponse,
  sampleUserResponse,
} from '@/types/SampleAPIResponses'
import {
  transformDashboardStats,
  transformTrend,
} from '@/types/transformers'

export default async function Dashboard() {
  // (Sample data) fetch from API here
  const userData = sampleUserResponse.data
  const dashboardData = sampleDashboardResponse.data
  if (!dashboardData) throw new Error('No dashboard data')

  // Transform the API responses into the expected shape
  const stats = transformDashboardStats(dashboardData)
  const trend = transformTrend(dashboardData.trend)

  return (
    <DashboardPage
      userName={userData?.first_name}
      stats={stats}
      trendData={trend}
    />
  )
}